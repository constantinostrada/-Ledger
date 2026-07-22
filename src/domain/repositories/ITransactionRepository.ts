import { Transaction } from '../entities/Transaction';

export interface TransactionFilter {
  /** Scopes results to the accounts owned by this user. */
  userId: string;
  accountId?: string;
  categoryId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findByFilter(
    filter: TransactionFilter,
    limit: number,
    offset: number
  ): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
  count(accountId: string): Promise<number>;
}
