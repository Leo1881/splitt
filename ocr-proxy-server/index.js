// Simple OCR Proxy Server
// Deploy this to Vercel, Railway, or Render
// Your API key stays secure on the server

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger JSON payloads for base64 images

// Configure multer for memory storage (no disk writes)
const upload = multer({ storage: multer.memoryStorage() });

// Your Google Vision API key (set as environment variable)
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

if (!GOOGLE_VISION_API_KEY) {
  console.error('ERROR: GOOGLE_VISION_API_KEY environment variable not set!');
}

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      message: 'OCR Proxy Server is running',
      hasApiKey: !!GOOGLE_VISION_API_KEY 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// OCR endpoint - accepts both file upload and base64 JSON
app.post('/ocr', upload.single('image'), async (req, res) => {
  try {
    if (!GOOGLE_VISION_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OCR service not configured. Please set GOOGLE_VISION_API_KEY environment variable.',
      });
    }

    let base64Image;

    // Check if image is sent as file upload
    if (req.file) {
      base64Image = req.file.buffer.toString('base64');
    }
    // Check if image is sent as base64 in JSON body (for React Native)
    else if (req.body && req.body.image) {
      // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
      base64Image = req.body.image.replace(/^data:image\/\w+;base64,/, '');
    }
    else {
      return res.status(400).json({
        success: false,
        error: 'No image provided. Send as file upload or base64 in JSON body: { "image": "base64string" }',
      });
    }

    // Prepare request for Google Vision API
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    // Call Google Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Vision API Error:', errorText);
      return res.status(response.status).json({
        success: false,
        error: `OCR API error: ${response.status} ${response.statusText}`,
      });
    }

    const result = await response.json();

    // Extract text from response
    let extractedText = '';
    if (
      result.responses &&
      result.responses[0] &&
      result.responses[0].fullTextAnnotation
    ) {
      extractedText = result.responses[0].fullTextAnnotation.text;
    } else if (
      result.responses &&
      result.responses[0] &&
      result.responses[0].textAnnotations &&
      result.responses[0].textAnnotations.length > 0
    ) {
      extractedText = result.responses[0].textAnnotations[0].description;
    }

    if (!extractedText) {
      return res.json({
        success: false,
        error: 'No text detected in image',
        text: '',
      });
    }

    // Return OCR result
    res.json({
      success: true,
      text: extractedText,
    });
  } catch (error) {
    console.error('OCR Proxy Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

// Export for Vercel/serverless
// Vercel will handle routing automatically based on vercel.json
module.exports = app;
