export interface TransactionDTO {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  type: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
