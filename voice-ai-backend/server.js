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
  messages: [
    { 
      role: 'system', 
      content: `You are Smithers, Thalcor's professional AI assistant like jarvis from ironman. Keep responses SHORT (2-3 sentences max) and helpful. 

ABOUT THALCOR:
Thalcor is a safe harbor of creativity and solutions - an ingenuity based art piece and conglomerate tackling global challenges. We build incredible teams of creative talent with passionate, strategic approaches. We're industry agnostic, hire from all walks of life, and aim to become an "everything company" solving pressing world issues through multi-disciplinary solutions.

CURRENT PROJECTS THAT WE ARE LOOKING INTO FURTHER:
- Agri-Tech Anti-Hunger Systems
- Wildfire Suppression Drones  
- XR Headset Technology
- Learning & Social Platforms
- Venture Capital Models
- Creative Venture Studios

We seek talented creatives, outliers, and partners who believe in our vision.` 
    },
    { role: 'user', content: message }
  ],
  max_tokens: 150,
});

    const responseText = chatResponse.choices[0].message.content;

    const mp3Response = await openai.audio.speech.create({
  model: 'tts-1',
  voice: 'fable',  // Changed for masculine British voice
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
