export interface IncomeVsExpensePointDTO {
  period: string; // Calendar month, YYYY-MM
  incomeCents: number;
  expenseCents: number;
  netCents: number; // incomeCents - expenseCents
}

export interface IncomeVsExpenseReportDTO {
  from: string;
  to: string;
  baseCurrency: string;
  /** One point per month from `from` to `to` inclusive, zero-filled. */
  points: IncomeVsExpensePointDTO[];
}
