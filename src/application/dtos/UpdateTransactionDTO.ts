// All fields are optional: only the provided ones change. Recurring-rule
// linkage is never editable — it records where the transaction came from.
export interface UpdateTransactionDTO {
  accountId?: string;
  /** Pass null to clear the category. */
  categoryId?: string | null;
  /** Integer cents — floats are rejected by the domain. */
  amountCents?: number;
  currency?: string;
  type?: 'INCOME' | 'EXPENSE';
  note?: string;
  date?: string; // ISO 8601 format
}
