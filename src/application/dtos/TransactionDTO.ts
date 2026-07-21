export interface TransactionDTO {
  id: string;
  accountId: string;
  categoryId: string | null;
  amountCents: number;
  currency: string;
  type: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
