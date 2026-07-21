import {
  PrismaClient,
  Transaction as TransactionRow,
  TransactionType as PrismaTransactionType,
} from '@prisma/client';
import { Transaction } from '@domain/entities/Transaction';
import { ITransactionRepository } from '@domain/repositories/ITransactionRepository';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';

export class PrismaTransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Transaction | null> {
    const row = await this.prisma.transaction.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const rows = await this.prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async findByAccountIdWithPagination(
    accountId: string,
    limit: number,
    offset: number
  ): Promise<Transaction[]> {
    const rows = await this.prisma.transaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });
    return rows.map((row) => this.toDomain(row));
  }

  async save(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        accountId: transaction.accountId,
        categoryId: transaction.categoryId,
        amountCents: transaction.amount.getCents(),
        currency: transaction.amount.getCurrency(),
        type: transaction.type.getValue() as PrismaTransactionType,
        description: transaction.description,
        date: transaction.date,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }

  async count(accountId: string): Promise<number> {
    return this.prisma.transaction.count({ where: { accountId } });
  }

  private toDomain(row: TransactionRow): Transaction {
    return Transaction.reconstitute({
      id: row.id,
      accountId: row.accountId,
      categoryId: row.categoryId,
      amount: Money.fromCents(row.amountCents, row.currency),
      type: TransactionType.fromString(row.type),
      description: row.description,
      date: row.date,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
