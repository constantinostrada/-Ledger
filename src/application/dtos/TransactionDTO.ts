export interface TransactionDTO {
  id: string;
  accountId: string;
  categoryId: string | null;
  recurringRuleId: string | null;
  amountCents: number;
  currency: string;
  /** The original amount converted into the user's base currency. */
  baseAmountCents: number;
  baseCurrency: string;
  type: string;
  note: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
