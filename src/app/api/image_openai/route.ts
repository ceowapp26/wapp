"use server";
import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import fs from "fs";
import path from "path";
import { NextApiResponse } from "next";

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
        }
      );
    }

    const { prompt, command, model, contextContent, config } = await req.json();

    /*const supportedLocationResponse = await checkSupportedLocation(req);

    if (supportedLocationResponse) return supportedLocationResponse;*/

    const rateLimitResponse = await checkRateLimit(req, config);
    
    if (rateLimitResponse) return rateLimitResponse;

    const generateImage = async () => {
      const res = await openai.images.generate({
        model: model,
        prompt: prompt,
      });
      return res.data[0].url;
    };

    const imageUrl = await generateImage();
    const imgResult = await fetch(imageUrl);
    const imageBuffer = await imgResult.buffer();
    const publicDir = path.join(process.cwd(), "public");
    const fileName = `${Date.now()}.png`;
    const publicImagePath = path.join(publicDir, "ai_images", fileName);

    if (!fs.existsSync(path.join(publicDir, "ai_images"))) {
      fs.mkdirSync(path.join(publicDir, "ai_images"), { recursive: true });
    }

    fs.writeFileSync(publicImagePath, imageBuffer);
    const newImageUrl = `/ai_images/${fileName}`;
    return new Response(JSON.stringify({ response: newImageUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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

