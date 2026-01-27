// Vercel serverless function for OCR endpoint
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage() });
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;

app.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!GOOGLE_VISION_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OCR service not configured.',
      });
    }

    let base64Image;
    if (req.file) {
      base64Image = req.file.buffer.toString('base64');
    } else if (req.body?.image) {
      base64Image = req.body.image.replace(/^data:image\/\w+;base64,/, '');
    } else {
      return res.status(400).json({
        success: false,
        error: 'No image provided.',
      });
    }

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
        error: 'No text detected',
        text: '',
      });
    }

    res.json({ success: true, text: extractedText });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

module.exports = app;
