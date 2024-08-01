import { ZodType, z } from 'zod';

export type UserRegistrationProps = {
  type: string;
  fullname?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
};

export type UserLoginProps = {
  phone?: string;
  email?: string;
  password?: string;
  otp?: string;
};

export type UserResetPasswordProps = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
};

export const UserRegistrationSchema: ZodType<UserRegistrationProps> = z.object({
  type: z.string().min(1, { message: 'Type is required' }).nonempty(),
  fullname: z.string()
    .min(4, { message: 'Your full name must be at least 4 characters long' }) 
    .max(50, { message: 'Your full name cannot be longer than 50 characters long' }) 
    .regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, { message: 'Your full name should only contain letters and at most one space between words' })
    .optional(),
  username: z.string()
    .min(4, { message: 'Your username must be at least 4 characters long' })
    .max(20, { message: 'Your username cannot be longer than 20 characters long' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Your username should only contain letters, numbers, and underscores' })
    .optional(), 
  email: z.string().email({ message: 'Incorrect email format' }).optional(),
  phone: z.string()
    .refine(
      (value) => /^\+?[1-9]\d{1,14}$/.test(value),
      { message: 'You did not enter a valid phone number' }
    )
    .optional(),
  password: z.string()
    .min(12, { message: 'Your password must be at least 12 characters long' }) 
    .max(128, { message: 'Your password cannot be longer than 128 characters long' }) 
    .regex(/[a-z]/, { message: 'Password should contain at least one lowercase letter' }) 
    .regex(/[A-Z]/, { message: 'Password should contain at least one uppercase letter' }) 
    .regex(/[0-9]/, { message: 'Password should contain at least one digit' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password should contain at least one special character' }) 
    .refine(
      (value) => /^[^\s]+$/.test(value ?? ''), 
      { message: 'Password should not contain whitespace' }
    )
    .optional(),
  confirmPassword: z.string().optional(),
  otp: z.string()
    .min(6, { message: 'You must enter a 6 digit code' })
    .optional(),
  }).refine((schema) => schema.password === schema.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const UserLoginSchema: ZodType<UserLoginProps> = z.object({
  email: z.string().email({ message: 'You did not enter a valid email' }).optional(),
  password: z.string()
    .min(12, { message: 'Your password must be at least 12 characters long' }) 
    .max(128, { message: 'Your password cannot be longer than 128 characters long' }) 
    .regex(/[a-z]/, { message: 'Password should contain at least one lowercase letter' }) 
    .regex(/[A-Z]/, { message: 'Password should contain at least one uppercase letter' }) 
    .regex(/[0-9]/, { message: 'Password should contain at least one digit' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password should contain at least one special character' }) 
    .refine(
      (value) => /^[^\s]+$/.test(value ?? ''), 
      { message: 'Password should not contain whitespace' }
    )
    .optional(),
  phone: z.string()
    .refine(
      (value) => /^\+?[1-9]\d{1,14}$/.test(value),
      { message: 'You did not enter a valid phone number' }
    )
    .optional(),
  otp: z.string()
    .min(6, { message: 'You must enter a 6 digit code' })
    .optional(),
  });

export const UserResetPasswordSchema: ZodType<UserResetPasswordProps> = z.object({
  email: z.string().email({ message: 'You did not enter a valid email' }).optional(),
  password: z.string()
    .min(12, { message: 'Your password must be at least 12 characters long' }) 
    .max(128, { message: 'Your password cannot be longer than 128 characters long' }) 
    .regex(/[a-z]/, { message: 'Password should contain at least one lowercase letter' }) 
    .regex(/[A-Z]/, { message: 'Password should contain at least one uppercase letter' }) 
    .regex(/[0-9]/, { message: 'Password should contain at least one digit' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password should contain at least one special character' }) 
    .refine(
      (value) => /^[^\s]+$/.test(value ?? ''), 
      { message: 'Password should not contain whitespace' }
    ),
    otp: z.string()
    .min(6, { message: 'You must enter a 6 digit code' })
    .optional(),
  confirmPassword: z.string(),
}).refine((schema) => schema.password === schema.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
