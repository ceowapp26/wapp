import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request): Promise<Response> {
  try {
    const { fileName, existingCode, existingStructure } = await req.json();
    const regeneratePrompt = `
      Please regenerate and enhance the following React component. Ensure that the regenerated code is fully synchronized with the existing project structure and conventions. Address any potential issues in the current code and improve its functionality, readability, and maintainability. The existing project structure and conventions are as follows: ${existingStructure}

      ${existingCode}

      Your response should include:
      1. An improved version of the React component.
      2. Comments where necessary to explain the changes made.
      3. Any additional improvements to align with best practices.
    `;

    const codeResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: regeneratePrompt }],
    });

    const regeneratedCode = codeResponse.choices[0].message.content;

    // Enhanced prompt for generating the test file
    const testPrompt = `
      Generate a comprehensive test file for the following React component, ensuring it is in sync with the existing project structure and conventions. The test file should cover all major functionalities, edge cases, and integration points. 

      ${regeneratedCode}

      The test file should:
      1. Import necessary testing libraries (React Testing Library, Jest).
      2. Include unit tests and integration tests where applicable.
      3. Follow best practices for React component testing.
      4. Be named ${fileName.replace('.tsx', '')}.test.tsx.
      5. Include meaningful test descriptions and use descriptive test cases.

      Provide only the content of the test file.
    `;

    const testResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: testPrompt }],
    });

    const regeneratedTest = testResponse.choices[0].message.content;

    return new Response(JSON.stringify({ code: regeneratedCode, test: regeneratedTest }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
