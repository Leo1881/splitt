// Root endpoint for Vercel
module.exports = (req, res) => {
  res.json({
    status: 'ok',
    message: 'OCR Proxy Server is running',
    endpoints: {
      health: '/api/health',
      ocr: '/api/ocr'
    },
    hasApiKey: !!process.env.GOOGLE_VISION_API_KEY,
  });
};
