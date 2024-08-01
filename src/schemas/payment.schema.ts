import { z, ZodType } from 'zod';
import { ModelOption } from '@/types/ai';

type PaymentProps = {
  model: ModelOption;
  inputTokens: number;
  outputTokens: number;
};

export const UserPaymentSchema: ZodType<PaymentProps> = z.object({
  model: z.string().min(1, { message: 'Name is required' }).nonempty(),
  inputTokens: z.number().int().positive().min(1),
  outputTokens: z.number().int().positive().min(1),
});

