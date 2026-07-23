import { z } from 'zod';

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a hex color like #22C55E');

// No userId field anywhere here: ownership always comes from the
// authenticated token, never from client input.
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  kind: z.enum(['INCOME', 'EXPENSE']),
  color: hexColor,
});

// Kind is deliberately not updatable: flipping it would change the meaning
// of every transaction and budget already attached to the category.
export const updateCategorySchema = z
  .object({
    name: z.string().min(1, 'Category name is required').max(100).optional(),
    color: hexColor.optional(),
  })
  .refine((data) => data.name !== undefined || data.color !== undefined, {
    message: 'At least one field to update is required',
  });
