import { User } from 'lucide-react';
import { useStore } from "@/redux/features/apps/document/store";
import { LocalModelConfigInterface, LocalModelConfigCollectionInterface, ModelOption, TimeLimitTokenUsed } from '@/types/ai';

export const defaultModel = 'gpt-3.5-turbo';

export const defaultAdvancedAPIEndPoint = '/api/enhance_openai';

export const defaultEmailAIAPIEndpoint = '/api/generate_email';

export const defaultPortalAPIEndPoint = '/api/portal_openai';

export const modelOptions: ModelOption[] = [
  'gpt-4o',
  'gpt-4o-2024-05-13',
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  'gpt-4-32k',
  'gpt-4-1106-preview',
  'gpt-4-0125-preview',
  'gpt-4-turbo',
  'gpt-4-turbo-2024-04-09',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo-0125',
  'gemini-1.0-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'dall-e-3'
];

export const modelMaxToken = {
  'gpt-3.5-turbo': 4096,
  'gpt-3.5-turbo-0301': 4096,
  'gpt-3.5-turbo-0613': 4096,
  'gpt-3.5-turbo-16k': 16384,
  'gpt-3.5-turbo-16k-0613': 16384,
  'gpt-3.5-turbo-1106': 16384,
  'gpt-3.5-turbo-0125': 16384,
  'gpt-4o': 128000,
  'gpt-4o-2024-05-13': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4o-mini-2024-07-18': 128000,
  'gpt-4': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-1106-preview': 128000,
  'gpt-4-0125-preview': 128000,
  'gpt-4-turbo': 128000,
  'gpt-4-turbo-2024-04-09': 128000,
  'gemini-1.0-pro': 128000,
  'gemini-1.5-pro': 128000,
  'gemini-1.5-flash': 128000,
};

export const modelCost = {
  'gpt-3.5-turbo': {
    inputTokens: { price: 0.0015, unit: 1000 },
    outputTokens: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-0301': {
    inputTokens: { price: 0.0015, unit: 1000 },
    outputTokens: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-0613': {
    inputTokens: { price: 0.0015, unit: 1000 },
    outputTokens: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-16k': {
    inputTokens: { price: 0.003, unit: 1000 },
    outputTokens: { price: 0.004, unit: 1000 },
  },
  'gpt-3.5-turbo-16k-0613': {
    inputTokens: { price: 0.003, unit: 1000 },
    outputTokens: { price: 0.004, unit: 1000 },
  },
  'gpt-3.5-turbo-1106': {
    inputTokens: { price: 0.001, unit: 1000 },
    outputTokens: { price: 0.002, unit: 1000 },
  },
  'gpt-3.5-turbo-0125': {
    inputTokens: { price: 0.0005, unit: 1000 },
    outputTokens: { price: 0.0015, unit: 1000 },
  },
  'gpt-4o': {
    inputTokens: { price: 0.005, unit: 1000 },
    outputTokens: { price: 0.015, unit: 1000 },
  },
  'gpt-4o-2024-05-13': {
    inputTokens: { price: 0.005, unit: 1000 },
    outputTokens: { price: 0.015, unit: 1000 },
  },
  'gpt-4o-mini': {
    inputTokens: { price: 0.00015, unit: 1000 },
    outputTokens: { price: 0.0006, unit: 1000 },
  },
  'gpt-4o-mini-2024-07-18': {
    inputTokens: { price: 0.00015, unit: 1000 },
    outputTokens: { price: 0.0006, unit: 1000 },
  },
  'gpt-4': {
    inputTokens: { price: 0.03, unit: 1000 },
    outputTokens: { price: 0.06, unit: 1000 },
  },
  'gpt-4-32k': {
    inputTokens: { price: 0.06, unit: 1000 },
    outputTokens: { price: 0.12, unit: 1000 },
  },
  'gpt-4-1106-preview': {
    inputTokens: { price: 0.01, unit: 1000 },
    outputTokens: { price: 0.03, unit: 1000 },
  },
  'gpt-4-0125-preview': {
    inputTokens: { price: 0.01, unit: 1000 },
    outputTokens: { price: 0.03, unit: 1000 },
  },
  'gpt-4-turbo': {
    inputTokens: { price: 0.01, unit: 1000 },
    outputTokens: { price: 0.03, unit: 1000 },
  },
  'gpt-4-turbo-2024-04-09': {
    inputTokens: { price: 0.01, unit: 1000 },
    outputTokens: { price: 0.03, unit: 1000 },
  },
  'gemini-1.0-pro': {
    inputTokens: { price: 0.005, unit: 1000 },
    outputTokens: { price: 0.015, unit: 1000 },
  },
  'gemini-1.5-pro': {
    inputTokens: { price: 0.035, unit: 1000 },
    outputTokens: { price: 0.105, unit: 1000 },
  },
  'gemini-1.5-flash': {
    inputTokens: { price: 0.035, unit: 1000 },
    outputTokens: { price: 0.105, unit: 1000 },
  },
};

export const imageModelCost = {
  'dalle-e-3': {
    standard: { 
      '1024x1024': { price: 0.04, unit: 1 },
      '1024x1792': { price: 0.08, unit: 1 },
    },
    hd: { 
      '1024x1024': { price: 0.08, unit: 1 },
      '1024x1792': { price: 0.12, unit: 1 },
    },
  },
  'dall-e-2': {
    '512x512': { price: 0.02, unit: 1 },
    '256x256': { price: 0.016, unit: 1 },
  },
};

export const defaultUserMaxToken = 4000;


export interface LocalModelConfigCollectionInterface {
  [model: string]: LocalModelConfigInterface;
}

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

export const dalleConfig: LocalModelConfigCollectionInterface = {
  base_RPM: 1,
  base_RPD: 1,
  base_TPM: 1,
  base_TPD: 1,
  max_tokens: 0,
  temperature: 1,
  presence_penalty: 0,
  top_p: 1,
  frequency_penalty: 0,
};

export const generateDefaultAIConfig = (): LocalModelConfigCollectionInterface => {
  const defaultConfig: LocalModelConfigInterface = {
    base_RPM: 100,
    base_RPD: 100,
    base_TPM: 100,
    base_TPD: 100,
    max_tokens: 4096,
    temperature: 1,
    presence_penalty: 0,
    top_p: 1,
    frequency_penalty: 0,
  };

  const allModels: ModelOption[] = [
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
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k',
    'gpt-3.5-turbo-1106',
    'gpt-3.5-turbo-0125',
    'gemini-1.0-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'dall-e-3'
  ];

  const config: LocalModelConfigCollectionInterface = {};

  allModels.forEach((model) => {
    if (model === 'dall-e-3') {
      config[model] = {
        ...dalleConfig,
        model,
      };
    } else {
      config[model] = {
        ...defaultConfig,
        model,
      };
    }
  });

  return config;
};

export const _defaultAIConfig: LocalModelConfigCollectionInterface = generateDefaultAIConfig();

export const generateDefaultTimeLimitTokenUsed = (aiConfig: LocalModelConfigCollectionInterface): TimeLimitTokenUsed => {
  return Object.keys(aiConfig).reduce((config, model) => {
    config[model] = {
      inputTokens: [],
      outputTokens: [],
      totalInputTokens: 0,
      totalOutputTokens: 0,
      isTokenExceeded: false,
      remainingTokens: aiConfig[model].base_TPM,
      lastTokenUpdateTime: undefined,
      tokenLimit: aiConfig[model].base_TPM / 2,
    };
    return config;
  }, {} as TimeLimitTokenUsed);
};

interface FormFieldProps {
  id: string;
  inputType: 'input' | 'textarea' | 'date' | 'number' | 'select';
  placeholder: string;
  name: string;
  type?: string;
  icon?: React.ElementType;
}

export const PLAN_MODEL_FORM: FormFieldProps[] = [
  {
    id: '1',
    inputType: 'select',
    placeholder: 'Select Model',
    name: 'name',
    type: 'text',
    label: 'Model',
    options: [
      { value: 'gpt-4o', label: 'gpt-4o', id: 'gpt-4o' },
      { value: 'gpt-4o-2024-05-13', label: 'gpt-4o-2024-05-13', id: 'gpt-4o-2024-05-13' },
      { value: 'gpt-4o-mini', label: 'gpt-4o-mini', id: 'gpt-4o-mini' },
      { value: 'gpt-4o-mini-2024-07-18', label: 'gpt-4o-mini-2024-07-18', id: 'gpt-4o-mini-2024-07-18' },
      { value: 'gpt-4', label: 'gpt-4', id: 'gpt-4' },
      { value: 'gpt-4-32k', label: 'gpt-4-32k', id: 'gpt-4-32k' },
      { value: 'gpt-4-1106-preview', label: 'gpt-4-1106-preview', id: 'gpt-4-1106-preview' },
      { value: 'gpt-4-0125-preview', label: 'gpt-4-0125-preview', id: 'gpt-4-0125-preview' },
      { value: 'gpt-4-turbo', label: 'gpt-4-turbo', id: 'gpt-4-turbo' },
      { value: 'gpt-4-turbo-2024-04-09', label: 'gpt-4-turbo-2024-04-09', id: 'gpt-4-turbo-2024-04-09' },
      { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo', id: 'gpt-3.5-turbo' },
      { value: 'gpt-3.5-turbo-16k', label: 'gpt-3.5-turbo-16k', id: 'gpt-3.5-turbo-16k' },
      { value: 'gpt-3.5-turbo-16k-0613', label: 'gpt-3.5-turbo-16k-0613', id: 'gpt-3.5-turbo-16k-0613' },
      { value: 'gpt-3.5-turbo-0613', label: 'gpt-3.5-turbo-0613', id: 'gpt-3.5-turbo-0613' },
      { value: 'gpt-3.5-turbo-0301', label: 'gpt-3.5-turbo-0301', id: 'gpt-3.5-turbo-0301' },
      { value: 'gpt-3.5-turbo-1106', label: 'gpt-3.5-turbo-1106', id: 'gpt-3.5-turbo-1106' },
      { value: 'gpt-3.5-turbo-0125', label: 'gpt-3.5-turbo-0125', id: 'gpt-3.5-turbo-0125' },
      { value: 'gemini-1.0-pro', label: 'gemini-1.0-pro', id: 'gemini-1.0-pro' },
      { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro', id: 'gemini-1.5-pro' },
      { value: 'gemini-1.5-flash', label: 'gemini-1.5-flash', id: 'gemini-1.5-flash' },
      { value: 'dall-e-3', label: 'dall-e-3', id: 'dall-e-3' },
    ],
  },
  {
    id: '2',
    inputType: 'input',
    placeholder: 'Model ID',
    name: 'modelId',
    type: 'text',
    icon: User,
  },
  {
    id: '3',
    inputType: 'input',
    placeholder: 'Version',
    name: 'version',
    type: 'text',
    icon: User,
  },
  {
    id: '4',
    inputType: 'textarea',
    placeholder: 'Description',
    name: 'description',
    type: 'text',
    icon: User,
  },
  {
    id: '5',
    inputType: 'date',
    placeholder: 'Updated Date',
    name: 'updatedDate',
    type: 'date',
    icon: User,
  },
  {
    id: '6',
    inputType: 'input',
    placeholder: 'maxRPM',
    name: 'maxRPM',
    type: 'number',
    icon: User,
  },
  {
    id: '7',
    inputType: 'input',
    placeholder: 'ceilingRPM',
    name: 'ceilingRPM',
    type: 'number',
    icon: User,
  },
  {
    id: '8',
    inputType: 'input',
    placeholder: 'floorRPM',
    name: 'floorRPM',
    type: 'number',
    icon: User,
  },
  {
    id: '9',
    inputType: 'input',
    placeholder: 'maxRPD',
    name: 'maxRPD',
    type: 'number',
    icon: User,
  },
  {
    id: '10',
    inputType: 'input',
    placeholder: 'ceilingRPD',
    name: 'ceilingRPD',
    type: 'number',
    icon: User,
  },
  {
    id: '11',
    inputType: 'input',
    placeholder: 'floorRPD',
    name: 'floorRPD',
    type: 'number',
    icon: User,
  },
  {
    id: '12',
    inputType: 'input',
    placeholder: 'maxTPM',
    name: 'maxTPM',
    type: 'number',
    icon: User,
  },
  {
    id: '13',
    inputType: 'input',
    placeholder: 'ceilingTPM',
    name: 'ceilingTPM',
    type: 'number',
    icon: User,
  },
  {
    id: '14',
    inputType: 'input',
    placeholder: 'floorTPM',
    name: 'floorTPM',
    type: 'number',
    icon: User,
  },
  {
    id: '15',
    inputType: 'input',
    placeholder: 'maxTPD',
    name: 'maxTPD',
    type: 'number',
    icon: User,
  },
  {
    id: '16',
    inputType: 'input',
    placeholder: 'ceilingTPD',
    name: 'ceilingTPD',
    type: 'number',
    icon: User,
  },
  {
    id: '17',
    inputType: 'input',
    placeholder: 'floorTPD',
    name: 'floorTPD',
    type: 'number',
    icon: User,
  },
  {
    id: '18',
    inputType: 'input',
    placeholder: 'purchasedAmount',
    name: 'purchasedAmount',
    type: 'number',
    icon: User,
  },
];

export const CREDIT_MODEL_FORM: FormFieldProps[] = [
  {
    id: '1',
    inputType: 'select',
    placeholder: 'Select Model',
    name: 'name',
    type: 'text',
    label: 'Model',
    options: [
      { value: 'gpt-4o', label: 'gpt-4o', id: 'gpt-4o' },
      { value: 'gpt-4o-2024-05-13', label: 'gpt-4o-2024-05-13', id: 'gpt-4o-2024-05-13' },
      { value: 'gpt-4o-mini', label: 'gpt-4o-mini', id: 'gpt-4o-mini' },
      { value: 'gpt-4o-mini-2024-07-18', label: 'gpt-4o-mini-2024-07-18', id: 'gpt-4o-mini-2024-07-18' },
      { value: 'gpt-4', label: 'gpt-4', id: 'gpt-4' },
      { value: 'gpt-4-32k', label: 'gpt-4-32k', id: 'gpt-4-32k' },
      { value: 'gpt-4-1106-preview', label: 'gpt-4-1106-preview', id: 'gpt-4-1106-preview' },
      { value: 'gpt-4-0125-preview', label: 'gpt-4-0125-preview', id: 'gpt-4-0125-preview' },
      { value: 'gpt-4-turbo', label: 'gpt-4-turbo', id: 'gpt-4-turbo' },
      { value: 'gpt-4-turbo-2024-04-09', label: 'gpt-4-turbo-2024-04-09', id: 'gpt-4-turbo-2024-04-09' },
      { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo', id: 'gpt-3.5-turbo' },
      { value: 'gpt-3.5-turbo-16k', label: 'gpt-3.5-turbo-16k', id: 'gpt-3.5-turbo-16k' },
      { value: 'gpt-3.5-turbo-16k-0613', label: 'gpt-3.5-turbo-16k-0613', id: 'gpt-3.5-turbo-16k-0613' },
      { value: 'gpt-3.5-turbo-0613', label: 'gpt-3.5-turbo-0613', id: 'gpt-3.5-turbo-0613' },
      { value: 'gpt-3.5-turbo-0301', label: 'gpt-3.5-turbo-0301', id: 'gpt-3.5-turbo-0301' },
      { value: 'gpt-3.5-turbo-1106', label: 'gpt-3.5-turbo-1106', id: 'gpt-3.5-turbo-1106' },
      { value: 'gpt-3.5-turbo-0125', label: 'gpt-3.5-turbo-0125', id: 'gpt-3.5-turbo-0125' },
      { value: 'gemini-1.0-pro', label: 'gemini-1.0-pro', id: 'gemini-1.0-pro' },
      { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro', id: 'gemini-1.5-pro' },
      { value: 'gemini-1.5-flash', label: 'gemini-1.5-flash', id: 'gemini-1.5-flash' },
      { value: 'dall-e-3', label: 'dall-e-3', id: 'dall-e-3' },
    ],
  },
  {
    id: '2',
    inputType: 'input',
    placeholder: 'Model ID',
    name: 'modelId',
    type: 'text',
    icon: User,
  },
  {
    id: '3',
    inputType: 'input',
    placeholder: 'Version',
    name: 'version',
    type: 'text',
    icon: User,
  },
  {
    id: '4',
    inputType: 'textarea',
    placeholder: 'Description',
    name: 'description',
    type: 'text',
    icon: User,
  },
  {
    id: '5',
    inputType: 'date',
    placeholder: 'Updated Date',
    name: 'updatedDate',
    type: 'date',
    icon: User,
  },
  {
    id: '6',
    inputType: 'input',
    placeholder: 'maxRPM',
    name: 'maxRPM',
    type: 'number',
    icon: User,
  },
  {
    id: '7',
    inputType: 'input',
    placeholder: 'ceilingRPM',
    name: 'ceilingRPM',
    type: 'number',
    icon: User,
  },
  {
    id: '8',
    inputType: 'input',
    placeholder: 'floorRPM',
    name: 'floorRPM',
    type: 'number',
    icon: User,
  },
  {
    id: '9',
    inputType: 'input',
    placeholder: 'maxRPD',
    name: 'maxRPD',
    type: 'number',
    icon: User,
  },
  {
    id: '10',
    inputType: 'input',
    placeholder: 'ceilingRPD',
    name: 'ceilingRPD',
    type: 'number',
    icon: User,
  },
  {
    id: '11',
    inputType: 'input',
    placeholder: 'floorRPD',
    name: 'floorRPD',
    type: 'number',
    icon: User,
  },
  {
    id: '12',
    inputType: 'input',
    placeholder: 'maxInputTokens',
    name: 'maxInputTokens',
    type: 'number',
    icon: User,
  },
  {
    id: '13',
    inputType: 'input',
    placeholder: 'ceilingInputTokens',
    name: 'ceilingInputTokens',
    type: 'number',
    icon: User,
  },
  {
    id: '14',
    inputType: 'input',
    placeholder: 'floorInputTokens',
    name: 'floorInputTokens',
    type: 'number',
    icon: User,
  },
  {
    id: '15',
    inputType: 'input',
    placeholder: 'maxOutputTokens',
    name: 'maxOutputTokens',
    type: 'number',
    icon: User,
  },
    {
    id: '16',
    inputType: 'input',
    placeholder: 'ceilingOutputTokens',
    name: 'ceilingOutputTokens',
    type: 'number',
    icon: User,
  },
  {
    id: '17',
    inputType: 'input',
    placeholder: 'floorOutputTokens',
    name: 'floorOutputTokens',
    type: 'number',
    icon: User,
  },
  {
    id: '18',
    inputType: 'input',
    placeholder: 'purchasedAmount',
    name: 'purchasedAmount',
    type: 'number',
    icon: User,
  },
];

export const modelColumns = [
  { uid: "model", name: "Model", editable: "READONLY", sortable: true },
  { uid: "base_RPM", name: "Base RPM", editable: "READONLY" },
  { uid: "base_RPD", name: "Base RPD", editable: "READONLY" },
  { uid: "base_TPM", name: "Base TPM", editable: "READONLY" },
  { uid: "base_TPD", name: "Base TPD", editable: "READONLY" },
  { uid: "max_RPM", name: "Max RPM", editable: "READONLY" },
  { uid: "ceiling_RPM", name: "Ceiling RPM", editable: "EDITABLE" },
  { uid: "floor_RPM", name: "Floor RPM", editable: "EDITABLE" },
  { uid: "max_RPD", name: "Max RPD", editable: "READONLY" },
  { uid: "ceiling_RPD", name: "Ceiling RPD", editable: "EDITABLE" },
  { uid: "floor_RPD", name: "Floor RPD", editable: "EDITABLE" },
  { uid: "max_inputTokens", name: "Max Input Tokens", editable: "READONLY" },
  { uid: "ceiling_inputTokens", name: "Ceiling Input Tokens", editable: "EDITABLE" },
  { uid: "floor_inputTokens", name: "Floor Input Tokens", editable: "EDITABLE" },
  { uid: "max_outputTokens", name: "Max Output Tokens", editable: "READONLY" },
  { uid: "ceiling_outputTokens", name: "Ceiling Output Tokens", editable: "EDITABLE"},
  { uid: "floor_outputTokens", name: "Floor Output Tokens", editable: "EDITABLE" },
  { uid: "max_tokens", name: "Max Tokens", editable: "EDITABLE" },
  { uid: "temperature", name: "Temperature", editable: "READONLY" },
  { uid: "presence_penalty", name: "Presence Penalty", editable: "READONLY" },
  { uid: "top_p", name: "Top P", editable: "READONLY" },
  { uid: "frequency_penalty", name: "Frequency Penalty", editable: "READONLY" },
  { uid: "used_inputTokens", name: "Used Input Tokens", editable: "READONLY"},
  { uid: "used_outputTokens", name: " Used Output Tokens", editable: "READONLY" },
  { uid: "actions", name: "Actions" },
];

export const AIModelOptions = [
  { key: "gpt-4o", value: "gpt-4o" },
  { key: "gpt-4o-2024-05-13", value: "gpt-4o-2024-05-13" },
  { key: "gpt-4o-mini", value: "gpt-4o-mini" },
  { key: "gpt-4o-mini-2024-07-18", value: "gpt-4o-mini-2024-07-18" },
  { key: "gpt-4", value: "gpt-4" },
  { key: "gpt-4-32k", value: "gpt-4-32k" },
  { key: "gpt-4-1106-preview", value: "gpt-4-1106-preview" },
  { key: "gpt-4-0125-preview", value: "gpt-4-0125-preview" },
  { key: "gpt-4-turbo", value: "gpt-4-turbo" },
  { key: "gpt-4-turbo-2024-04-09", value: "gpt-4-turbo-2024-04-09" },
  { key: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
  { key: "gpt-3.5-turbo-16k", value: "gpt-3.5-turbo-16k" },
  { key: "gpt-3.5-turbo-0301", value: "gpt-3.5-turbo-0301" },
  { key: "gpt-3.5-turbo-0613", value: "gpt-3.5-turbo-0613" },
  { key: "gpt-3.5-turbo-16k-0613", value: "gpt-3.5-turbo-16k-0613" },
  { key: "gpt-3.5-turbo-1106", value: "gpt-3.5-turbo-1106" },
  { key: "gpt-3.5-turbo-0125", value: "gpt-3.5-turbo-0125" },
  { key: "gemini-1.0-pro", value: "gemini-1.0-pro" },
  { key: "gemini-1.5-pro", value: "gemini-1.5-pro" },
  { key: "gemini-1.5-flash", value: "gemini-1.5-flash" },
];

export const APIEndpointOptions = [
  { key: "openAI", value: "/api/generate_openai" },
  { key: "gemini", value: "/api/generate_gemini" },
];


