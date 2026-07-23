import { beforeAll, describe, expect, it } from 'vitest';
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
import {
  call,
  createAccount,
  currentPeriod,
  registerUser,
  utcMidnightDaysAgo,
  TestUser,
} from './helpers';

// Every resource is scoped to the authenticated user: identity comes only
// from the Bearer token, and another user's data is indistinguishable from
// data that does not exist (404, never 403).
describe('per-user isolation (integration)', () => {
  let alice: TestUser;
  let bob: TestUser;
  let aliceAccount: any;
  let aliceCategory: any;

  beforeAll(async () => {
    alice = await registerUser();
    bob = await registerUser();

    aliceAccount = await createAccount(alice.token, {
      name: 'Alice checking',
      initialBalanceCents: 50000,
    });

    const category = await call(createCategory, '/api/categories', {
      method: 'POST',
      token: alice.token,
      body: { name: 'Alice groceries', kind: 'EXPENSE', color: '#22C55E' },
    });
    aliceCategory = category.body;

    await call(createTransaction, '/api/transactions', {
      method: 'POST',
      token: alice.token,
      body: {
        accountId: aliceAccount.id,
        categoryId: aliceCategory.id,
        amountCents: 1200,
        currency: 'USD',
        type: 'EXPENSE',
        note: 'Alice expense',
        date: new Date().toISOString(),
      },
    });

    await call(setBudget, '/api/budgets', {
      method: 'PUT',
      token: alice.token,
      body: {
        categoryId: aliceCategory.id,
        period: currentPeriod(),
        limitCents: 10000,
        currency: 'USD',
      },
    });

    await call(createRule, '/api/recurring-rules', {
      method: 'POST',
      token: alice.token,
      body: {
        accountId: aliceAccount.id,
        amountCents: 999,
        currency: 'USD',
        type: 'INCOME',
        note: 'Alice recurring',
        interval: 'DAILY',
        startDate: utcMidnightDaysAgo(1),
      },
    });
  });

  it('never lists another user’s accounts, transactions, budgets or rules', async () => {
    const accounts = await call(listAccounts, '/api/accounts', {
      token: bob.token,
    });
    expect(accounts.body).toEqual([]);

    const transactions = await call(listTransactions, '/api/transactions', {
      token: bob.token,
    });
    expect(transactions.body).toEqual([]);

    const budgets = await call(
      getBudgets,
      `/api/budgets?period=${currentPeriod()}`,
      { token: bob.token }
    );
    expect(budgets.body).toEqual([]);

    const rules = await call(listRules, '/api/recurring-rules', {
      token: bob.token,
    });
    expect(rules.body).toEqual([]);

    const categories = await call(listCategories, '/api/categories', {
      token: bob.token,
    });
    const ids = categories.body.map((c: any) => c.id);
    expect(ids).not.toContain(aliceCategory.id);
  });

  it('treats another user’s resources as not found (404)', async () => {
    const filtered = await call(
      listTransactions,
      `/api/transactions?accountId=${aliceAccount.id}`,
      { token: bob.token }
    );
    expect(filtered.status).toBe(404);

    const postTransaction = await call(createTransaction, '/api/transactions', {
      method: 'POST',
      token: bob.token,
      body: {
        accountId: aliceAccount.id,
        amountCents: 100,
        currency: 'USD',
        type: 'EXPENSE',
        note: 'Cross-user write',
        date: new Date().toISOString(),
      },
    });
    expect(postTransaction.status).toBe(404);

    const patchAccount = await call(
      updateAccount,
      `/api/accounts/${aliceAccount.id}`,
      {
        method: 'PATCH',
        token: bob.token,
        body: { name: 'Hijacked' },
        params: { id: aliceAccount.id },
      }
    );
    expect(patchAccount.status).toBe(404);

    const archive = await call(
      archiveAccount,
      `/api/accounts/${aliceAccount.id}`,
      { method: 'DELETE', token: bob.token, params: { id: aliceAccount.id } }
    );
    expect(archive.status).toBe(404);

    const patchCategory = await call(
      updateCategory,
      `/api/categories/${aliceCategory.id}`,
      {
        method: 'PATCH',
        token: bob.token,
        body: { name: 'Hijacked category' },
        params: { id: aliceCategory.id },
      }
    );
    expect(patchCategory.status).toBe(404);

    const removeCategory = await call(
      deleteCategory,
      `/api/categories/${aliceCategory.id}`,
      { method: 'DELETE', token: bob.token, params: { id: aliceCategory.id } }
    );
    expect(removeCategory.status).toBe(404);

    const budget = await call(setBudget, '/api/budgets', {
      method: 'PUT',
      token: bob.token,
      body: {
        categoryId: aliceCategory.id,
        period: currentPeriod(),
        limitCents: 500,
        currency: 'USD',
      },
    });
    expect(budget.status).toBe(404);

    // Alice's account is untouched by all of the above.
    const aliceAccounts = await call(listAccounts, '/api/accounts', {
      token: alice.token,
    });
    const reloaded = aliceAccounts.body.find(
      (a: any) => a.id === aliceAccount.id
    );
    expect(reloaded).toMatchObject({ name: 'Alice checking', isActive: true });
  });

  it('sweeps only the caller’s recurring rules', async () => {
    const bobSweep = await call(sweep, '/api/recurring-rules/sweep', {
      method: 'POST',
      token: bob.token,
    });
    expect(bobSweep.body).toEqual({ dueCount: 0, createdCount: 0 });

    // Alice's rule was NOT materialized by Bob's sweep.
    const aliceTransactions = await call(
      listTransactions,
      `/api/transactions?accountId=${aliceAccount.id}`,
      { token: alice.token }
    );
    const fromRule = aliceTransactions.body.filter(
      (t: any) => t.recurringRuleId !== null
    );
    expect(fromRule).toHaveLength(0);
  });

  it('scopes reports to the authenticated user', async () => {
    const bobNetWorth = await call(netWorth, '/api/reports/net-worth', {
      token: bob.token,
    });
    expect(bobNetWorth.body.netWorthCents).toBe(0);
    expect(bobNetWorth.body.accounts).toEqual([]);

    const aliceNetWorth = await call(netWorth, '/api/reports/net-worth', {
      token: alice.token,
    });
    expect(aliceNetWorth.body.netWorthCents).toBe(50000 - 1200);

    const bobSpend = await call(
      spendByCategory,
      `/api/reports/spend-by-category?period=${currentPeriod()}`,
      { token: bob.token }
    );
    expect(bobSpend.body.totalSpentCents).toBe(0);
  });

  it('ignores any client-supplied userId: ownership comes from the token', async () => {
    const smuggled = await call(createAccountRoute, '/api/accounts', {
      method: 'POST',
      token: bob.token,
      body: {
        name: 'Bob account',
        type: 'SAVINGS',
        userId: alice.user.id,
      },
    });
    expect(smuggled.status).toBe(201);
    expect(smuggled.body.userId).toBe(bob.user.id);

    const aliceAccounts = await call(listAccounts, '/api/accounts', {
      token: alice.token,
    });
    expect(
      aliceAccounts.body.find((a: any) => a.id === smuggled.body.id)
    ).toBeUndefined();
  });
});
