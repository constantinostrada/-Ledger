import { z } from 'zod';

export const createAccountSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'Account name is required').max(100),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT', 'INVESTMENT']),
  initialBalance: z.number().optional(),
  currency: z.string().length(3).optional(),
});

export const getUserAccountsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});
