import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { match } from "ts-pattern";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
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
    if (!process.env.OPENAI_API_KEY) {
      return new Response("Missing OPENAI_API_KEY - make sure to add it to your .env file.", { status: 400 });
    }

    const { prompt, messages, embeddedContent, command, model, contextContent, config } = await req.json();

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
      .with("zap", () => `
        You are an advanced AI assistant capable of handling a wide range of tasks including but not limited to:
        - Answering questions and providing explanations on various topics
        - Analyzing and summarizing text
        - Generating creative content (stories, poems, scripts, etc.)
        - Solving mathematical and logical problems
        - Providing code snippets and explaining programming concepts
        - Offering advice and recommendations
        - Engaging in roleplay or simulations
        - Translating between languages
        - Extracting key information from given text
        Adhere to the following guidelines:
        1. Use Markdown formatting when appropriate to enhance readability.
        2. Provide concise yet comprehensive answers unless otherwise specified.
        3. If you're unsure about something, state your uncertainty clearly.
        4. Respect ethical boundaries and avoid harmful or illegal content.
        5. Adapt your language and complexity to the user's apparent level of understanding.
        6. When dealing with code, use appropriate syntax highlighting.
        Embedded content: ${JSON.stringify(embeddedContent)}
        Reference context: ${contextContent}
      `)
      .with("suggest-code", () => `Please review the following code:
        \`\`\`
        ${prompt}
        \`\`\`
        Provide suggestions on how to improve this code. Focus on aspects such as performance, readability, maintainability, and best practices. Highlight any potential issues or areas that could be optimized, and suggest alternative approaches or refactoring techniques. If applicable, mention any relevant design patterns or coding standards that could enhance the code quality.`)
      .with("explain-code", () => `Please explain the following code:
        \`\`\`
        ${prompt}
        \`\`\`
        Provide a detailed explanation of what the code does, its purpose, and how it works. Break down complex parts and use simple language. If there are any potential issues or best practices to note, mention those as well.`)
      .with("improve-code", () => `Please improve the following code:
      \`\`\`
      ${prompt}
      \`\`\`
      Suggest improvements to enhance readability, efficiency, or adherence to best practices. Provide explanations for your suggested changes. If the code is already well-written, acknowledge that and suggest any minor optimizations if possible.`)
      .with("selection", () => `Here is the context: \`${contextContent}\` for you as an AI assistant to answer the user's question. Please answer the question within this context. If the answer cannot be found based on the provided context, simply inform the user that "The answer could not be found based on the provided context." Use Markdown formatting when appropriate.`)
      .with("title", () => `Here is the context: \`${contextContent}\` for you as an AI assistant to generate a title. Please provide a title with less than 20 words.`)
      .otherwise(() => "You are an AI writing assistant that generates text based on a prompt. You take an input from the user and a command for generating the text. Use Markdown formatting when appropriate.");

    const formattedMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      userMessage
    ];

    const options = ["improve-code", "suggest-code", "explain-code"];

    if (options.includes(command)) {
      const response = await openai.chat.completions.create({
        model: model,
        messages: formattedMessages,
      });

      if (!response || !response.choices || response.choices.length === 0) {
        return new Response(JSON.stringify({ error: "No choices returned from OpenAI" }), { status: 500 });
      }

      return new Response(JSON.stringify({ content: response.choices[0].message.content }), { status: 200 });
    }

    const response = await openai.chat.completions.create({
      model,
      stream: true,
      messages: formattedMessages,
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