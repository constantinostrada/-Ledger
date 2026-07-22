import { z } from 'zod';

const periodSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Period must be a month formatted YYYY-MM');

export const setBudgetSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  period: periodSchema,
  limitCents: z
    .number()
    .int('Limit must be integer cents')
    .positive('Limit must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
});

export const getBudgetsSchema = z.object({
  period: periodSchema,
});
