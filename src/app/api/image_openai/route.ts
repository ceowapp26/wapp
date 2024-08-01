"use server";
import OpenAI from "openai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { NextApiResponse } from "next";

async function checkRateLimit(req: Request, config: { RPM?: number; RPD?: number }) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }
  const ip = req.headers.get("x-forwarded-for");
  
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
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
