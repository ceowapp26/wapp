import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';
import { Storage } from '@google-cloud/storage';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import youtubeDl from 'youtube-dl-exec';
import { Readable } from 'stream';

const clientOptions = {
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}'),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
};

const speechClient = new SpeechClient(clientOptions);
const storage = new Storage(clientOptions);
const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || '';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const getYoutubeTranscript = async (videoId: string) => {
  try {
    const response = await youtube.captions.list({
      part: ['snippet'],
      videoId: videoId,
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('No captions found for this video');
    }

    const captionId = response.data.items[0].id;
    if (!captionId) {
      throw new Error('Caption ID not found');
    }

    const transcript = await youtube.captions.download({
      id: captionId,
      tfmt: 'srt',
    });

    return transcript.data;
  } catch (error) {
    console.error('Error fetching YouTube transcript:', error);
    throw new Error('Failed to fetch YouTube transcript');
  }
};

const downloadYoutubeAudio = async (videoId: string): Promise<Buffer> => {
  try {
    const output = await youtubeDl(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        extractAudio: true,
        audioFormat: 'wav',
        output: '-',
      }
    );

    return Buffer.from(output);
  } catch (error) {
    console.error('Error downloading YouTube audio:', error);
    throw new Error('Failed to download YouTube audio');
  }
};

const uploadToStorage = async (buffer: Buffer) => {
  const fileName = `${uuidv4()}.wav`;
  const file = storage.bucket(bucketName).file(fileName);
  await file.save(buffer);
  return `gs://${bucketName}/${fileName}`;
};

const getTranscriptFromAudio = async (audioUri: string) => {
  const audio = {
    uri: audioUri,
  };

  const config = {
    encoding: 'LINEAR16' as const,
    languageCode: 'en-US',
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [operation] = await speechClient.longRunningRecognize(request);
  const [response] = await operation.promise();
  
  const transcript = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcript;
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('audio') as File | null;
  const type = formData.get('type') as string | null;

  try {
    let transcript: string | undefined;
    let audioBuffer: Buffer | undefined;

    if (type === 'youtube') {
      const videoId = formData.get('videoId') as string | null;
      if (!videoId) {
        return NextResponse.json({ error: 'No YouTube video ID provided' }, { status: 400 });
      }

      try {
        transcript = await getYoutubeTranscript(videoId);
      } catch (error) {
        console.log('Failed to get YouTube transcript:', error.message);
        // Don't throw here, continue to try audio download
      }

      if (!transcript) {
        console.log('No transcript available, extracting audio from YouTube video...');
        try {
          audioBuffer = await downloadYoutubeAudio(videoId);
        } catch (downloadError) {
          console.error('Error downloading YouTube audio:', downloadError);
          return NextResponse.json({ error: 'Failed to download YouTube audio', details: downloadError.message }, { status: 500 });
        }
      }
    } else {
      if (!file) {
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
      }
      const arrayBuffer = await file.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
    }

    if (!transcript && audioBuffer) {
      try {
        const audioUri = await uploadToStorage(audioBuffer);
        transcript = await getTranscriptFromAudio(audioUri);
      } catch (transcriptionError) {
        console.error('Error transcribing audio:', transcriptionError);
        return NextResponse.json({ error: 'Failed to transcribe audio', details: transcriptionError.message }, { status: 500 });
      }
    }

    if (!transcript) {
      return NextResponse.json({ error: 'Failed to obtain transcript' }, { status: 500 });
    }

    return NextResponse.json({ transcript }, { status: 200 });
  } catch (error) {
    console.error('Error processing video:', error);
    return NextResponse.json({ error: 'Failed to process video', details: (error as Error).message }, { status: 500 });
  }
}


