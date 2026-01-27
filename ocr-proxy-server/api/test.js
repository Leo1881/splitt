// Simple test function
module.exports = (req, res) => {
  res.json({ message: 'Test function works!', timestamp: new Date().toISOString() });
};
