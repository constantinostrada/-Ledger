import { Pool } from 'pg';
import { Transaction } from '@domain/entities/Transaction';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';

interface TransactionRow {
  id: string;
  account_id: string;
  amount_value: string;
  amount_currency: string;
  type: string;
  description: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

export class PostgresTransactionRepository implements ITransactionRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<Transaction | null> {
    const result = await this.pool.query<TransactionRow>(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.toDomain(result.rows[0]);
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const result = await this.pool.query<TransactionRow>(
      'SELECT * FROM transactions WHERE account_id = $1 ORDER BY date DESC',
      [accountId]
    );

    return result.rows.map((row) => this.toDomain(row));
  }

  async findByAccountIdWithPagination(
    accountId: string,
    limit: number,
    offset: number
  ): Promise<Transaction[]> {
    const result = await this.pool.query<TransactionRow>(
      'SELECT * FROM transactions WHERE account_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
      [accountId, limit, offset]
    );

    return result.rows.map((row) => this.toDomain(row));
  }

  async save(transaction: Transaction): Promise<void> {
    await this.pool.query(
      `INSERT INTO transactions (id, account_id, amount_value, amount_currency, type, description, date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        transaction.id,
        transaction.accountId,
        transaction.amount.getAmount(),
        transaction.amount.getCurrency(),
        transaction.type.getValue(),
        transaction.description,
        transaction.date,
        transaction.createdAt,
        transaction.updatedAt,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM transactions WHERE id = $1', [id]);
  }

  async count(accountId: string): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      'SELECT COUNT(*) as count FROM transactions WHERE account_id = $1',
      [accountId]
    );

    return parseInt(result.rows[0].count, 10);
  }

  private toDomain(row: TransactionRow): Transaction {
    return new Transaction({
      id: row.id,
      accountId: row.account_id,
      amount: new Money(parseFloat(row.amount_value), row.amount_currency),
      type: TransactionType.fromString(row.type),
      description: row.description,
      date: new Date(row.date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}
