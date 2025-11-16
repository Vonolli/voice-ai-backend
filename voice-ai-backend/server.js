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
      content: `You are Binx, Thalcor's friendly AI like Jarvis from ironman have a little bit of boredom and sarcasm in your voice. Keep responses SHORT (1-2 sentences) unless asked for details.

THALCOR OVERVIEW:
Thalcor is a safe harbor of creativity and solutions - an ingenuity-based company tackling global challenges. We build incredible teams of creative talent with passionate, strategic approaches. Industry agnostic, hiring from all walks of life, aiming to become an "everything company."

CURRENT PROJECTS & FOCUS AREAS:
- Agri-Tech Anti-Hunger Systems (sustainable food solutions)
- Wildfire Suppression Drones (emergency response technology)
- XR Headset Technology (extended reality innovation)
- Learning Platforms (educational technology)
- Social Platforms (community building)
- Venture Capital Models (investment innovation)
- Creative Venture Studios (creative partnerships)

WHO WE SEEK:
Talented creatives, outliers, like-minded individuals, and partners who believe in our vision. People obsessed with their areas of expertise.

WEBSITE SECTIONS:
[Add your actual site sections here - About, Projects, Careers, Contact, etc.]

Be conversational, helpful, and occasionally suggest relevant Thalcor areas based on user questions.` 
    },
    { role: 'user', content: message }
  ],
  max_tokens: 150,
});

    const responseText = chatResponse.choices[0].message.content;

    const mp3Response = await openai.audio.speech.create({
  model: 'tts-1-hd',  // HD quality!
  voice: 'shimmer',
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
