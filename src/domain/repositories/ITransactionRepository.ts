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
  /**
   * Inserts many transactions, silently skipping any that collide with an
   * already-persisted one on (recurringRuleId, date). Returns how many rows
   * were actually inserted — this is what makes the recurring-transaction
   * sweep idempotent: re-running it inserts nothing and returns 0.
   */
  saveAllIgnoringDuplicates(transactions: Transaction[]): Promise<number>;
  delete(id: string): Promise<void>;
  count(accountId: string): Promise<number>;
  /**
   * Sums EXPENSE amounts (integer cents) per category across the user's
   * accounts within [dateFrom, dateToExclusive). Categories with no
   * expenses in the window are absent from the map.
   */
  sumExpensesByCategory(
    userId: string,
    categoryIds: string[],
    dateFrom: Date,
    dateToExclusive: Date
  ): Promise<Map<string, number>>;
}
