// Vercel serverless function for health check
module.exports = (req, res) => {
  res.json({
    status: 'ok',
    message: 'OCR Proxy Server is running',
    hasApiKey: !!process.env.GOOGLE_VISION_API_KEY,
  });
};
