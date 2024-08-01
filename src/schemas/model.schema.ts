import { ZodType, z } from 'zod';
import { NormalizedModelOption } from "@/types/ai";

export type PlanModelFormProps = {
  name: NormalizedModelOption;
  modelId: string;
  version: string;
  updatedDate: string;  // Changed to string for Zod validation
  description?: string;
  maxRPM: number;     // max requests per minute
  floorRPM: number;   // floor requests per minute
  ceilingRPM: number; // ceiling requests per minute
  maxRPD: number;     // max requests per day
  floorRPD: number;   // floor requests per day
  ceilingRPD: number; // ceiling requests per day
  maxTPM: number;     // max tokens per minute
  floorTPM: number;   // floor tokens per minute
  ceilingTPM: number; // ceiling tokens per minute
  maxTPD: number;     // max tokens per day
  floorTPD: number;   // floor tokens per day
  ceilingTPD: number; // ceiling tokens per day
  purchasedAmount: number;
};

export type CreditModelFormProps = {
  name: NormalizedModelOption;
  modelId: string;
  version: string;
  updatedDate: string;  // Changed to string for Zod validation
  description?: string;
  maxRPM: number;     // max requests per minute
  ceilingRPM: number; // ceiling requests per minute
  floorRPM: number;   // floor requests per minute
  maxRPD: number;     // max requests per day
  ceilingRPD: number; // ceiling requests per day
  floorRPD: number;   // floor requests per day
  maxInputTokens: number;     // max tokens per minute
  ceilingInputTokens: number;   // floor tokens per minute
  floorInputTokens: number; // ceiling tokens per minute
  maxOutputTokens: number;     // max tokens per day
  ceilingOutputTokens: number;   // floor tokens per day
  floorOutputTokens: number; // ceiling tokens per day
  purchasedAmount: number;
};

export const PlanModelSchema: ZodType<PlanModelFormProps> = z.object({
  name: z.string().min(1, { message: 'Name is required' }).nonempty(),
  modelId: z.string().min(1, { message: 'ModelID is required' }).nonempty(),
  version: z.string().min(1, { message: 'Version is required' }).nonempty(),
  updatedDate: z.string().min(1, { message: 'Updated Date is required' }).nonempty(),
  description: z.string().optional(),
  maxRPM: z.number().int().positive().min(1),
  ceilingRPM: z.number().int().positive().min(1),
  floorRPM: z.number().int().positive().min(1),
  maxRPD: z.number().int().positive().min(1),
  ceilingRPD: z.number().int().positive().min(1),
  floorRPD: z.number().int().positive().min(1),
  maxTPM: z.number().int().positive().min(1),
  ceilingTPM: z.number().int().positive().min(1),
  floorTPM: z.number().int().positive().min(1),
  maxTPD: z.number().int().positive().min(1),
  ceilingTPD: z.number().int().positive().min(1),
  floorTPD: z.number().int().positive().min(1),
  purchasedAmount: z.number().int().positive().min(0),
});

export const CreditModelSchema: ZodType<CreditModelFormProps> = z.object({
  name: z.string().min(1, { message: 'Name is required' }).nonempty(),
  modelId: z.string().min(1, { message: 'ModelID is required' }).nonempty(),
  version: z.string().min(1, { message: 'Version is required' }).nonempty(),
  updatedDate: z.string().min(1, { message: 'Updated Date is required' }).nonempty(),
  description: z.string().optional(),
  maxRPM: z.number().int().positive().min(1),
  ceilingRPM: z.number().int().positive().min(1),
  floorRPM: z.number().int().positive().min(1),
  maxRPD: z.number().int().positive().min(1),
  ceilingRPD: z.number().int().positive().min(1),
  floorRPD: z.number().int().positive().min(1),
  maxInputTokens: z.number().int().positive().min(1),
  ceilingInputTokens: z.number().int().positive().min(1),
  floorInputTokens: z.number().int().positive().min(1),
  maxOutputTokens: z.number().int().positive().min(1),
  ceilingOutputTokens: z.number().int().positive().min(1),
  floorOutputTokens: z.number().int().positive().min(1),
  purchasedAmount: z.number().int().positive().min(0),
});
