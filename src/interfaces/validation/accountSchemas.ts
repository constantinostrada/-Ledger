import { z } from 'zod';

// No userId field anywhere here: ownership always comes from the
// authenticated token, never from client input.
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT', 'INVESTMENT']),
  initialBalanceCents: z
    .number()
    .int('Balance must be integer cents')
    .optional(),
  currency: z.string().length(3).optional(),
});
