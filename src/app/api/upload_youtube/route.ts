import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

const youtube = google.youtube({
  version: 'v3',
  auth: oauth2Client,
});

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { resources, configurations } = req.body;

    try {
      const response = await youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: configurations.title,
            description: configurations.description,
          },
          status: {
            privacyStatus: 'public',
          },
        },
        media: {
          body: resources[0], // Assuming resources[0] is the video file
        },
      });

      return NextResponse.json({ message: 'YouTube upload successful', data: response.data });
    } catch (error) {
      return NextResponse.json({ message: 'YouTube upload failed', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}