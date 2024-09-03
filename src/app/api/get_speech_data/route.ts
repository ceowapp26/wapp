import { NextApiRequest, NextApiResponse } from 'next';
import textToSpeech from '@google-cloud/text-to-speech';

const clientOptions = {
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
};

const client = new textToSpeech.TextToSpeechClient(clientOptions);

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [result] = await client.listVoices({});
    const structuredVoices = result.voices.map(voice => ({
      name: voice.name,
      ssmlGender: voice.ssmlGender,
      naturalSampleRateHertz: voice.naturalSampleRateHertz,
      languageCodes: voice.languageCodes
    }));
    const allLanguages = [...new Set(structuredVoices.flatMap(voice => voice.languageCodes))];
     return new Response(
      JSON.stringify({  
        voices: structuredVoices,
        languages: allLanguages 
      }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to list voices:', err);
    return new Response(JSON.stringify({ error: 'Failed to list voices' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

