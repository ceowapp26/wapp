import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { resources, configurations } = req.body;

    try {
      const response = await fetch(`https://graph.facebook.com/v12.0/${process.env.INSTAGRAM_USER_ID}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: resources[0], // Assuming resources[0] is the image URL
          caption: configurations.caption,
          access_token: process.env.FACEBOOK_ACCESS_TOKEN,
        }),
      });

      const data = await response.json();

      return NextResponse.json({ message: 'Instagram upload successful', data });
    } catch (error) {
      return NextResponse.json({ message: 'Instagram upload failed', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}