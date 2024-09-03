import { NextApiRequest, NextApiResponse } from 'next';
import textToSpeech from '@google-cloud/text-to-speech';

const clientOptions = {
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
};

const client = new textToSpeech.TextToSpeechClient(clientOptions);

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  
  const { text, voice, language, speed } = await req.json();;

  if (!text || !voice || !language || typeof speed !== 'number') {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const request = {
    input: { text },
    voice: {
      languageCode: language,
      name: voice,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: speed,
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent.toString('base64');
    return new Response(
      JSON.stringify({
      audioUrl: `data:audio/mp3;base64,${audioContent}`,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to generate audio:', err.message);
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to generate audio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
