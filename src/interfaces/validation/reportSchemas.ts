import { z } from 'zod';

const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be formatted YYYY-MM');

export const spendByCategoryReportSchema = z.object({
  period: monthSchema,
});

export const incomeVsExpenseReportSchema = z.object({
  from: monthSchema,
  to: monthSchema,
});
