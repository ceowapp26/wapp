import { NextApiRequest, NextApiResponse } from 'next';
import { Anthropic } from '@anthropic-ai/sdk';
import { ProjectStructure } from '@/types/code';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

// Create an instance of Anthropic
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

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

const validateProjectStructure = (response: ProjectStructure, expectedStructure: ProjectStructure): ProjectStructure => {
  const validate = (res: any, exp: any): any => {
    if (typeof exp === 'object' && exp !== null) {
      if (exp.type === 'file') {
        return {
          content: res?.content || exp.content,
          type: 'file',
        };
      } else if (exp.type === 'directory') {
        const validatedDir: any = { type: 'directory' };
        for (const key in exp) {
          if (key !== 'type') {
            validatedDir[key] = validate(res?.[key], exp[key]);
          }
        }
        return validatedDir;
      }
    }
    return res;
  };

  return validate(response, expectedStructure);
};

export async function POST(req: NextApiRequest): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY - make sure to add it to your .env file.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  try {
    const { prompt, config, output } = await req.json();
    const rateLimitResponse = await checkRateLimit(req, config);
    if (rateLimitResponse) return rateLimitResponse;
    const response = await anthropic.messages.create({
      max_tokens: config.max_tokens,
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
    });
    const parsedResponse = JSON.parse(response.content) as ProjectStructure;
    return new Response(JSON.stringify({ projectStructure: validateProjectStructure(parsedResponse, output), usage: response.usage }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
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