import { ZodType, z } from 'zod';
import { PLAN_TYPE } from '@/types/app';

export type FeatureFormProps = {
  name: string;
  appId: string;
  version: string;
  deployedDate: string; 
  releasedDate: string; 
  developer: string;
  description?: string;
  plan?: PLAN_TYPE;
};

export type AppFormProps = {
  name: string;
  version: string;
  category: string;
  plan?: PLAN_TYPE;
  deployedDate: string; 
  releasedDate: string; 
  developer: string;
  description?: string;
  platform: string;
  watermark?: string;
  domain: string;
  license?: string;
  logo?: string;
};

export const AppSchema: ZodType<AppFormProps> = z.object({
  name: z.string().min(1, { message: 'Name is required' }).nonempty(),
  version: z.string().min(1, { message: 'Version is required' }).nonempty(),
  category: z.string().min(1, { message: 'Category is required' }).nonempty(),
  plan: z.string().min(1, { message: 'Plan is required' }).nonempty(),
  deployedDate: z.string().min(1, { message: 'Deployed Date is required' }).nonempty(),
  releasedDate: z.string().min(1, { message: 'Released Date is required' }).nonempty(),
  developer: z.string().min(1, { message: 'Name is required' }).nonempty(),
  description: z.string().optional(),
  platform: z.string().min(1, { message: 'Platform is required' }).nonempty(),
  watermark: z.string().optional(),
  domain: z.string().min(1, { message: 'Domain is required' }).nonempty(),
  license: z.string().optional(),
  logo: z.string().optional(),
});

export const FeatureSchema: ZodType<FeatureFormProps> = z.object({
  name: z.string().min(1, { message: 'Name is required' }).nonempty(),
  version: z.string().min(1, { message: 'Version is required' }).nonempty(),
  appId: z.string().min(1, { message: 'App Id is required' }).nonempty(),
  deployedDate: z.string().min(1, { message: 'Deployed Date is required' }).nonempty(),
  releasedDate: z.string().min(1, { message: 'Released Date is required' }).nonempty(),
  developer: z.string().min(1, { message: 'Name is required' }).nonempty(),
  description: z.string().optional(),
  plan: z.string().min(1, { message: 'Plan is required' }).nonempty(),
});

