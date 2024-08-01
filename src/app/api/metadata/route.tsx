import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { match } from "ts-pattern";

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

interface ChatCompletionMessageParam {
  role: string;
  content: string;
}

export async function POST(req: Request): Promise<Response> {
  // Create an OpenAI API client (that's edge friendly!)
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    //baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  });

  // Check if the OPENAI_API_KEY is set, if not return 400
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    return new Response(
      "Missing OPENAI_API_KEY - make sure to add it to your .env file.",
      {
        status: 400,
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { prompt, option } = await req.json();

  const messages = match(option)
    .with("icon", () => [
      {
        role: "system",
        content:
          "Please base on the context of the text suggest an icon from react-icons accordingly. Provide the name of the icon only. For example, 'FaBeer'.",
      },
      {
        role: "user",
        content: `This is the text: ${prompt}`,
      },
    ])
    .run() as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    stream: true,
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
