import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

// Create an instance of Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Convert messages from the Vercel AI SDK Format to the format
// that is expected by the Google GenAI SDK
const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});

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
  const { messages } = await req.json();

  const prompt = `
    Extract key keywords or phrases from the following text: ${JSON.stringify(messages)}

    1. Identify and list the most important keywords or key phrases in the text. These keywords should capture the main topics, concepts, or subjects discussed in the text.
    2. If there are subtopics or secondary themes mentioned in the text, list them as well. Ensure that the extracted keywords accurately represent the content's context.
    3. Include the exact text span or sentence where each keyword or phrase is found in the original text.
    4. If there are any ambiguous keywords or phrases, indicate the uncertainty and provide possible interpretations or context that might clarify the intended meaning.
    5. Consider the context, relevance, and frequency of the keywords when determining their significance.
    6. If the text suggests any actions, decisions, or recommendations related to the extracted keywords, provide a brief summary of these insights.

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

    Do not respond with your own suggestions or recommendations or feedback.
  `;

  const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 3000,
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

  // Get the generative model and generate content
  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro', generationConfig, safetySettings })
    .generateContentStream(buildGoogleGenAIPrompt(messages));

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
