import { Pool } from 'pg';
import { Account } from '@domain/entities/Account';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { Money } from '@domain/value-objects/Money';
import { AccountType } from '@domain/value-objects/AccountType';

interface AccountRow {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance_amount: string;
  balance_currency: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class PostgresAccountRepository implements IAccountRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<Account | null> {
    const result = await this.pool.query<AccountRow>(
      'SELECT * FROM accounts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.toDomain(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const result = await this.pool.query<AccountRow>(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return result.rows.map((row) => this.toDomain(row));
  }

  async save(account: Account): Promise<void> {
    await this.pool.query(
      `INSERT INTO accounts (id, user_id, name, type, balance_amount, balance_currency, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        account.id,
        account.userId,
        account.name,
        account.type.getValue(),
        account.balance.getAmount(),
        account.balance.getCurrency(),
        account.isActive,
        account.createdAt,
        account.updatedAt,
      ]
    );
  }

  async update(account: Account): Promise<void> {
    await this.pool.query(
      `UPDATE accounts 
       SET name = $2, type = $3, balance_amount = $4, balance_currency = $5, is_active = $6, updated_at = $7
       WHERE id = $1`,
      [
        account.id,
        account.name,
        account.type.getValue(),
        account.balance.getAmount(),
        account.balance.getCurrency(),
        account.isActive,
        new Date(),
      ]
    );
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM accounts WHERE id = $1', [id]);
  }

  private toDomain(row: AccountRow): Account {
    return new Account({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      type: AccountType.fromString(row.type),
      balance: new Money(parseFloat(row.balance_amount), row.balance_currency),
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}
