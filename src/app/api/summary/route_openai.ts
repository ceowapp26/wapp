import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

// Create an OpenAI API client (that's edge-friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_TOKEN,
  // baseURL: "https://openrouter.ai/api/v1/",
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `notty_ratelimit_${ip}`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: `
You are an AI-powered summarization assistant. Your task is to generate a concise and informative summary based on the provided text. Pay attention to the following considerations:

1. **Key Points:** Identify and include the key points, main ideas, and crucial details presented in the text.

2. **Conciseness:** Aim for conciseness in your summary. Avoid unnecessary details and focus on conveying the most relevant information.

3. **Coherence:** Ensure that your summary maintains a logical flow and coherence. Present the information in a structured manner to enhance readability.

4. **Informativeness:** Provide a summary that is informative and captures the essence of the original text. Include important context and insights.

5. **Avoid Redundancy:** Refrain from repeating information unnecessarily. Summarize repetitive details in a way that adds value to the overall understanding.

6. **Limitations:** Be aware of any limitations or challenges in the text. Address them appropriately in the summary if they significantly impact the overall message.

7. **Accuracy:** Strive for accuracy in representing the content. Avoid introducing misleading information and ensure that the summary reflects the intended meaning.

8. **Length Limitation:** Limit your response to 200 words to maintain brevity and focus.

Your goal is to create a well-crafted summary that efficiently communicates the core information of the original text while adhering to the specified guidelines. Consider the factors mentioned above to deliver a high-quality summary.
        `,
        // Disable Markdown formatting for now
        // "Use Markdown formatting when appropriate.",
      },
      {
        role: "user",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        content: prompt,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
