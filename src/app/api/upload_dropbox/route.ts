import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { resources, configurations } = req.body;

    try {
      const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
          'Dropbox-API-Arg': JSON.stringify({
            path: `/${configurations.path}`,
            mode: 'add',
            autorename: true,
            mute: false,
          }),
          'Content-Type': 'application/octet-stream',
        },
        body: resources[0], // Assuming resources[0] is the file content
      });

      const data = await response.json();

      return res.status(200).json({ message: 'Dropbox upload successful', data });
    } catch (error) {
      return res.status(500).json({ message: 'Dropbox upload failed', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}