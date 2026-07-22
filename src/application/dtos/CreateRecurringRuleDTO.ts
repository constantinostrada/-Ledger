export interface CreateRecurringRuleDTO {
  accountId: string;
  categoryId?: string;
  amountCents: number;
  currency: string;
  type: string; // INCOME | EXPENSE
  note: string;
  interval: string; // DAILY | WEEKLY | MONTHLY
  startDate: string; // ISO 8601 format; the first due date
}
