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
        },
      );
    }
    
    let { prompt, command, model, contextContent, config } = await req.json();
    
    const rateLimitResponse = await checkRateLimit(req, config);
    if (rateLimitResponse) return rateLimitResponse;

    const messages = match(command)
      .with("summary", () => [
        {
          role: "system",
          content: `Extract key keywords or phrases from the existing text:
            1. Identify and list the most important keywords or key phrases in the text. These keywords should capture the main topics, concepts, or subjects discussed in the text.
            2. If there are subtopics or secondary themes mentioned in the text, list them as well. Ensure that the extracted keywords accurately represent the content's context.
            3. Include the exact text span or sentence where each keyword or phrase is found in the original text.
            4. If there are any ambiguous keywords or phrases, indicate the uncertainty and provide possible interpretations or context that might clarify the intended meaning.
            5. Consider the context, relevance, and frequency of the keywords when determining their significance.
            6. If the text suggests any actions, decisions, or recommendations related to the extracted keywords, provide a brief summary of these insights.
            7. If the text length is below 50 words then simply return the text back with the response as follows:
            "Input Error
            The text length is not long enough to generate schema. 
             Text input
             {prompt}"
            8. In case you cannot return the expected data format, return the summary of the text instead.
            "Schema Error
            Fail to generate correct schema for this text. 
             Here is the text summary instead:
             ....."

            Ensure that your keyword extraction results are relevant, concise, and capture the essential topics within the text.

            Here's the output schema:
            {
              "mainKeyword": "MainKeyword",
              "summary": "Brief summary or description of the text.",
              "textSpan": "Exact text span or sentence where MainKeyword is found in the original text.",
              "associatedKeywords": [
                {
                  "keyword": "AssociatedKeyword1",
                  "summary": "Brief summary or description of AssociatedKeyword1.",
                  "textSpan": "Exact text span or sentence where AssociatedKeyword1 is found in the original text.",
                  "subKeywords": [
                    {
                      "keyword": "SubKeyword1.1",
                      "summary": "Brief summary or description of SubKeyword1.1.",
                      "textSpan": "Exact text span or sentence where SubKeyword1.1 is found in the original text.",
                      "subKeywords": []
                    },
                    {
                      "keyword": "SubKeyword1.2",
                      "summary": "Brief summary or description of SubKeyword1.2.",
                      "textSpan": "Exact text span or sentence where SubKeyword1.2 is found in the original text.",
                      "subKeywords": []
                    }
                  ]
                },
                {
                  "keyword": "AssociatedKeyword2",
                  "summary": "Brief summary or description of AssociatedKeyword2.",
                  "textSpan": "Exact text span or sentence where AssociatedKeyword2 is found in the original text.",
                  "subKeywords": [
                    {
                      "keyword": "SubKeyword2.1",
                      "summary": "Brief summary or description of SubKeyword2.1.",
                      "textSpan": "Exact text span or sentence where SubKeyword2.1 is found in the original text.",
                      "subKeywords": []
                    },
                    {
                      "keyword": "SubKeyword2.2",
                      "summary": "Brief summary or description of SubKeyword2.2.",
                      "textSpan": "Exact text span or sentence where SubKeyword2.2 is found in the original text.",
                      "subKeywords": []
                    }
                  ]
                }
              ]
            }
            Do not respond with your own suggestions or recommendations or feedback.`,
        },
        {
          role: "user",
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with("icon", () => [
        {
          role: "system",
          content: "Please base on the context of the text suggest an icon from react-icons accordingly. Provide the name of the icon only. For example, 'FaBeer'.",
        },
        {
          role: "user",
          content: `This is the text: ${prompt}`,
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
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
