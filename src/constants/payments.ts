"use client";

import { CreditCard, User, type LucideIcon } from "lucide-react";

type UserCreditPurchaseProps = {
  id: string;
  type?: string; 
  inputType: 'input' | 'textarea' | 'date' | 'number' | 'select';
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  name: string;
  icon?: LucideIcon;
  otp?: string;
};

export const USER_CREDIT_PURCHASE_FORM: UserCreditPurchaseProps[] = [
  {
    id: '1',
    inputType: 'select',
    placeholder: 'Select Model',
    name: 'model',
    type: 'text',
    options: [
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
    placeholder: 'Input Tokens (unit: 1000 tokens)',
    label: 'Input Tokens (unit: 1000 tokens)',
    name: 'inputTokens',
    type: 'number',
    icon: User,
  },
  {
    id: '3',
    inputType: 'input',
    placeholder: 'Output Tokens (unit: 1000 tokens)',
    label: 'Output Tokens (unit: 1000 tokens)',
    name: 'outputTokens',
    type: 'number',
    icon: User,
  },
];
