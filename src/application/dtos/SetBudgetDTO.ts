// Setting a budget is an upsert: one limit per (category, month) for the
// authenticated user, created on first set and replaced on later sets.
export interface SetBudgetDTO {
  categoryId: string;
  period: string; // Calendar month, YYYY-MM
  limitCents: number;
  currency: string;
}
