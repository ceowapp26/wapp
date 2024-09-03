// pages/api/generate_tests.ts
import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ProjectStructure {
  src: {
    [key: string]: { [fileName: string]: string };
  };
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { structure } = await req.json();

    const tests: { [key: string]: string } = {};

    for (const [folder, files] of Object.entries(structure.src)) {
      for (const [fileName, content] of Object.entries(files)) {
        const testPrompt = `
          Generate a comprehensive test file for the following codes:

          ${content}

          The test file should:
          1. Import necessary testing libraries (React Testing Library, Jest).
          2. Test all major functionalities of the code.
          3. Include both unit tests and integration tests where applicable.
          4. Use best practices for testing.
          5. Be named ${fileName.replace('.tsx', '')}.test.tsx

          Provide only the content of the test file.
        `;

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: testPrompt }],
        });

        const testContent = response.choices[0].message.content;
        const testFileName = `${fileName.replace('.tsx', '')}.test.tsx`;
        tests[testFileName] = testContent;

        const testFolderPath = path.join(process.cwd(), 'generated-code', 'tests');
        await fs.mkdir(testFolderPath, { recursive: true });
        const testFilePath = path.join(testFolderPath, testFileName);
        await fs.writeFile(testFilePath, testContent);
      }
    }

    return new Response(JSON.stringify(tests), {
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