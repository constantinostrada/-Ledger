import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('A valid email is required').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must not exceed 72 characters'),
  name: z.string().min(1).max(100).optional(),
  // Currency every balance/report aggregates in; defaults to USD.
  baseCurrency: z
    .string()
    .regex(/^[A-Za-z]{3}$/, 'Base currency must be a 3-letter code')
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email('A valid email is required'),
  password: z.string().min(1, 'Password is required'),
});
