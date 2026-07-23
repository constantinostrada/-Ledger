import { describe, expect, it } from 'vitest';
import { GET as health } from '@/app/api/health/route';
import { POST as register } from '@/app/api/auth/register/route';
import { POST as login } from '@/app/api/auth/login/route';
import {
  GET as listAccounts,
  POST as createAccountRoute,
} from '@/app/api/accounts/route';
import {
  DELETE as archiveAccount,
  PATCH as updateAccount,
} from '@/app/api/accounts/[id]/route';
import {
  GET as listTransactions,
  POST as createTransaction,
} from '@/app/api/transactions/route';
import {
  GET as listCategories,
  POST as createCategory,
} from '@/app/api/categories/route';
import {
  DELETE as deleteCategory,
  PATCH as updateCategory,
} from '@/app/api/categories/[id]/route';
import { GET as getBudgets, PUT as setBudget } from '@/app/api/budgets/route';
import {
  GET as listRules,
  POST as createRule,
} from '@/app/api/recurring-rules/route';
import { POST as sweep } from '@/app/api/recurring-rules/sweep/route';
import { GET as netWorth } from '@/app/api/reports/net-worth/route';
import { GET as spendByCategory } from '@/app/api/reports/spend-by-category/route';
import { GET as incomeVsExpense } from '@/app/api/reports/income-vs-expense/route';
import {
  call,
  createAccount,
  currentPeriod,
  registerUser,
  utcMidnightDaysAgo,
} from './helpers';

// One pass over the whole API surface: every route is exercised for its
// happy path plus its documented auth/validation/conflict statuses.
describe('API surface (integration)', () => {
  it('GET /api/health reports a healthy database', async () => {
    const result = await call(health, '/api/health');
    expect(result.status).toBe(200);
    expect(result.body).toMatchObject({
      status: 'healthy',
      database: 'connected',
    });
  });

  it('auth: register (201), duplicate email (409), login (200), bad credentials (401)', async () => {
    const { email, password } = await registerUser();

    const duplicate = await call(register, '/api/auth/register', {
      method: 'POST',
      body: { email, password },
    });
    expect(duplicate.status).toBe(409);

    const invalid = await call(register, '/api/auth/register', {
      method: 'POST',
      body: { email: 'not-an-email', password },
    });
    expect(invalid.status).toBe(400);

    const ok = await call(login, '/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    expect(ok.status).toBe(200);
    expect(typeof ok.body.token).toBe('string');
    expect(ok.body.user.email).toBe(email);

    const wrongPassword = await call(login, '/api/auth/login', {
      method: 'POST',
      body: { email, password: 'definitely-wrong' },
    });
    expect(wrongPassword.status).toBe(401);
    expect(wrongPassword.body.error).toBe('Invalid credentials');

    // Unknown email answers identically, so emails can't be enumerated.
    const unknownEmail = await call(login, '/api/auth/login', {
      method: 'POST',
      body: { email: 'nobody@ledger.test', password },
    });
    expect(unknownEmail.status).toBe(401);
    expect(unknownEmail.body.error).toBe('Invalid credentials');
  });

  it('rejects every protected route without a valid token (401)', async () => {
    const protectedCalls: Array<[any, string, object?]> = [
      [listAccounts, '/api/accounts'],
      [createAccountRoute, '/api/accounts', { method: 'POST', body: {} }],
      [
        updateAccount,
        '/api/accounts/x',
        { method: 'PATCH', body: {}, params: { id: 'x' } },
      ],
      [
        archiveAccount,
        '/api/accounts/x',
        { method: 'DELETE', params: { id: 'x' } },
      ],
      [listTransactions, '/api/transactions'],
      [createTransaction, '/api/transactions', { method: 'POST', body: {} }],
      [listCategories, '/api/categories'],
      [createCategory, '/api/categories', { method: 'POST', body: {} }],
      [
        updateCategory,
        '/api/categories/x',
        { method: 'PATCH', body: {}, params: { id: 'x' } },
      ],
      [
        deleteCategory,
        '/api/categories/x',
        { method: 'DELETE', params: { id: 'x' } },
      ],
      [getBudgets, '/api/budgets?period=2026-07'],
      [setBudget, '/api/budgets', { method: 'PUT', body: {} }],
      [listRules, '/api/recurring-rules'],
      [createRule, '/api/recurring-rules', { method: 'POST', body: {} }],
      [sweep, '/api/recurring-rules/sweep', { method: 'POST' }],
      [netWorth, '/api/reports/net-worth'],
      [spendByCategory, '/api/reports/spend-by-category?period=2026-07'],
      [
        incomeVsExpense,
        '/api/reports/income-vs-expense?from=2026-01&to=2026-07',
      ],
    ];

    for (const [handler, path, options] of protectedCalls) {
      const missing = await call(handler, path, options);
      expect(missing.status, `no token: ${path}`).toBe(401);

      const garbage = await call(handler, path, {
        ...options,
        token: 'garbage-token',
      });
      expect(garbage.status, `garbage token: ${path}`).toBe(401);
    }
  });

  it('accounts: create, list, rename, archive, and archived filtering', async () => {
    const { token } = await registerUser();
    const account = await createAccount(token, { name: 'Everyday' });

    const renamed = await call(updateAccount, `/api/accounts/${account.id}`, {
      method: 'PATCH',
      token,
      body: { name: 'Renamed', type: 'SAVINGS' },
      params: { id: account.id },
    });
    expect(renamed.status).toBe(200);
    expect(renamed.body).toMatchObject({ name: 'Renamed', type: 'SAVINGS' });

    const emptyPatch = await call(
      updateAccount,
      `/api/accounts/${account.id}`,
      {
        method: 'PATCH',
        token,
        body: {},
        params: { id: account.id },
      }
    );
    expect(emptyPatch.status).toBe(400);

    const archived = await call(archiveAccount, `/api/accounts/${account.id}`, {
      method: 'DELETE',
      token,
      params: { id: account.id },
    });
    expect(archived.status).toBe(200);
    expect(archived.body.isActive).toBe(false);

    const defaultList = await call(listAccounts, '/api/accounts', { token });
    expect(
      defaultList.body.find((a: any) => a.id === account.id)
    ).toBeUndefined();

    const withArchived = await call(
      listAccounts,
      '/api/accounts?includeArchived=true',
      { token }
    );
    expect(
      withArchived.body.find((a: any) => a.id === account.id)
    ).toMatchObject({ isActive: false });
  });

  it('categories: starter set, create, duplicate (409), update, delete rules', async () => {
    const { token } = await registerUser();

    // Every new user starts with the seeded default categories.
    const starters = await call(listCategories, '/api/categories', { token });
    expect(starters.status).toBe(200);
    expect(starters.body).toHaveLength(9);

    const created = await call(createCategory, '/api/categories', {
      method: 'POST',
      token,
      body: { name: 'Integration Cat', kind: 'EXPENSE', color: '#123ABC' },
    });
    expect(created.status).toBe(201);

    const duplicate = await call(createCategory, '/api/categories', {
      method: 'POST',
      token,
      body: { name: 'Integration Cat', kind: 'INCOME', color: '#000000' },
    });
    expect(duplicate.status).toBe(409);

    const updated = await call(
      updateCategory,
      `/api/categories/${created.body.id}`,
      {
        method: 'PATCH',
        token,
        body: { name: 'Renamed Cat', color: '#654FED' },
        params: { id: created.body.id },
      }
    );
    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      name: 'Renamed Cat',
      color: '#654FED',
    });

    // kind is immutable: it is not an accepted update field at all.
    const kindFlip = await call(
      updateCategory,
      `/api/categories/${created.body.id}`,
      {
        method: 'PATCH',
        token,
        body: { kind: 'INCOME' },
        params: { id: created.body.id },
      }
    );
    expect(kindFlip.status).toBe(400);

    // A category referenced by a transaction cannot be deleted (409)...
    const account = await createAccount(token, { initialBalanceCents: 10000 });
    await call(createTransaction, '/api/transactions', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        categoryId: created.body.id,
        amountCents: 500,
        currency: 'USD',
        type: 'EXPENSE',
        note: 'Uses the category',
        date: new Date().toISOString(),
      },
    });
    const blockedDelete = await call(
      deleteCategory,
      `/api/categories/${created.body.id}`,
      { method: 'DELETE', token, params: { id: created.body.id } }
    );
    expect(blockedDelete.status).toBe(409);

    // ...while an unused one deletes cleanly (204).
    const disposable = await call(createCategory, '/api/categories', {
      method: 'POST',
      token,
      body: { name: 'Disposable', kind: 'EXPENSE', color: '#AAAAAA' },
    });
    const deleted = await call(
      deleteCategory,
      `/api/categories/${disposable.body.id}`,
      { method: 'DELETE', token, params: { id: disposable.body.id } }
    );
    expect(deleted.status).toBe(204);
    expect(deleted.body).toBeNull();
  });

  it('transactions: filters and pagination', async () => {
    const { token } = await registerUser();
    const account = await createAccount(token, { initialBalanceCents: 50000 });

    for (let i = 0; i < 3; i++) {
      await call(createTransaction, '/api/transactions', {
        method: 'POST',
        token,
        body: {
          accountId: account.id,
          amountCents: 100 + i,
          currency: 'USD',
          type: 'EXPENSE',
          note: `Expense ${i}`,
          date: new Date().toISOString(),
        },
      });
    }

    const all = await call(
      listTransactions,
      `/api/transactions?accountId=${account.id}`,
      { token }
    );
    // 3 expenses + the opening balance transaction.
    expect(all.body).toHaveLength(4);

    const page = await call(
      listTransactions,
      `/api/transactions?accountId=${account.id}&limit=2&offset=0`,
      { token }
    );
    expect(page.body).toHaveLength(2);

    const inverted = await call(
      listTransactions,
      '/api/transactions?dateFrom=2026-07-02T00:00:00.000Z&dateTo=2026-07-01T00:00:00.000Z',
      { token }
    );
    expect(inverted.status).toBe(400);
  });

  it('budgets: PUT is an idempotent upsert and GET derives spend', async () => {
    const { token } = await registerUser();
    const account = await createAccount(token, { initialBalanceCents: 100000 });
    const category = await call(createCategory, '/api/categories', {
      method: 'POST',
      token,
      body: { name: 'Budgeted', kind: 'EXPENSE', color: '#FF0000' },
    });
    const period = currentPeriod();

    const created = await call(setBudget, '/api/budgets', {
      method: 'PUT',
      token,
      body: {
        categoryId: category.body.id,
        period,
        limitCents: 20000,
        currency: 'USD',
      },
    });
    expect(created.status).toBe(200);
    expect(created.body).toMatchObject({
      limitCents: 20000,
      spentCents: 0,
      remainingCents: 20000,
      overBudget: false,
    });

    await call(createTransaction, '/api/transactions', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        categoryId: category.body.id,
        amountCents: 25000,
        currency: 'USD',
        type: 'EXPENSE',
        note: 'Over the limit',
        date: new Date().toISOString(),
      },
    });

    // Same category + period: updates the limit instead of duplicating.
    const upserted = await call(setBudget, '/api/budgets', {
      method: 'PUT',
      token,
      body: {
        categoryId: category.body.id,
        period,
        limitCents: 24000,
        currency: 'USD',
      },
    });
    expect(upserted.status).toBe(200);
    expect(upserted.body.id).toBe(created.body.id);

    const budgets = await call(getBudgets, `/api/budgets?period=${period}`, {
      token,
    });
    expect(budgets.body).toHaveLength(1);
    // Exceeding the budget is flagged, never blocked.
    expect(budgets.body[0]).toMatchObject({
      limitCents: 24000,
      spentCents: 25000,
      remainingCents: -1000,
      overBudget: true,
    });

    const badPeriod = await call(getBudgets, '/api/budgets?period=2026-13', {
      token,
    });
    expect(badPeriod.status).toBe(400);
  });

  it('recurring rules: create, list, currency mismatch rejected', async () => {
    const { token } = await registerUser();
    const account = await createAccount(token);

    const rule = await call(createRule, '/api/recurring-rules', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        amountCents: 1500,
        currency: 'USD',
        type: 'EXPENSE',
        note: 'Subscription',
        interval: 'MONTHLY',
        startDate: utcMidnightDaysAgo(0),
      },
    });
    expect(rule.status).toBe(201);
    expect(rule.body).toMatchObject({
      accountId: account.id,
      amountCents: 1500,
      interval: 'MONTHLY',
    });

    const rules = await call(listRules, '/api/recurring-rules', { token });
    expect(rules.body.map((r: any) => r.id)).toContain(rule.body.id);

    // The rule's currency must match its account's currency.
    const mismatch = await call(createRule, '/api/recurring-rules', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        amountCents: 1500,
        currency: 'EUR',
        type: 'EXPENSE',
        note: 'Wrong currency',
        interval: 'MONTHLY',
        startDate: utcMidnightDaysAgo(0),
      },
    });
    expect(mismatch.status).toBe(400);
  });

  it('reports: net worth, spend by category, income vs expense', async () => {
    const { token } = await registerUser();
    const account = await createAccount(token, { initialBalanceCents: 30000 });
    const category = await call(createCategory, '/api/categories', {
      method: 'POST',
      token,
      body: { name: 'Report Cat', kind: 'EXPENSE', color: '#00FF00' },
    });
    await call(createTransaction, '/api/transactions', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        categoryId: category.body.id,
        amountCents: 4000,
        currency: 'USD',
        type: 'EXPENSE',
        note: 'Reported expense',
        date: new Date().toISOString(),
      },
    });

    const worth = await call(netWorth, '/api/reports/net-worth', { token });
    expect(worth.status).toBe(200);
    expect(worth.body.baseCurrency).toBe('USD');
    expect(worth.body.netWorthCents).toBe(26000);
    expect(worth.body.accounts).toHaveLength(1);
    expect(worth.body.accounts[0]).toMatchObject({
      accountId: account.id,
      balanceCents: 26000,
    });

    const period = currentPeriod();
    const spend = await call(
      spendByCategory,
      `/api/reports/spend-by-category?period=${period}`,
      { token }
    );
    expect(spend.status).toBe(200);
    expect(spend.body.totalSpentCents).toBe(4000);
    expect(spend.body.categories).toEqual([
      {
        categoryId: category.body.id,
        categoryName: 'Report Cat',
        spentCents: 4000,
      },
    ]);

    const series = await call(
      incomeVsExpense,
      `/api/reports/income-vs-expense?from=${period}&to=${period}`,
      { token }
    );
    expect(series.status).toBe(200);
    expect(series.body.points).toHaveLength(1);
    expect(series.body.points[0]).toMatchObject({
      period,
      incomeCents: 30000,
      expenseCents: 4000,
      netCents: 26000,
    });

    // Inverted ranges are rejected.
    const inverted = await call(
      incomeVsExpense,
      '/api/reports/income-vs-expense?from=2026-07&to=2026-01',
      { token }
    );
    expect(inverted.status).toBe(400);

    const badFormat = await call(
      spendByCategory,
      '/api/reports/spend-by-category?period=July-2026',
      { token }
    );
    expect(badFormat.status).toBe(400);
  });
});
