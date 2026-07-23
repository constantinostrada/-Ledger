export interface SpendByCategoryItemDTO {
  /** null groups expenses that have no category. */
  categoryId: string | null;
  categoryName: string | null;
  spentCents: number;
}

export interface SpendByCategoryReportDTO {
  period: string; // Calendar month, YYYY-MM
  baseCurrency: string;
  totalSpentCents: number;
  categories: SpendByCategoryItemDTO[];
}
