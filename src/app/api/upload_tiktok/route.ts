import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { resources, configurations } = req.body;

    try {
      const response = await fetch('https://api.tiktok.com/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video: resources[0], // Assuming resources[0] is the video file
          title: configurations.title,
          description: configurations.description,
        }),
      });

      const data = await response.json();

      return NextResponse.json({ message: 'TikTok upload successful', data });
    } catch (error) {
      return NextResponse.json({ message: 'TikTok upload failed', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}