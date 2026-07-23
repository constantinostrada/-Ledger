import { describe, expect, it } from 'vitest';
import { Account } from '@domain/entities/Account';
import { Category } from '@domain/entities/Category';
import { Transaction } from '@domain/entities/Transaction';
import { User } from '@domain/entities/User';
import {
  IAccountRepository,
  FindByUserIdOptions,
} from '@domain/repositories/IAccountRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import {
  ITransactionRepository,
  MonthlyTypeTotal,
} from '@domain/repositories/ITransactionRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { AccountType } from '@domain/value-objects/AccountType';
import { BudgetPeriod } from '@domain/value-objects/BudgetPeriod';
import { Money } from '@domain/value-objects/Money';
import { TransactionType } from '@domain/value-objects/TransactionType';
import { GetSpendByCategoryReportUseCase } from '@application/use-cases/GetSpendByCategoryReportUseCase';
import { GetIncomeVsExpenseReportUseCase } from '@application/use-cases/GetIncomeVsExpenseReportUseCase';
import { GetNetWorthReportUseCase } from '@application/use-cases/GetNetWorthReportUseCase';

const USER_ID = 'user-1';

class StubUserRepository implements IUserRepository {
  constructor(
    private readonly user = User.create({
      id: USER_ID,
      email: 'user1@ledger.dev',
      passwordHash: 'hash',
      baseCurrency: 'USD',
    })
  ) {}

  async findById(id: string): Promise<User | null> {
    return id === this.user.id ? this.user : null;
  }

  async findByEmail(): Promise<User | null> {
    return null;
  }

  async save(): Promise<void> {}
  async update(): Promise<void> {}
  async delete(): Promise<void> {}
}

class StubCategoryRepository implements ICategoryRepository {
  constructor(private readonly categories: Category[] = []) {}

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((category) => category.id === id) ?? null;
  }

  async findByUserAndName(): Promise<Category | null> {
    return null;
  }

  async findAllByUser(userId: string): Promise<Category[]> {
    return this.categories.filter((category) => category.userId === userId);
  }

  async save(): Promise<void> {}
  async saveAll(): Promise<void> {}
  async update(): Promise<void> {}
  async delete(): Promise<void> {}

  async isInUse(): Promise<boolean> {
    return false;
  }
}

class StubTransactionRepository implements ITransactionRepository {
  constructor(
    private readonly spentByCategory = new Map<string | null, number>(),
    private readonly monthlyTotals: MonthlyTypeTotal[] = []
  ) {}

  lastRange: { dateFrom: Date; dateToExclusive: Date } | null = null;

  async findById(): Promise<Transaction | null> {
    return null;
  }

  async findByAccountId(): Promise<Transaction[]> {
    return [];
  }

  async findByFilter(): Promise<Transaction[]> {
    return [];
  }

  async save(): Promise<void> {}

  async saveAllIgnoringDuplicates(): Promise<number> {
    return 0;
  }

  async delete(): Promise<void> {}

  async count(): Promise<number> {
    return 0;
  }

  async sumExpensesByCategory(): Promise<Map<string, number>> {
    return new Map();
  }

  async sumExpensesGroupedByCategory(
    _userId: string,
    dateFrom: Date,
    dateToExclusive: Date
  ): Promise<Map<string | null, number>> {
    this.lastRange = { dateFrom, dateToExclusive };
    return this.spentByCategory;
  }

  async sumByTypePerMonth(
    _userId: string,
    dateFrom: Date,
    dateToExclusive: Date
  ): Promise<MonthlyTypeTotal[]> {
    this.lastRange = { dateFrom, dateToExclusive };
    return this.monthlyTotals;
  }
}

class StubAccountRepository implements IAccountRepository {
  constructor(private readonly accounts: Account[]) {}

  lastOptions: FindByUserIdOptions | undefined;

  async findById(id: string): Promise<Account | null> {
    return this.accounts.find((account) => account.id === id) ?? null;
  }

  async findByUserId(
    _userId: string,
    options?: FindByUserIdOptions
  ): Promise<Account[]> {
    this.lastOptions = options;
    return this.accounts;
  }

  async save(): Promise<void> {}
  async update(): Promise<void> {}
  async delete(): Promise<void> {}
}

function category(id: string, name: string): Category {
  return Category.create({
    id,
    userId: USER_ID,
    name,
    kind: TransactionType.expense(),
    color: '#22C55E',
  });
}

function account(
  id: string,
  name: string,
  currency: string,
  balanceCents: number,
  balanceBaseCents: number,
  isActive = true
): Account {
  const created = Account.create({
    id,
    userId: USER_ID,
    name,
    type: AccountType.fromString('CHECKING'),
    balance: Money.fromCents(balanceCents, currency),
    balanceBase: Money.fromCents(balanceBaseCents, 'USD'),
  });
  if (!isActive) {
    created.archive();
  }
  return created;
}

describe('BudgetPeriod month iteration', () => {
  it('steps to the next month and rolls over year ends', () => {
    expect(BudgetPeriod.fromString('2026-01').next().getValue()).toBe(
      '2026-02'
    );
    expect(BudgetPeriod.fromString('2026-12').next().getValue()).toBe(
      '2027-01'
    );
  });

  it('counts months between periods and orders them', () => {
    const jan = BudgetPeriod.fromString('2026-01');
    const apr = BudgetPeriod.fromString('2026-04');
    expect(jan.monthsUntil(apr)).toBe(3);
    expect(apr.monthsUntil(jan)).toBe(-3);
    expect(apr.isAfter(jan)).toBe(true);
    expect(jan.isAfter(apr)).toBe(false);
    expect(jan.isAfter(jan)).toBe(false);
  });
});

describe('GetSpendByCategoryReportUseCase', () => {
  it('reports per-category spend for the month, largest first', async () => {
    const transactions = new StubTransactionRepository(
      new Map<string | null, number>([
        ['cat-groceries', 12_000],
        ['cat-rent', 90_000],
        [null, 1_500],
      ])
    );
    const useCase = new GetSpendByCategoryReportUseCase(
      transactions,
      new StubCategoryRepository([
        category('cat-groceries', 'Groceries'),
        category('cat-rent', 'Rent'),
      ]),
      new StubUserRepository()
    );

    const report = await useCase.execute(USER_ID, { period: '2026-06' });

    expect(report.period).toBe('2026-06');
    expect(report.baseCurrency).toBe('USD');
    expect(report.totalSpentCents).toBe(103_500);
    expect(report.categories).toEqual([
      { categoryId: 'cat-rent', categoryName: 'Rent', spentCents: 90_000 },
      {
        categoryId: 'cat-groceries',
        categoryName: 'Groceries',
        spentCents: 12_000,
      },
      { categoryId: null, categoryName: null, spentCents: 1_500 },
    ]);

    // The aggregate is asked for exactly the UTC month window.
    expect(transactions.lastRange?.dateFrom.toISOString()).toBe(
      '2026-06-01T00:00:00.000Z'
    );
    expect(transactions.lastRange?.dateToExclusive.toISOString()).toBe(
      '2026-07-01T00:00:00.000Z'
    );
  });

  it('rejects a malformed period', async () => {
    const useCase = new GetSpendByCategoryReportUseCase(
      new StubTransactionRepository(),
      new StubCategoryRepository(),
      new StubUserRepository()
    );

    await expect(
      useCase.execute(USER_ID, { period: '2026-13' })
    ).rejects.toThrow('Budget period must be a month formatted YYYY-MM');
  });
});

describe('GetIncomeVsExpenseReportUseCase', () => {
  it('builds a zero-filled monthly series with net amounts', async () => {
    const transactions = new StubTransactionRepository(new Map(), [
      { month: '2026-04', type: 'INCOME', totalCents: 500_000 },
      { month: '2026-04', type: 'EXPENSE', totalCents: 320_000 },
      { month: '2026-06', type: 'EXPENSE', totalCents: 40_000 },
    ]);
    const useCase = new GetIncomeVsExpenseReportUseCase(
      transactions,
      new StubUserRepository()
    );

    const report = await useCase.execute(USER_ID, {
      from: '2026-04',
      to: '2026-06',
    });

    expect(report.baseCurrency).toBe('USD');
    expect(report.points).toEqual([
      {
        period: '2026-04',
        incomeCents: 500_000,
        expenseCents: 320_000,
        netCents: 180_000,
      },
      { period: '2026-05', incomeCents: 0, expenseCents: 0, netCents: 0 },
      {
        period: '2026-06',
        incomeCents: 0,
        expenseCents: 40_000,
        netCents: -40_000,
      },
    ]);

    // The aggregate window spans the whole series, end-exclusive.
    expect(transactions.lastRange?.dateFrom.toISOString()).toBe(
      '2026-04-01T00:00:00.000Z'
    );
    expect(transactions.lastRange?.dateToExclusive.toISOString()).toBe(
      '2026-07-01T00:00:00.000Z'
    );
  });

  it('rejects an inverted range', async () => {
    const useCase = new GetIncomeVsExpenseReportUseCase(
      new StubTransactionRepository(),
      new StubUserRepository()
    );

    await expect(
      useCase.execute(USER_ID, { from: '2026-06', to: '2026-04' })
    ).rejects.toThrow('"from" month must not be after "to" month');
  });

  it('rejects a range longer than 120 months', async () => {
    const useCase = new GetIncomeVsExpenseReportUseCase(
      new StubTransactionRepository(),
      new StubUserRepository()
    );

    await expect(
      useCase.execute(USER_ID, { from: '2016-01', to: '2026-12' })
    ).rejects.toThrow('Range must not exceed 120 months');
  });
});

describe('GetNetWorthReportUseCase', () => {
  it('sums base-currency balances across accounts, archived included', async () => {
    const accounts = new StubAccountRepository([
      account('acc-usd', 'Checking', 'USD', 250_000, 250_000),
      account('acc-eur', 'Euro Savings', 'EUR', 100_000, 108_000),
      account('acc-old', 'Closed', 'USD', 5_000, 5_000, false),
    ]);
    const useCase = new GetNetWorthReportUseCase(
      accounts,
      new StubUserRepository()
    );

    const report = await useCase.execute(USER_ID);

    expect(report.baseCurrency).toBe('USD');
    expect(report.netWorthCents).toBe(363_000);
    expect(accounts.lastOptions).toEqual({ includeArchived: true });
    expect(report.accounts).toHaveLength(3);
    expect(report.accounts[1]).toEqual({
      accountId: 'acc-eur',
      name: 'Euro Savings',
      type: 'CHECKING',
      currency: 'EUR',
      balanceCents: 100_000,
      balanceBaseCents: 108_000,
      isActive: true,
    });
    expect(report.accounts[2].isActive).toBe(false);
  });

  it('rejects an unknown user', async () => {
    const useCase = new GetNetWorthReportUseCase(
      new StubAccountRepository([]),
      new StubUserRepository()
    );

    await expect(useCase.execute('someone-else')).rejects.toThrow(
      'User not found'
    );
  });
});
