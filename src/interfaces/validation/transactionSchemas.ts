import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  categoryId: z.string().min(1).optional(),
  amountCents: z
    .number()
    .int('Amount must be integer cents')
    .positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  type: z.enum(['INCOME', 'EXPENSE']),
  note: z.string().min(1, 'Note is required').max(500),
  date: z.string().datetime('Invalid date format'),
});

// All filters optional: no accountId means "across all my accounts".
export const getTransactionsSchema = z
  .object({
    accountId: z.string().min(1).optional(),
    categoryId: z.string().min(1).optional(),
    dateFrom: z.string().datetime('Invalid dateFrom format').optional(),
    dateTo: z.string().datetime('Invalid dateTo format').optional(),
    limit: z.number().int().positive().max(100).optional(),
    offset: z.number().int().min(0).optional(),
  })
  .refine(
    (data) =>
      !data.dateFrom ||
      !data.dateTo ||
      new Date(data.dateFrom) <= new Date(data.dateTo),
    { message: 'dateFrom must not be after dateTo' }
  );
