import OpenAI from "openai";
import { NextResponse } from 'next/server';

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
});

export async function POST(req: Request) {
  try {
    // Parse the request JSON
    const { transcript } = await req.json();

    // Call the OpenAI API to generate a summary
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes video transcripts." },
        { role: "user", content: `Please summarize the following transcript in a concise manner, providing key points with timestamps:\n\n${transcript}` }
      ],
    });

    // Extract the summary from the response
    const summary = response.choices[0].message.content;

    // Return the summary as a JSON response
    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('Error summarizing transcript:', error);
    // Return an error response
    return NextResponse.json({ error: 'Error summarizing transcript' }, { status: 500 });
  }
}
