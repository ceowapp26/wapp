import { v4 as uuidv4 } from 'uuid';
import { ChatInterface, ConfigCollectionInterface } from '@/types/chat';
import { ModelOption } from '@/types/ai';
import { defaultModel } from '@/constants/ai';
import { useStore } from '@/redux/features/apps/document/store';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

export const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 3000,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};

export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const date = new Date();

const dateString =
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2);

export const _defaultSystemMessage =
`You are ChatGPT, a large language model trained by OpenAI.
Carefully heed the user's instructions. 
Respond using Markdown.`;

export const AIModel: ModelOption[] = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k-0613',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-0125',
  'gpt-4o',
  'gpt-4o-2024-05-13',
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  'gpt-4',
  'gpt-4-32k',
  'gpt-4-1106-preview',
  'gpt-4-0125-preview',
  'gpt-4-turbo',
  'gpt-4-turbo-2024-04-09',
  'gemini-1.0-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  // 'gpt-3.5-turbo-0301',
  // 'gpt-4-0314',
  // 'gpt-4-32k-0314',
];

export const FilterChatOptions = [
  {key: "document", value: "This Document"},
  {key: "user", value: "This User"},
  {key: "organizatino", value: "This Organization"},
];

export const AIContextOptions = [
  {key: "selection", value: "Selection"},
  {key: "general", value: "General"},
  {key: "document", value: "This document"},
];

export const generateDefaultChat = (
  chatTitle?: string,
  folderId?: string,
): ChatInterface => ({
  chatId: uuidv4(),
  chatIndex: 0,
  userId: '',
  cloudChatId: '',
  chatTitle: chatTitle ? chatTitle : 'New Chat',
  messages:
    useStore.getState().defaultSystemMessage.length > 0
      ? [{ role: 'system', context: 'general', command: '', content: useStore.getState().defaultSystemMessage, model: defaultModel}]
      : [],
  titleSet: false,
  tokenUsed: {},
  metaData: {},
  isInitialChat: true,
  folderId,
  isArchived: false,
});

export const codeLanguageSubset = [
  'python',
  'javascript',
  'java',
  'go',
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'graphql',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'php-template',
  'plaintext',
  'python-repl',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'vbnet',
  'wasm',
  'xml',
  'yaml',
];




