import { Prompt } from './prompt';
import { Theme } from './theme';

export type Plan = 'STANDARD' | 'PRO' | 'ULTIMATE';
export type Type = 'INDIVIDUAL' | 'ENTERPRISE' | 'STUDENT' | 'DEVELOPER';

export interface BasePayment {
  transactionId?: string;
  service: string;
  app: string;
  type: Type;
  amountPaid: number;
  amountDue: number;
  currency: string;
  paidDate: string;
  dueDate: string;
  status: string;
}

export interface SubscriptionPayment extends BasePayment {
  plan: Plan;
}

export interface CreditPayment extends BasePayment {
  credit: number;
}
