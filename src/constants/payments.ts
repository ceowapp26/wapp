"use client";

import { CreditCard, User, AppWindow, type LucideIcon } from "lucide-react";

type PLAN = "FREE" | "STANDARD" | "PRO" | "ULTIMATE";

export const _defaultPlan: PLAN = "FREE";

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

export const APP_PURCHASE_FORM: UserCreditPurchaseProps[] = [
  {
    id: '1',
    inputType: 'input',
    label: 'App Name',
    type: 'text',
    name: 'name',
    placeholder: 'Enter the app name',
    icon: AppWindow
  },
  {
    id: '2',
    inputType: 'input',
    label: 'Quantity',
    type: 'number',
    name: 'quantity',
    placeholder: 'Enter the number of licenses',
  },
  {
    id: '3',
    inputType: 'select',
    label: 'Subscription Duration',
    type: 'text',
    name: 'duration',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ],
  },
];

export const EXTENSION_PURCHASE_FORM: UserCreditPurchaseProps[] = [
  {
    id: '1',
    inputType: 'input',
    label: 'Extension Name',
    type: 'text',
    name: 'name',
    placeholder: 'Enter the extension name',
    icon: AppWindow
  },
  {
    id: '2',
    inputType: 'select',
    label: 'Extension Type',
    type: 'text',
    name: 'type',
    options: [
      { value: 'productivity', label: 'Productivity' },
      { value: 'development', label: 'Development' },
      { value: 'design', label: 'Design' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: '3',
    inputType: 'select',
    label: 'Subscription Duration',
    type: 'text',
    name: 'duration',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ],
  },
];

export const USER_TOKEN_PURCHASE_FORM: UserCreditPurchaseProps[] = [
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

export const OTHER_PURCHASE_FORM: UserCreditPurchaseProps[] = [
  {
    id: '1',
    inputType: 'input',
    label: 'Service Name',
    type: 'text',
    name: 'name',
    placeholder: 'Enter the service name',
    icon: AppWindow
  },
  {
    id: '2',
    inputType: 'textarea',
    label: 'Service Description',
    type: 'text',
    name: 'description',
    placeholder: 'Briefly describe the service you need',
  },
  {
    id: '3',
    inputType: 'select',
    label: 'Service Duration',
    type: 'text',
    name: 'duration',
    options: [
      { value: 'oneTime', label: 'One-time' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
    ],
  },
  {
    id: '4',
    inputType: 'textarea',
    label: 'Custom Requirements',
    type: 'text',
    name: 'information',
    placeholder: 'Any specific requirements or additional information',
  },
];

type PlanSubscriptionInfo = {
  planName: PLAN;
  planID: string | undefined; 
  description: string;
};

export const planSubscriptionInfo: PlanSubscriptionInfo[] = [
  {
    planName: 'FREE',
    planID: process.env.FREE_PLAN_ID,
    description: 'Free description plan',
  },
  {
    planName: 'STANDARD',
    planID: process.env.STANDARD_PLAN_ID,
    description: 'Standard description plan',
  },
  {
    planName: 'PRO',
    planID: process.env.PRO_PLAN_ID,
    description: 'Pro description plan',
  },
  {
    planName: 'ULTIMATE',
    planID: process.env.ULTIMATE_PLAN_ID,
    description: 'Ultimate description plan',
  },
];

