import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { match } from "ts-pattern";

export const runtime = "edge";

const llama = new OpenAI({
  apiKey: "ollama",
  baseURL: "http://localhost:11434/v1",
});

interface ChatCompletionMessageParam {
  role: string;
  content: string;
}

async function checkLocationSupport(req: Request): Promise<boolean> {

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");

  if (!ip) {
    console.error("Unable to determine client IP address");
    return false;
  }
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    const supportedCountries = ['US', 'CA', 'GB', 'DE', 'FR']; 
    return supportedCountries.includes(data.country_code);
  } catch (error) {
    console.error("Error checking location support:", error);
    return false;
  }
}

async function checkSupportedLocation(req: Request) {

  const isLocationSupported = await checkLocationSupport(req);

  if (!isLocationSupported) {
    return new Response(JSON.stringify({
      error: "Country, region, or territory not supported",
      code: "unsupported_country_region_territory",
      type: "request_forbidden"
    }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  return null;
}

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

export async function POST(req: Request): Promise<Response> {
  try {
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

    /*const supportedLocationResponse = await checkSupportedLocation(req);

    if (supportedLocationResponse) return supportedLocationResponse;*/

    const rateLimitResponse = await checkRateLimit(req, config);
    
    if (rateLimitResponse) return rateLimitResponse;

    const messages = match(command)
      .with("TEXT", () => [
        {
          role: "system",
          content: "You are an AI assistant that answers user input with detailed and contextually relevant responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ])
      .with("CODE", () => [
        {
          role: "system",
          content: "You are an AI assistant that helps users write code. Provide pure code snippets without any additional markdown or explanatory text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ])
      .with("IMAGE", () => [
        {
          role: "system",
          content: "You are an AI assistant that generates images based on the given text prompt. Ensure that the generated image reflects the prompt accurately.",
        },
        {
          role: "user",
          content: `Create an image based on the following description: ${prompt}`,
        },
      ])
      .with("AUDIO", () => [
        {
          role: "system",
          content: "You are an AI assistant that answers user input with detailed and contextually relevant responses.",
        },
        {
          role: "user",
          content: prompt,
        },
      ])
      .with("VIDEO", () => [
        {
          role: "system",
          content: "You are an AI assistant that generates video content based on the provided text prompt. Ensure that the video content is relevant to the prompt and of high quality.",
        },
        {
          role: "user",
          content: `Create a video based on this input: ${prompt}`,
        },
      ])
      .run() as ChatCompletionMessageParam[];

    const response = await openai.chat.completions.create({
      model,
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
  } catch (error: any) {  
    let status = 500;
    let errorMessage = "An unexpected error occurred";
    let errorCode = "unknown_error";
    let errorType = "internal_server_error";

    if (error.response) {
      status = error.response.status;
      if (error.error && error.error.type) {
        errorType = error.error.type;
      }
      if (error.error && error.error.code) {
        errorCode = error.error.code;
      }
      if (status === 429) {
        errorMessage = "Rate limit exceeded";
        errorCode = "rate_limit_exceeded";
      } else if (status === 403 && error.error && error.error.code === 'unsupported_country_region_territory') {
        errorMessage = "Unsupported region";
        errorCode = "unsupported_country_region_territory";
        errorType = "request_forbidden";
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return new Response(JSON.stringify({ 
      error: errorMessage, 
      status,
      code: errorCode,
      type: errorType
    }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}




