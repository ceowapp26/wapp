// pages/api/generate_suggestions.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request): Promise<Response> {
  try {
    const { codeOutput } = await req.json();

    const suggestionPrompt = `
      Analyze the following code and provide suggestions for improvements or next steps:

      ${JSON.stringify(codeOutput, null, 2)}

      Provide a concise suggestion that addresses the most important aspect to improve or develop next.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: suggestionPrompt }],
    });

    const suggestion = response.choices[0].message.content;

    return new Response(JSON.stringify({ suggestion }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}