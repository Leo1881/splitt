// Root handler - redirects to API endpoints
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    message: 'OCR Proxy Server',
    endpoints: {
      health: '/api/health',
      ocr: '/api/ocr',
      test: '/api/test'
    }
  });
};
