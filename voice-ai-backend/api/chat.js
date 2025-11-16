import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini-tts',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
    });

    const responseText = chatResponse.choices[0].message.content;

    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: responseText,
    });

    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    res.status(200).json({
      text: responseText,
      audio: buffer.toString('base64'),
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}