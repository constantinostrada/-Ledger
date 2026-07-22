import { z } from 'zod';

export const createRecurringRuleSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  categoryId: z.string().min(1).optional(),
  amountCents: z
    .number()
    .int('Amount must be integer cents')
    .positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  type: z.enum(['INCOME', 'EXPENSE']),
  note: z.string().min(1, 'Note is required').max(500),
  interval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  startDate: z.string().datetime('Invalid startDate format'),
});
