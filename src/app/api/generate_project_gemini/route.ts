import { NextApiRequest, NextApiResponse } from 'next';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { match } from "ts-pattern";
import { ProjectStructure } from '@/types/code';

// Create an instance of Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
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
  if (!process.env.GOOGLE_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing OPENAI_API_KEY - make sure to add it to your .env file.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  try {
    const { prompt, config, output } = await req.json();
    const rateLimitResponse = await checkRateLimit(req, config);
    if (rateLimitResponse) return rateLimitResponse;
    const _message: Message[] = [{ role: 'user', content: prompt }];
    const generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: config.max_tokens || 3000,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    const geminiStream = await genAI
      .getGenerativeModel({ model: config.model, generationConfig, safetySettings })
      .generateContentStream(buildGoogleGenAIPrompt(_message));
    const stream = GoogleGenerativeAIStream(geminiStream);
    const response = new StreamingTextResponse(stream);
    const cleanedResponse = await response.text();
    const parsedResponse = JSON.parse(cleanedResponse) as ProjectStructure;
    return new Response(JSON.stringify(validateProjectStructure(parsedResponse, output)), {
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
