import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { match } from "ts-pattern";

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

export async function POST(req: Request): Promise<Response> {
  try {
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === "") {
      return new Response(
        "Missing GOOGLE_API_KEY - make sure to add it to your .env file.",
        {
          status: 400,
        },
      );
    }

    const { prompt, command, model, contextContent, config } = await req.json();

    const rateLimitResponse = await checkRateLimit(req, config);
    
    if (rateLimitResponse) return rateLimitResponse;

    let systemMessage = {
      role: "system",
      content: ""
    };

    let userMessage = {
      role: "user",
      content: prompt
    };

    systemMessage.content = match(command)
      .with("continue", () => "You are an AI writing assistant that continues existing text based on context from prior text. Give more weight/priority to the later characters than the beginning ones. Limit your response to no more than 200 characters, but make sure to construct complete sentences. Use Markdown formatting when appropriate.")
      .with("complete", () => "You are an AI writing assistant that completes existing text. Always make sure to construct complete sentences. Use Markdown formatting when appropriate.")
      .with("improve", () => "You are an AI writing assistant that improves existing text. Limit your response to no more than 200 characters, but make sure to construct complete sentences. Use Markdown formatting when appropriate.")
      .with("shorter", () => "You are an AI writing assistant that shortens existing text. Use Markdown formatting when appropriate.")
      .with("longer", () => "You are an AI writing assistant that lengthens existing text. Use Markdown formatting when appropriate.")
      .with("adjust", () => "You are an AI writing assistant that fine-tunes the tone of existing text according to its context. Use Markdown formatting when appropriate.")
      .with("feedback", () => "You are an AI writing assistant that provides feedback on existing text. Use Markdown formatting when appropriate.")
      .with("rephrase", () => "You're an AI writing assistant that rephrases existing text. Use Markdown formatting when appropriate.")
      .with("fix", () => "You are an AI writing assistant that fixes grammar and spelling errors in existing text. Limit your response to no more than 200 characters, but make sure to construct complete sentences. Use Markdown formatting when appropriate.")
      .with("zap", () => `You are an advanced AI assistant capable of handling a wide range of tasks including but not limited to: ...`)
      .with("suggest-code", () => `Please review the following code: \`\`\`${prompt}\`\`\` Provide suggestions on how to improve this code...`)
      .with("explain-code", () => `Please explain the following code: \`\`\`${prompt}\`\`\` Provide a detailed explanation...`)
      .with("improve-code", () => `Please improve the following code: \`\`\`${prompt}\`\`\` Suggest improvements...`)
      .with("selection", () => `Here is the context: \`${contextContent}\`...`)
      .with("title", () => `Here is the context: \`${contextContent}\`...`)
      .otherwise(() => "You are an AI writing assistant that generates text based on a prompt. Use Markdown formatting when appropriate.");

    const formattedMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      userMessage
    ];

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
      .getGenerativeModel({ model: model, generationConfig, safetySettings })
      .generateContentStream(buildGoogleGenAIPrompt(formattedMessages));
    const stream = GoogleGenerativeAIStream(geminiStream);
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




