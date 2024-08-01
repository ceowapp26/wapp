import { Prompt } from './prompt';
import { Theme } from './theme';

export type Model = 'openAI' | 'gemini' | 'dalle' | 'anthropic';

export type ModelStatus = 'create' | 'update';

export type Context = 'basic' | 'advanced' | 'image';

export type InputType = "text-only" | "image-only" | "text-image";

export type OutputType = "text" | "image" | "video";

export type WarningType = "CURRENT" | "REMINDER";

export type ModelOption =
  | 'gpt-4o'
  | 'gpt-4o-2024-05-13'
  | 'gpt-4o-mini'
  | 'gpt-4o-mini-2024-07-18'
  | 'gpt-4'
  | 'gpt-4-32k'
  | 'gpt-4-1106-preview'
  | 'gpt-4-0125-preview'
  | 'gpt-4-turbo'
  | 'gpt-4-turbo-2024-04-09'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k'
  | 'gpt-3.5-turbo-1106'
  | 'gpt-3.5-turbo-0125'
  | 'gemini-1.0-pro'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'dall-e-3';

export type NormalizedModelOption =
  | 'gpt_4o'
  | 'gpt_4o_2024_05_13'
  | 'gpt_4o_mini'
  | 'gpt_4o_mini_2024_07_18'
  | 'gpt_4'
  | 'gpt_4_32k'
  | 'gpt_4_1106_preview'
  | 'gpt_4_0125_preview'
  | 'gpt_4_turbo'
  | 'gpt_4_turbo_2024_04_09'
  | 'gpt_3_5_turbo'
  | 'gpt_3_5_turbo_16k'
  | 'gpt_3_5_turbo_1106'
  | 'gpt_3_5_turbo_0125'
  | 'gemini_1_0_pro'
  | 'gemini_1_5_pro'
  | 'gemini_1_5_flash'
  | 'dall_e_3';

export const modelMapping: { [key in NormalizedModelOption]: ModelOption } = {
  'gpt_4o': 'gpt-4o',
  'gpt_4o_2024_05_13': 'gpt-4o-2024-05-13',
  'gpt_4o_mini': 'gpt-4o-mini',
  'gpt_4o_mini_2024_07_18': 'gpt-4o-mini-2024-07-18',
  'gpt_4': 'gpt-4',
  'gpt_4_32k': 'gpt-4-32k',
  'gpt_4_1106_preview': 'gpt-4-1106-preview',
  'gpt_4_0125_preview': 'gpt-4-0125-preview',
  'gpt_4_turbo': 'gpt-4-turbo',
  'gpt_4_turbo_2024_04_09': 'gpt-4-turbo-2024-04-09',
  'gpt_3_5_turbo': 'gpt-3.5-turbo',
  'gpt_3_5_turbo_16k': 'gpt-3.5-turbo-16k',
  'gpt_3_5_turbo_1106': 'gpt-3.5-turbo-1106',
  'gpt_3_5_turbo_0125': 'gpt-3.5-turbo-0125',
  'gemini_1_0_pro': 'gemini-1.0-pro',
  'gemini_1_5_pro': 'gemini-1.5-pro',
  'gemini_1_5_flash': 'gemini-1.5-flash',
  'dall_e_3': 'dall-e-3'
};

export interface LocalModelConfigInterface {
  model: string;
  base_RPM: number;
  base_RPD: number;
  base_TPM: number;
  base_TPD: number;
  max_tokens?: number;
  temperature?: number;
  presence_penalty?: number;
  top_p?: number;
  frequency_penalty?: number;
}

export interface CloudModelConfigInterface {
  model: string;
  base_RPM: number;
  base_RPD: number;
  base_TPM: number;
  base_TPD: number;
  max_RPM?: number;
  ceiling_RPM?: number;
  floor_RPM?: number;
  max_RPD?: number;
  ceiling_RPD?: number;
  floor_RPD?: number;
  max_inputTokens?: number;
  ceiling_inputTokens?: number;
  floor_inputTokens?: number;
  max_outputTokens?: number;
  ceiling_outputTokens?: number;
  floor_outputTokens?: number;
  max_tokens?: number;
  totalTokenUsed?: {
    inputTokens: number;
    outputTokens: number;
  },
  timeLimitTokenUsed?: {
    inputTokens: number[];
    outputTokens: number[];
    totalInputTokens: number;
    totalOutputTokens: number;
    lastTokenUpdateTime: number;
    isTokenExceeded: boolean;
    remainingTokens: number;
    tokenLimit: number;
  },
  temperature?: number;
  presence_penalty?: number;
  top_p?: number;
  frequency_penalty?: number;
}

export interface SummaryData {
  mainKeyword: string;
  summary: string;
  textSpan: string;
  associatedKeywords: Keyword[];
}

export interface LocalModelConfigCollectionInterface {
  [model: string]: LocalModelConfigInterface;
}

export interface CloudModelConfigCollectionInterface {
  [model: string]: CloudModelConfigInterface;
}

export type TotalTokenUsed = {
  [model in ModelOption]?: {
    inputTokens: number;
    outputTokens: number;
  };
};

export type TimeLimitTokenUsed = {
  [model in ModelOption]?: {
    inputTokens: number[];
    outputTokens: number[];
    totalInputTokens: number;
    totalOutputTokens: number;
    lastTokenUpdateTime: number;
    isTokenExceeded: boolean;
    remainingTokens: number;
    tokenLimit: number;
  };
};


