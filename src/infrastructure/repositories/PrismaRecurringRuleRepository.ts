import {
  PrismaClient,
  RecurringRule as RecurringRuleRow,
  TransactionType as PrismaTransactionType,
  RecurrenceInterval as PrismaRecurrenceInterval,
} from '@prisma/client';
import { RecurringRule } from '@domain/entities/RecurringRule';
import { IRecurringRuleRepository } from '@domain/repositories/IRecurringRuleRepository';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { RecurrenceInterval } from '@domain/value-objects/RecurrenceInterval';

export class PrismaRecurringRuleRepository implements IRecurringRuleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<RecurringRule | null> {
    const row = await this.prisma.recurringRule.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<RecurringRule[]> {
    const rows = await this.prisma.recurringRule.findMany({
      // Ownership is enforced through the account relation, mirroring
      // transactions: a rule is the user's iff its account is.
      where: { account: { userId } },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => this.toDomain(row));
  }

  async save(rule: RecurringRule): Promise<void> {
    await this.prisma.recurringRule.create({
      data: {
        id: rule.id,
        accountId: rule.accountId,
        categoryId: rule.categoryId,
        amountCents: rule.amount.getCents(),
        currency: rule.amount.getCurrency(),
        type: rule.type.getValue() as PrismaTransactionType,
        note: rule.note,
        interval: rule.interval.getValue() as PrismaRecurrenceInterval,
        startDate: rule.startDate,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.recurringRule.delete({ where: { id } });
  }

  private toDomain(row: RecurringRuleRow): RecurringRule {
    return RecurringRule.reconstitute({
      id: row.id,
      accountId: row.accountId,
      categoryId: row.categoryId,
      amount: Money.fromCents(row.amountCents, row.currency),
      type: TransactionType.fromString(row.type),
      note: row.note,
      interval: RecurrenceInterval.fromString(row.interval),
      startDate: row.startDate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
