import {
  PrismaClient,
  Prisma,
  Transaction as TransactionRow,
  TransactionType as PrismaTransactionType,
} from '@prisma/client';
import { Transaction } from '@domain/entities/Transaction';
import {
  ITransactionRepository,
  TransactionFilter,
} from '@domain/repositories/ITransactionRepository';
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

  async findByFilter(
    filter: TransactionFilter,
    limit: number,
    offset: number
  ): Promise<Transaction[]> {
    const date: Prisma.DateTimeFilter = {};
    if (filter.dateFrom) {
      date.gte = filter.dateFrom;
    }
    if (filter.dateTo) {
      date.lte = filter.dateTo;
    }

    const rows = await this.prisma.transaction.findMany({
      where: {
        // Ownership is enforced through the account relation, so a foreign
        // accountId/categoryId can never leak another user's transactions.
        account: { userId: filter.userId },
        ...(filter.accountId ? { accountId: filter.accountId } : {}),
        ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
        ...(filter.dateFrom || filter.dateTo ? { date } : {}),
      },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset,
    });
    return rows.map((row) => this.toDomain(row));
  }

  async save(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({ data: this.toRow(transaction) });
  }

  async saveAllIgnoringDuplicates(
    transactions: Transaction[]
  ): Promise<number> {
    if (transactions.length === 0) {
      return 0;
    }
    // skipDuplicates → ON CONFLICT DO NOTHING against the unique
    // (recurring_rule_id, date) index, so re-sweeps can never double-post.
    const result = await this.prisma.transaction.createMany({
      data: transactions.map((transaction) => this.toRow(transaction)),
      skipDuplicates: true,
    });
    return result.count;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }

  async count(accountId: string): Promise<number> {
    return this.prisma.transaction.count({ where: { accountId } });
  }

  /**
   * Spent-per-category is never stored: it is derived here in SQL (mirrors
   * PrismaAccountRepository.deriveBalances) so budgeting N categories costs
   * one query instead of loading every transaction. Sums the base-currency
   * values so categories spanning accounts in different currencies
   * aggregate correctly.
   */
  async sumExpensesByCategory(
    userId: string,
    categoryIds: string[],
    dateFrom: Date,
    dateToExclusive: Date
  ): Promise<Map<string, number>> {
    const spent = new Map<string, number>();
    if (categoryIds.length === 0) {
      return spent;
    }

    const sums = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        // Ownership is enforced through the account relation, so a foreign
        // categoryId can never aggregate another user's transactions.
        account: { userId },
        categoryId: { in: categoryIds },
        type: 'EXPENSE',
        date: { gte: dateFrom, lt: dateToExclusive },
      },
      _sum: { baseAmountCents: true },
    });

    for (const sum of sums) {
      if (sum.categoryId !== null) {
        spent.set(sum.categoryId, sum._sum.baseAmountCents ?? 0);
      }
    }

    return spent;
  }

  private toRow(transaction: Transaction) {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      recurringRuleId: transaction.recurringRuleId,
      amountCents: transaction.amount.getCents(),
      currency: transaction.amount.getCurrency(),
      baseAmountCents: transaction.baseAmount.getCents(),
      baseCurrency: transaction.baseAmount.getCurrency(),
      type: transaction.type.getValue() as PrismaTransactionType,
      note: transaction.note,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  private toDomain(row: TransactionRow): Transaction {
    return Transaction.reconstitute({
      id: row.id,
      accountId: row.accountId,
      categoryId: row.categoryId,
      recurringRuleId: row.recurringRuleId,
      amount: Money.fromCents(row.amountCents, row.currency),
      baseAmount: Money.fromCents(row.baseAmountCents, row.baseCurrency),
      type: TransactionType.fromString(row.type),
      note: row.note,
      date: row.date,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
