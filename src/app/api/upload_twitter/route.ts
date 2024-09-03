import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { resources } = req.body;

    try {
      const media = await client.post('media/upload', {
        media: resources[0], // Assuming resources[0] is the media file
      });

      const status = await client.post('statuses/update', {
        status: 'Uploaded via API',
        media_ids: media.media_id_string,
      });

      return NextResponse.json({ message: 'Twitter upload successful', data: status });
    } catch (error) {
      return NextResponse.json({ message: 'Twitter upload failed', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}