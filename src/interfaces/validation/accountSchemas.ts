import { z } from 'zod';

// No userId field anywhere here: ownership always comes from the
// authenticated token, never from client input.
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT', 'INVESTMENT']),
  // Materialized as an opening credit transaction, so it can't be negative.
  initialBalanceCents: z
    .number()
    .int('Balance must be integer cents')
    .nonnegative('Initial balance cannot be negative')
    .optional(),
  currency: z.string().length(3).optional(),
});

export const updateAccountSchema = z
  .object({
    name: z.string().min(1, 'Account name is required').max(100).optional(),
    type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT', 'INVESTMENT']).optional(),
  })
  .refine((data) => data.name !== undefined || data.type !== undefined, {
    message: 'At least one field to update is required',
  });
