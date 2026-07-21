import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  type: z.enum(['DEBIT', 'CREDIT']),
  description: z.string().min(1, 'Description is required').max(500),
  date: z.string().datetime('Invalid date format'),
});

export const getTransactionsSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().min(0).optional(),
});
