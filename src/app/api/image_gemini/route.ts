"use server";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import fetch from "node-fetch";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { match } from "ts-pattern";

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
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "") {
      return new Response(
        "Missing GOOGLE_API_KEY - make sure to add it to your .env file.",
        {
          status: 400,
        },
      );
    }

    let { prompt, command, model, contextContent, config } = await req.json();

    const rateLimitResponse = await checkRateLimit(req, config);
      
    if (rateLimitResponse) return rateLimitResponse

    let newPrompt;

    switch (command) {
      case "describe":
        newPrompt = "Describe the provided image";
        break;
      case "extract":
        newPrompt = "Extract text from the provided image. If there is no text on the image, return 'nothing to extract'.";
        break;
      default:
        throw new Error("Invalid option");
    }

    const imageUrl = extractImageUrl(prompt);

    const imageBuffer = await fetchImage(imageUrl);

    const base64EncodedImage = imageBuffer.toString('base64');

    const generationconfig = {
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

    const description = await generateImageDescription(newPrompt, base64EncodedImage, generationconfig, safetySettings, model);

    return new Response(JSON.stringify({ textInput: newPrompt, imageInput: base64EncodedImage, response: description }), {
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

function extractImageUrl(prompt: string): string {
  try {
    const startIndex = prompt.indexOf("(");
    const endIndex = prompt.indexOf(")");
    if (startIndex !== -1 && endIndex !== -1) {
      const imageUrl = prompt.substring(startIndex + 1, endIndex);
      return imageUrl;
    } else {
      throw new Error("Image URL not found in Markdown prompt");
    }
  } catch (error) {
    console.error("Error extracting image URL:", error);
    throw new Error("Invalid prompt format");
  }
}

async function fetchImage(imageUrl: string): Promise<Buffer> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from ${imageUrl}`);
    }
    const imageBuffer = await response.buffer();
    return imageBuffer;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Failed to fetch image");
  }
}

async function generateImageDescription(prompt: string, base64EncodedImage: string, generationConfig: any, safetySettings: any[], aiModel: string) {
  try {
    const image = {
      inlineData: {
        data: base64EncodedImage,
        mimeType: "image/png",
      },
    };
    const model = genAI.getGenerativeModel({
      model: aiModel,
    });
    const geminiStream = await model.generateContent([prompt, image]);
    const stream = geminiStream.response.text();
    return stream;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw new Error("Failed to generate image description");
  }
}