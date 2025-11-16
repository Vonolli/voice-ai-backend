const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
    });

    const responseText = chatResponse.choices[0].message.content;

    const mp3Response = await openai.audio.speech.create({
  model: 'tts-1',
  voice: 'onyx',  // Changed to onyx for masculine Australian-ish voice
  input: responseText,
});

    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    res.json({
      text: responseText,
      audio: buffer.toString('base64'),
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
