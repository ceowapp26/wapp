import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

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