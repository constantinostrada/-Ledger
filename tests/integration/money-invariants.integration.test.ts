import { describe, expect, it } from 'vitest';
import {
  POST as createAccount,
  GET as listAccounts,
} from '@/app/api/accounts/route';
import {
  POST as createTransaction,
  GET as listTransactions,
} from '@/app/api/transactions/route';
import { PUT as setBudget } from '@/app/api/budgets/route';
import { call, currentPeriod, registerUser } from './helpers';

// Money is ALWAYS integer cents, end to end: validated at the route,
// enforced by the Money value object, stored as Int columns, and derived
// balances/aggregates never leave integer arithmetic.
describe('money invariants (integration)', () => {
  it('materializes an initial balance as an integer-cents opening transaction', async () => {
    const { token } = await registerUser();

    const created = await call(createAccount, '/api/accounts', {
      method: 'POST',
      token,
      body: { name: 'Main', type: 'CHECKING', initialBalanceCents: 100000 },
    });

    expect(created.status).toBe(201);
    expect(created.body.balanceCents).toBe(100000);
    expect(Number.isInteger(created.body.balanceCents)).toBe(true);
    expect(Number.isInteger(created.body.balanceBaseCents)).toBe(true);

    const transactions = await call(
      listTransactions,
      `/api/transactions?accountId=${created.body.id}`,
      { token }
    );
    expect(transactions.status).toBe(200);
    expect(transactions.body).toHaveLength(1);
    expect(transactions.body[0]).toMatchObject({
      accountId: created.body.id,
      amountCents: 100000,
      type: 'INCOME',
      note: 'Opening balance',
    });
  });

  it('rejects non-integer cent amounts everywhere money enters the API', async () => {
    const { token } = await registerUser();
    const account = await call(createAccount, '/api/accounts', {
      method: 'POST',
      token,
      body: { name: 'Floats', type: 'CHECKING' },
    });

    const floatAccount = await call(createAccount, '/api/accounts', {
      method: 'POST',
      token,
      body: { name: 'Bad', type: 'CHECKING', initialBalanceCents: 100.5 },
    });
    expect(floatAccount.status).toBe(400);

    const floatTransaction = await call(
      createTransaction,
      '/api/transactions',
      {
        method: 'POST',
        token,
        body: {
          accountId: account.body.id,
          amountCents: 10.5,
          currency: 'USD',
          type: 'EXPENSE',
          note: 'Half a cent',
          date: new Date().toISOString(),
        },
      }
    );
    expect(floatTransaction.status).toBe(400);

    const floatBudget = await call(setBudget, '/api/budgets', {
      method: 'PUT',
      token,
      body: {
        categoryId: 'irrelevant',
        period: currentPeriod(),
        limitCents: 99.99,
        currency: 'USD',
      },
    });
    expect(floatBudget.status).toBe(400);
  });

  it('rejects zero and negative amounts', async () => {
    const { token } = await registerUser();
    const account = await call(createAccount, '/api/accounts', {
      method: 'POST',
      token,
      body: { name: 'Signs', type: 'CHECKING', initialBalanceCents: 5000 },
    });

    for (const amountCents of [0, -100]) {
      const result = await call(createTransaction, '/api/transactions', {
        method: 'POST',
        token,
        body: {
          accountId: account.body.id,
          amountCents,
          currency: 'USD',
          type: 'EXPENSE',
          note: 'Invalid amount',
          date: new Date().toISOString(),
        },
      });
      expect(result.status).toBe(400);
    }

    const negativeOpening = await call(createAccount, '/api/accounts', {
      method: 'POST',
      token,
      body: { name: 'Negative', type: 'CHECKING', initialBalanceCents: -1 },
    });
    expect(negativeOpening.status).toBe(400);
  });

  it('derives balances with exact integer arithmetic', async () => {
    const { token } = await registerUser();
    const account = await call(createAccount, '/api/accounts', {
      method: 'POST',
      token,
      body: { name: 'Ledger', type: 'CHECKING', initialBalanceCents: 100000 },
    });

    const post = (amountCents: number, type: 'INCOME' | 'EXPENSE') =>
      call(createTransaction, '/api/transactions', {
        method: 'POST',
        token,
        body: {
          accountId: account.body.id,
          amountCents,
          currency: 'USD',
          type,
          note: `${type} ${amountCents}`,
          date: new Date().toISOString(),
        },
      });

    expect((await post(3333, 'EXPENSE')).status).toBe(201);
    expect((await post(6667, 'EXPENSE')).status).toBe(201);
    expect((await post(1, 'INCOME')).status).toBe(201);

    const accounts = await call(listAccounts, '/api/accounts', { token });
    const reloaded = accounts.body.find((a: any) => a.id === account.body.id);
    // 100000 - 3333 - 6667 + 1 — exact, no float drift possible.
    expect(reloaded.balanceCents).toBe(90001);
    expect(Number.isInteger(reloaded.balanceCents)).toBe(true);
  });

  it('converts foreign-currency amounts to integer base cents, rounded to the nearest cent', async () => {
    const { token } = await registerUser({ baseCurrency: 'USD' });
    const account = await call(createAccount, '/api/accounts', {
      method: 'POST',
      token,
      body: { name: 'EUR spending', type: 'CHECKING', currency: 'EUR' },
    });

    const result = await call(createTransaction, '/api/transactions', {
      method: 'POST',
      token,
      body: {
        accountId: account.body.id,
        amountCents: 999,
        currency: 'EUR',
        type: 'INCOME',
        note: 'Euro income',
        date: new Date().toISOString(),
      },
    });

    expect(result.status).toBe(201);
    expect(result.body.amountCents).toBe(999);
    expect(result.body.currency).toBe('EUR');
    // 999 * 1.08 (fixed EUR→USD rate) = 1078.92 → rounds to 1079 cents.
    expect(result.body.baseAmountCents).toBe(1079);
    expect(result.body.baseCurrency).toBe('USD');
    expect(Number.isInteger(result.body.baseAmountCents)).toBe(true);
  });
});
