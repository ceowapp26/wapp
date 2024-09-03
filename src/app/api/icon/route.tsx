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
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  });

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "") {
    return new Response(
      "Missing OPENAI_API_KEY - make sure to add it to your .env file.",
      {
        status: 400,
      },
    );
  }
  
  let { prompt, command, model, contextContent, config } = await req.json();

  if (!prompt || !command || !model || !contextContent || !config) {
    return new Response(
      "Missing required parameters.",
      {
        status: 400,
      },
    );
  }

  if (config.RPM && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(config.RPM, "1m"),
    });
    const { success, limit, reset, remaining } = await ratelimit.get(`notty_ratelimit_${ip}`);
    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  if (config.RPD && process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(config.RPD, "1d"),
    });
    const { success, limit, reset, remaining } = await ratelimit.get(`notty_ratelimit_${ip}`);
    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

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
    max_tokens: config.max_tokens || 4096,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}


