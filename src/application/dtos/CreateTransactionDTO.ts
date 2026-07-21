export interface CreateTransactionDTO {
  accountId: string;
  amount: number;
  currency: string;
  type: 'DEBIT' | 'CREDIT';
  description: string;
  date: string; // ISO 8601 format
}
