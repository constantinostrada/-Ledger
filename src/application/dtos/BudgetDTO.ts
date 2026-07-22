// spentCents / remainingCents / percentUsed are derived from the period's
// transactions at read time — never stored, so they can never drift.
export interface BudgetDTO {
  id: string;
  categoryId: string;
  period: string; // Calendar month, YYYY-MM
  limitCents: number;
  spentCents: number;
  remainingCents: number;
  percentUsed: number;
  overBudget: boolean;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
