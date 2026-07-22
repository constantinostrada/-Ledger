import { describe, expect, it } from 'vitest';
import { Transaction } from '@domain/entities/Transaction';
import { RecurringRule } from '@domain/entities/RecurringRule';
import { IRecurringRuleRepository } from '@domain/repositories/IRecurringRuleRepository';
import {
  ITransactionRepository,
  TransactionFilter,
} from '@domain/repositories/ITransactionRepository';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { RecurrenceInterval } from '@domain/value-objects/RecurrenceInterval';
import { MaterializeRecurringTransactionsUseCase } from '@application/use-cases/MaterializeRecurringTransactionsUseCase';
import { IIdGenerator } from '@application/ports/IIdGenerator';

const USER_ID = 'user-1';

class FakeRecurringRuleRepository implements IRecurringRuleRepository {
  constructor(private rules: RecurringRule[]) {}

  async findById(id: string): Promise<RecurringRule | null> {
    return this.rules.find((rule) => rule.id === id) ?? null;
  }

  async findByUserId(): Promise<RecurringRule[]> {
    return this.rules;
  }

  async save(rule: RecurringRule): Promise<void> {
    this.rules.push(rule);
  }

  async delete(id: string): Promise<void> {
    this.rules = this.rules.filter((rule) => rule.id !== id);
  }
}

/**
 * Honors the same contract as the Postgres unique index on
 * (recurring_rule_id, date): conflicting inserts are silently skipped.
 */
class FakeTransactionRepository implements ITransactionRepository {
  readonly stored: Transaction[] = [];

  async findById(id: string): Promise<Transaction | null> {
    return this.stored.find((transaction) => transaction.id === id) ?? null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return this.stored.filter(
      (transaction) => transaction.accountId === accountId
    );
  }

  async findByFilter(_filter: TransactionFilter): Promise<Transaction[]> {
    return this.stored;
  }

  async save(transaction: Transaction): Promise<void> {
    this.stored.push(transaction);
  }

  async saveAllIgnoringDuplicates(
    transactions: Transaction[]
  ): Promise<number> {
    let created = 0;
    for (const transaction of transactions) {
      const duplicate = this.stored.some(
        (existing) =>
          existing.recurringRuleId !== null &&
          existing.recurringRuleId === transaction.recurringRuleId &&
          existing.date.getTime() === transaction.date.getTime()
      );
      if (!duplicate) {
        this.stored.push(transaction);
        created += 1;
      }
    }
    return created;
  }

  async delete(id: string): Promise<void> {
    const index = this.stored.findIndex((transaction) => transaction.id === id);
    if (index >= 0) {
      this.stored.splice(index, 1);
    }
  }

  async count(accountId: string): Promise<number> {
    return (await this.findByAccountId(accountId)).length;
  }

  async sumExpensesByCategory(): Promise<Map<string, number>> {
    return new Map();
  }
}

class SequentialIdGenerator implements IIdGenerator {
  private next = 0;

  generate(): string {
    this.next += 1;
    return `txn-${this.next}`;
  }
}

function weeklyRuleStartingDaysAgo(daysAgo: number): RecurringRule {
  return RecurringRule.create({
    id: 'rule-rent',
    accountId: 'acc-1',
    categoryId: 'cat-rent',
    amount: Money.fromCents(120_000, 'USD'),
    type: TransactionType.expense(),
    note: 'Rent',
    interval: RecurrenceInterval.weekly(),
    startDate: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
  });
}

describe('recurring rule due dates', () => {
  it('generates one occurrence per interval through asOf', () => {
    const rule = RecurringRule.create({
      id: 'rule-1',
      accountId: 'acc-1',
      categoryId: null,
      amount: Money.fromCents(5_000, 'USD'),
      type: TransactionType.income(),
      note: 'Allowance',
      interval: RecurrenceInterval.monthly(),
      startDate: new Date('2026-03-15T00:00:00.000Z'),
    });

    const dueDates = rule.dueDatesThrough(new Date('2026-05-20T00:00:00.000Z'));

    expect(dueDates.map((date) => date.toISOString())).toEqual([
      '2026-03-15T00:00:00.000Z',
      '2026-04-15T00:00:00.000Z',
      '2026-05-15T00:00:00.000Z',
    ]);
  });

  it('clamps monthly occurrences to the end of shorter months', () => {
    const rule = RecurringRule.create({
      id: 'rule-2',
      accountId: 'acc-1',
      categoryId: null,
      amount: Money.fromCents(5_000, 'USD'),
      type: TransactionType.expense(),
      note: 'Subscription',
      interval: RecurrenceInterval.monthly(),
      startDate: new Date('2026-01-31T00:00:00.000Z'),
    });

    const dueDates = rule.dueDatesThrough(new Date('2026-04-10T00:00:00.000Z'));

    expect(dueDates.map((date) => date.toISOString())).toEqual([
      '2026-01-31T00:00:00.000Z',
      '2026-02-28T00:00:00.000Z', // clamped
      '2026-03-31T00:00:00.000Z', // back on the start day-of-month
    ]);
  });

  it('generates nothing for rules starting in the future', () => {
    const rule = weeklyRuleStartingDaysAgo(-30);
    expect(rule.dueDatesThrough(new Date())).toEqual([]);
  });
});

describe('MaterializeRecurringTransactionsUseCase (the sweep)', () => {
  it('materializes one transaction per due date, carrying the rule fields', async () => {
    // Started 15 days ago, weekly → due on day 0, 7 and 14 = 3 occurrences.
    const rule = weeklyRuleStartingDaysAgo(15);
    const transactionRepository = new FakeTransactionRepository();
    const useCase = new MaterializeRecurringTransactionsUseCase(
      new FakeRecurringRuleRepository([rule]),
      transactionRepository,
      new SequentialIdGenerator()
    );

    const result = await useCase.execute(USER_ID);

    expect(result).toEqual({ dueCount: 3, createdCount: 3 });
    expect(transactionRepository.stored).toHaveLength(3);
    for (const transaction of transactionRepository.stored) {
      expect(transaction.recurringRuleId).toBe(rule.id);
      expect(transaction.accountId).toBe(rule.accountId);
      expect(transaction.categoryId).toBe(rule.categoryId);
      expect(transaction.amount.getCents()).toBe(120_000);
      expect(transaction.type.isExpense()).toBe(true);
      expect(transaction.note).toBe('Rent');
    }
  });

  it('is idempotent: running the sweep twice yields one transaction per due date', async () => {
    const rule = weeklyRuleStartingDaysAgo(15);
    const transactionRepository = new FakeTransactionRepository();
    const useCase = new MaterializeRecurringTransactionsUseCase(
      new FakeRecurringRuleRepository([rule]),
      transactionRepository,
      new SequentialIdGenerator()
    );

    const firstRun = await useCase.execute(USER_ID);
    const secondRun = await useCase.execute(USER_ID);

    expect(firstRun.createdCount).toBe(3);
    expect(secondRun.createdCount).toBe(0);

    // Exactly one transaction per due date — no double-posting.
    const dates = transactionRepository.stored.map((transaction) =>
      transaction.date.getTime()
    );
    expect(dates).toHaveLength(3);
    expect(new Set(dates).size).toBe(3);
  });

  it('only materializes the missing due dates on later sweeps', async () => {
    const transactionRepository = new FakeTransactionRepository();
    const ruleRepository = new FakeRecurringRuleRepository([
      weeklyRuleStartingDaysAgo(15),
    ]);
    const useCase = new MaterializeRecurringTransactionsUseCase(
      ruleRepository,
      transactionRepository,
      new SequentialIdGenerator()
    );

    await useCase.execute(USER_ID);

    // A second rule appears before the next sweep.
    await ruleRepository.save(
      RecurringRule.create({
        id: 'rule-salary',
        accountId: 'acc-1',
        categoryId: 'cat-salary',
        amount: Money.fromCents(350_000, 'USD'),
        type: TransactionType.income(),
        note: 'Salary',
        interval: RecurrenceInterval.daily(),
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      })
    );

    const secondRun = await useCase.execute(USER_ID);

    // Only the new rule's two due dates (yesterday + today) are created.
    expect(secondRun.createdCount).toBe(2);
    expect(transactionRepository.stored).toHaveLength(5);
  });
});
