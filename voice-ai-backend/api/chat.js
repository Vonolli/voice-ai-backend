const OpenAI = require('openai');

module.exports = async function handler(req, res) {
  res.status(200).json({ message: 'Hello from API!' });
}
