export interface CreateTransactionDTO {
  accountId: string;
  categoryId?: string;
  /** Integer cents — floats are rejected by the domain. */
  amountCents: number;
  currency: string;
  type: 'INCOME' | 'EXPENSE';
  note: string;
  date: string; // ISO 8601 format
}
