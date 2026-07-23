import { describe, expect, it } from 'vitest';
import { randomUUID } from 'crypto';
import { GET as listAccounts } from '@/app/api/accounts/route';
import { POST as createRule } from '@/app/api/recurring-rules/route';
import { POST as sweep } from '@/app/api/recurring-rules/sweep/route';
import { GET as listTransactions } from '@/app/api/transactions/route';
import { prisma } from '@infrastructure/database/prisma';
import {
  call,
  createAccount,
  registerUser,
  utcMidnightDaysAgo,
} from './helpers';

// The recurring sweep is idempotent by construction: a DB-level unique
// constraint on (recurring_rule_id, date) makes re-runs skip already
// materialized occurrences instead of double-posting them.
describe('recurring transactions idempotency (integration)', () => {
  it('materializes each due occurrence exactly once across repeated sweeps', async () => {
    const { token } = await registerUser();
    const account = await createAccount(token);

    const rule = await call(createRule, '/api/recurring-rules', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        amountCents: 2500,
        currency: 'USD',
        type: 'INCOME',
        note: 'Daily payout',
        interval: 'DAILY',
        startDate: utcMidnightDaysAgo(2),
      },
    });
    expect(rule.status).toBe(201);

    // First sweep: start date, yesterday and today are due → 3 inserts.
    const first = await call(sweep, '/api/recurring-rules/sweep', {
      method: 'POST',
      token,
    });
    expect(first.status).toBe(200);
    expect(first.body).toEqual({ dueCount: 3, createdCount: 3 });

    const afterFirst = await call(
      listTransactions,
      `/api/transactions?accountId=${account.id}`,
      { token }
    );
    expect(afterFirst.body).toHaveLength(3);
    for (const transaction of afterFirst.body) {
      expect(transaction.recurringRuleId).toBe(rule.body.id);
      expect(transaction.amountCents).toBe(2500);
    }

    // Second sweep: same occurrences are due, none may be re-posted.
    const second = await call(sweep, '/api/recurring-rules/sweep', {
      method: 'POST',
      token,
    });
    expect(second.status).toBe(200);
    expect(second.body).toEqual({ dueCount: 3, createdCount: 0 });

    const afterSecond = await call(
      listTransactions,
      `/api/transactions?accountId=${account.id}`,
      { token }
    );
    expect(afterSecond.body).toHaveLength(3);

    // The derived balance also proves nothing double-posted: 3 × 2500.
    const accounts = await call(listAccounts, '/api/accounts', { token });
    const reloaded = accounts.body.find((a: any) => a.id === account.id);
    expect(reloaded.balanceCents).toBe(7500);
  });

  it('only materializes the delta when a new rule appears between sweeps', async () => {
    const { token } = await registerUser();
    const account = await createAccount(token);

    const daily = await call(createRule, '/api/recurring-rules', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        amountCents: 1000,
        currency: 'USD',
        type: 'INCOME',
        note: 'Daily',
        interval: 'DAILY',
        startDate: utcMidnightDaysAgo(2),
      },
    });
    expect(daily.status).toBe(201);

    const first = await call(sweep, '/api/recurring-rules/sweep', {
      method: 'POST',
      token,
    });
    expect(first.body).toEqual({ dueCount: 3, createdCount: 3 });

    const weekly = await call(createRule, '/api/recurring-rules', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        amountCents: 5000,
        currency: 'USD',
        type: 'INCOME',
        note: 'Weekly',
        interval: 'WEEKLY',
        startDate: utcMidnightDaysAgo(8),
      },
    });
    expect(weekly.status).toBe(201);

    // 3 daily occurrences already exist; the weekly rule adds 2 (day -8, -1).
    const second = await call(sweep, '/api/recurring-rules/sweep', {
      method: 'POST',
      token,
    });
    expect(second.body).toEqual({ dueCount: 5, createdCount: 2 });

    const transactions = await call(
      listTransactions,
      `/api/transactions?accountId=${account.id}`,
      { token }
    );
    expect(transactions.body).toHaveLength(5);
  });

  it('is backed by a database unique constraint on (rule, due date)', async () => {
    const { token } = await registerUser();
    const account = await createAccount(token);

    const rule = await call(createRule, '/api/recurring-rules', {
      method: 'POST',
      token,
      body: {
        accountId: account.id,
        amountCents: 750,
        currency: 'USD',
        type: 'INCOME',
        note: 'Guarded',
        interval: 'DAILY',
        startDate: utcMidnightDaysAgo(0),
      },
    });
    await call(sweep, '/api/recurring-rules/sweep', { method: 'POST', token });

    const materialized = await prisma.transaction.findFirstOrThrow({
      where: { recurringRuleId: rule.body.id },
    });

    // Even a direct insert bypassing the application layer cannot
    // double-post an occurrence: Postgres rejects the duplicate.
    await expect(
      prisma.transaction.create({
        data: {
          id: randomUUID(),
          accountId: materialized.accountId,
          recurringRuleId: materialized.recurringRuleId,
          amountCents: materialized.amountCents,
          currency: materialized.currency,
          baseAmountCents: materialized.baseAmountCents,
          baseCurrency: materialized.baseCurrency,
          type: materialized.type,
          note: materialized.note,
          date: materialized.date,
        },
      })
    ).rejects.toMatchObject({ code: 'P2002' });
  });
});
