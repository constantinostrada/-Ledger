// All filters are optional: with none, every transaction across the
// user's accounts is listed (newest first, paginated).
export interface GetTransactionsDTO {
  accountId?: string;
  categoryId?: string;
  dateFrom?: string; // ISO 8601 format
  dateTo?: string; // ISO 8601 format
  limit?: number;
  offset?: number;
}
