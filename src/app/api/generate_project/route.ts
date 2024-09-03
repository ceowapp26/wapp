import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { ProjectStructure } from '@/types/code';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const generateProjectStructure = async (
  input: string,
  output: ProjectStructure,
  configs: any,
  existingStructure: ProjectStructure | null
): Promise<ProjectStructure> => {
  const structurePrompt = `
    Based on the provided input, generate a detailed project structure for a ${configs.development.framework} application. 
    The structure should include functional, production-ready code for each file and have corresponding test files in the appropriate 'tests' folders. 
    Ensure that the code provided is not just placeholders but actual, working code that adheres to best practices. 
    The goal is to provide a complete and functional project setup, including components, pages, utilities, hooks, context, and their respective tests. 
    This code is intended for production use and deployment.

    **Input:** ${input}
    **Existing Structure (if any):** ${JSON.stringify(existingStructure)}
    **Project Configs:** ${JSON.stringify(configs)}
    **Output Format:** ${JSON.stringify(output)}

    **Notes:**
    - Ensure the project structure aligns with best practices for ${configs.development.framework} applications.
    - Each component, page, and utility should have a corresponding test file in the 'tests' folder.
    - Generate actual, functional code for all files, not just placeholders or comments, ensuring to meet user requirements and follow best practices.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: structurePrompt }],
  });
  
  try {
    const cleanedResponse = response.choices[0].message.content.replace(/```json|```/g, '').trim();
    const parsedResponse = JSON.parse(cleanedResponse) as ProjectStructure;
    return validateProjectStructure(parsedResponse, output);
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    throw new Error('Failed to generate valid project structure');
  }
};

const validateProjectStructure = (response: ProjectStructure, expectedStructure: ProjectStructure): ProjectStructure => {
  const validate = (res: any, exp: any): any => {
    if (typeof exp === 'object' && exp !== null) {
      if (exp.type === 'file') {
        return {
          content: res?.content || exp.content,
          type: 'file',
        };
      } else if (exp.type === 'directory') {
        const validatedDir: any = { type: 'directory' };
        for (const key in exp) {
          if (key !== 'type') {
            validatedDir[key] = validate(res?.[key], exp[key]);
          }
        }
        return validatedDir;
      }
    }
    return res;
  };

  return validate(response, expectedStructure);
};

export async function POST(req: NextApiRequest): Promise<Response> {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing OPENAI_API_KEY - make sure to add it to your .env file.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { input, output, configs, existingStructure } = await req.json();
    const projectStructure = await generateProjectStructure(input, output, configs, existingStructure);
    return new Response(JSON.stringify(projectStructure), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
