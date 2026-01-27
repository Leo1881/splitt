// Vercel serverless function for health check
module.exports = async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({
      status: 'ok',
      message: 'OCR Proxy Server is running',
      hasApiKey: !!process.env.GOOGLE_VISION_API_KEY,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};
