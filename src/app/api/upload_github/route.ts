import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { resources, configurations } = req.body;

    try {
      const response = await fetch(`https://api.github.com/repos/${configurations.username}/${configurations.repo}/contents/${configurations.path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Upload via API',
          content: Buffer.from(resources[0]).toString('base64'), // Assuming resources[0] is the file content
        }),
      });

      const data = await response.json();

      return NextResponse.json({ message: 'GitHub upload successful', data });
    } catch (error) {
      return NextResponse.json({ message: 'GitHub upload failed', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }
}