module.exports = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Health check works',
    hasApiKey: !!process.env.GOOGLE_VISION_API_KEY,
  });
};
