// Vercel serverless function for OCR endpoint
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

    if (!GOOGLE_VISION_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OCR service not configured. Please set GOOGLE_VISION_API_KEY environment variable.',
      });
    }

    // Parse JSON body (Vercel automatically parses it)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!body || !body.image) {
      return res.status(400).json({
        success: false,
        error: 'No image provided. Send as JSON: { "image": "base64string" }',
      });
    }

    // Remove data URL prefix if present
    const base64Image = body.image.replace(/^data:image\/\w+;base64,/, '');

    // Call Google Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
          }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Vision API Error:', errorText);
      return res.status(response.status).json({
        success: false,
        error: `OCR API error: ${response.status}`,
      });
    }

    const result = await response.json();
    const extractedText = result.responses?.[0]?.fullTextAnnotation?.text ||
                         result.responses?.[0]?.textAnnotations?.[0]?.description || '';

    if (!extractedText) {
      return res.json({
        success: false,
        error: 'No text detected in image',
        text: '',
      });
    }

    res.json({ success: true, text: extractedText });
  } catch (error) {
    console.error('OCR Proxy Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
};
