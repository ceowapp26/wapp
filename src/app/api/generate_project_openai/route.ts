import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ProjectStructure } from '@/types/code';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { match } from "ts-pattern";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

async function checkRateLimit(req: Request, config: { RPM?: number; RPD?: number }) {

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  
  if (config.RPM) {
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(config.RPM, "1 m"),
    });
    const result = await ratelimit.limit(`wapp_ratelimit_${ip}`);
    if (!result.success) {
      return new Response(JSON.stringify({
        error: "You have reached your request limit for the minute.",
        nextAllowedTime: new Date(result.reset).toISOString()
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
        },
      });
    }
  }

  if (config.RPD) {
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(config.RPD, "1 d"),
    });
    const result = await ratelimit.limit(`wapp_ratelimit_${ip}`);
    if (!result.success) {
      return new Response(JSON.stringify({
        error: "You have reached your request limit for the day.",
        nextAllowedTime: new Date(result.reset).toISOString()
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.reset.toString(),
        },
      });
    }
  }
  return null;
}

export async function POST(req: NextApiRequest): Promise<Response> {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing OPENAI_API_KEY - make sure to add it to your .env file.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  try {
    const { prompt, config, output } = await req.json();
    const rateLimitResponse = await checkRateLimit(req, config);
    if (rateLimitResponse) return rateLimitResponse;
    const response = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: config.max_tokens || 4096,
      stream: true,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("Error in POST request:", error);
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
