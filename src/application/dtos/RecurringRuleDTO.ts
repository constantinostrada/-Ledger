export interface RecurringRuleDTO {
  id: string;
  accountId: string;
  categoryId: string | null;
  amountCents: number;
  currency: string;
  type: string;
  note: string;
  interval: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}
