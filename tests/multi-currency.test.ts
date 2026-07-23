import { describe, expect, it } from 'vitest';
import { Account } from '@domain/entities/Account';
import { Category } from '@domain/entities/Category';
import { Transaction } from '@domain/entities/Transaction';
import { User } from '@domain/entities/User';
import { IAccountRepository } from '@domain/repositories/IAccountRepository';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import {
  ITransactionRepository,
  TransactionFilter,
} from '@domain/repositories/ITransactionRepository';
import { IUserRepository } from '@domain/repositories/IUserRepository';
import { Money } from '@domain/value-objects/Money';
import { AccountType } from '@domain/value-objects/AccountType';
import { TransactionService } from '@domain/services/TransactionService';
import { CreateTransactionUseCase } from '@application/use-cases/CreateTransactionUseCase';
import { BaseCurrencyConverter } from '@application/services/BaseCurrencyConverter';
import { IIdGenerator } from '@application/ports/IIdGenerator';
import { FixedExchangeRateProvider } from '@infrastructure/exchange-rates/FixedExchangeRateProvider';

const USER_ID = 'user-1';

const converter = new BaseCurrencyConverter(new FixedExchangeRateProvider());

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

class StubAccountRepository implements IAccountRepository {
  constructor(private readonly account: Account) {}

  async findById(id: string): Promise<Account | null> {
    return id === this.account.id ? this.account : null;
  }

  async findByUserId(): Promise<Account[]> {
    return [this.account];
  }

  async save(): Promise<void> {}
  async update(): Promise<void> {}
  async delete(): Promise<void> {}
}

class StubCategoryRepository implements ICategoryRepository {
  async findById(): Promise<Category | null> {
    return null;
  }

  async findByUserAndName(): Promise<Category | null> {
    return null;
  }

  async findAllByUser(): Promise<Category[]> {
    return [];
  }

  async save(): Promise<void> {}
  async saveAll(): Promise<void> {}
  async update(): Promise<void> {}
  async delete(): Promise<void> {}

  async isInUse(): Promise<boolean> {
    return false;
  }
}

class FakeTransactionRepository implements ITransactionRepository {
  readonly stored: Transaction[] = [];

  async findById(): Promise<Transaction | null> {
    return null;
  }

  async findByAccountId(): Promise<Transaction[]> {
    return this.stored;
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
    this.stored.push(...transactions);
    return transactions.length;
  }

  async delete(): Promise<void> {}

  async count(): Promise<number> {
    return this.stored.length;
  }

  async sumExpensesByCategory(): Promise<Map<string, number>> {
    return new Map();
  }
}

class SequentialIdGenerator implements IIdGenerator {
  private next = 0;

  generate(): string {
    this.next += 1;
    return `id-${this.next}`;
  }
}

function eurAccount(balanceCents: number): Account {
  return Account.create({
    id: 'acc-eur',
    userId: USER_ID,
    name: 'Euro Account',
    type: AccountType.fromString('SAVINGS'),
    balance: Money.fromCents(balanceCents, 'EUR'),
    balanceBase: Money.fromCents(Math.round(balanceCents * 1.08), 'USD'),
  });
}

function makeUseCase(account: Account, repository: FakeTransactionRepository) {
  return new CreateTransactionUseCase(
    repository,
    new StubAccountRepository(account),
    new StubCategoryRepository(),
    new StubUserRepository(),
    new TransactionService(),
    converter,
    new SequentialIdGenerator()
  );
}

describe('Money.convertTo', () => {
  it('converts at the rate, rounding to the nearest cent', () => {
    const eur = Money.fromCents(4_500, 'EUR');
    const usd = eur.convertTo('USD', 1.08);
    expect(usd.getCents()).toBe(4_860);
    expect(usd.getCurrency()).toBe('USD');

    // 1234 * 1.08 = 1332.72 → rounds to 1333, never a fractional cent.
    expect(Money.fromCents(1_234, 'EUR').convertTo('USD', 1.08).getCents()).toBe(
      1_333
    );
  });

  it('is the identity for the same currency', () => {
    const usd = Money.fromCents(500, 'USD');
    expect(usd.convertTo('USD', 1)).toBe(usd);
  });

  it('rejects non-positive rates', () => {
    expect(() => Money.fromCents(100, 'EUR').convertTo('USD', 0)).toThrow(
      'Exchange rate must be a positive number'
    );
  });
});

describe('FixedExchangeRateProvider', () => {
  const provider = new FixedExchangeRateProvider();

  it('returns 1 for same-currency pairs', async () => {
    expect(await provider.getRate('USD', 'USD')).toBe(1);
  });

  it('derives cross rates through the USD pivot', async () => {
    expect(await provider.getRate('EUR', 'USD')).toBeCloseTo(1.08);
    const eurToGbp = await provider.getRate('EUR', 'GBP');
    const gbpToEur = await provider.getRate('GBP', 'EUR');
    expect(eurToGbp * gbpToEur).toBeCloseTo(1);
  });

  it('rejects currencies it has no rate for', async () => {
    await expect(provider.getRate('XXX', 'USD')).rejects.toThrow(
      'No exchange rate available for XXX'
    );
  });
});

describe('CreateTransactionUseCase multi-currency', () => {
  it('stores the original amount and its base-currency value', async () => {
    const repository = new FakeTransactionRepository();
    const useCase = makeUseCase(eurAccount(100_000), repository);

    const dto = await useCase.execute(USER_ID, {
      accountId: 'acc-eur',
      amountCents: 4_500,
      currency: 'EUR',
      type: 'EXPENSE',
      note: 'Museum tickets',
      date: new Date().toISOString(),
    });

    expect(dto.amountCents).toBe(4_500);
    expect(dto.currency).toBe('EUR');
    expect(dto.baseAmountCents).toBe(4_860); // 45.00 EUR at 1.08
    expect(dto.baseCurrency).toBe('USD');

    const stored = repository.stored[0];
    expect(stored.amount.getCurrency()).toBe('EUR');
    expect(stored.baseAmount.getCents()).toBe(4_860);
  });

  it('keeps base value identical to the original for base-currency transactions', async () => {
    const account = Account.create({
      id: 'acc-usd',
      userId: USER_ID,
      name: 'USD Account',
      type: AccountType.fromString('CHECKING'),
      balance: Money.fromCents(50_000, 'USD'),
      balanceBase: Money.fromCents(50_000, 'USD'),
    });
    const repository = new FakeTransactionRepository();
    const useCase = makeUseCase(account, repository);

    const dto = await useCase.execute(USER_ID, {
      accountId: 'acc-usd',
      amountCents: 1_000,
      currency: 'USD',
      type: 'EXPENSE',
      note: 'Coffee',
      date: new Date().toISOString(),
    });

    expect(dto.baseAmountCents).toBe(dto.amountCents);
    expect(dto.baseCurrency).toBe('USD');
  });

  it('rejects transactions in a currency other than the account currency', async () => {
    const repository = new FakeTransactionRepository();
    const useCase = makeUseCase(eurAccount(100_000), repository);

    await expect(
      useCase.execute(USER_ID, {
        accountId: 'acc-eur',
        amountCents: 1_000,
        currency: 'USD',
        type: 'EXPENSE',
        note: 'Wrong currency',
        date: new Date().toISOString(),
      })
    ).rejects.toThrow('Transaction currency must match the account currency');
    expect(repository.stored).toHaveLength(0);
  });
});
