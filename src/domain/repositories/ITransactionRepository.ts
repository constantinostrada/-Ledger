import { Transaction } from '../entities/Transaction';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findByAccountIdWithPagination(
    accountId: string,
    limit: number,
    offset: number
  ): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
  count(accountId: string): Promise<number>;
}
