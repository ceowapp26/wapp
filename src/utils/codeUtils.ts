"use server"
import path from 'path';
import fs from 'fs/promises';

export const writeUpdatedFile = async (filePath: string, content: string) => {
  try {
    const fullPath = path.join(process.cwd(), 'generated-code', filePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
    console.log(`File updated: ${fullPath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

const getStructure = (environment, codeframework) => {
  const option = codingOptions.find(
    (codeOption) =>
      codeOption.environment === environment &&
      codeOption.codeframework === codeframework
  );
  return option ? option.structure : undefined;
};
