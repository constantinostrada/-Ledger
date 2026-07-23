---
id: 0ef0ec18-16a0-4951-86fc-580737724633
type: architecture
title: Derived-balance & budget architecture
tags: [architecture]
created: 2026-07-23
resource: prisma/schema.prisma, PrismaAccountRepository.ts, PrismaTransactionRepository.ts, SetBudgetUseCase.ts, GetBudgetsUseCase.ts, CreateAccountUseCase.ts, src/app/api/budgets/route.ts, Account.ts, Budget.ts, Transaction.ts, Category.ts, migration 20260722000000_derive_account_balance, migration 20260722221457_add_budgets
---
Derived-balance & budget architecture: no stored balances or spent totals

## Why
Eliminates drift by making the transaction ledger the single source of truth for all monetary aggregates

## Learned
Account.balance_cents column dropped; balance computed as credits−debits via Prisma groupBy aggregate over transactions in PrismaAccountRepository · Domain Account.balance is a hydrated read-only snapshot from the repository; canDebit checks run against this derived value · initialBalanceCents materialized as an 'Opening balance' CREDIT transaction on account creation, not a stored field · budgets table has no spent_cents column; spent computed on-the-fly from period transactions via PrismaTransactionRepository.sumExpensesByCategory · budgets table stores limit_cents (Int) and period (Char(7) 'YYYY-MM') with unique constraint on (userId, categoryId, period) for exactly one limit per category per month · Budget entity enforces positive limitCents invariant in constructor/create() · Transaction entity enforces positive-amount invariant in create()/reconstitute() and now carries optional categoryId with SetNull FK on category delete · All monetary fields stored as Int cents columns (balance_cents, amount_cents); DTOs use explicit *Cents names with zod .int() validation; floats rejected at HTTP edge and domain layer · Setting a budget is idempotent upsert (PUT /api/budgets, 200) on category+period; re-setting updates existing row · PUT chosen over POST to signal idempotent set-semantics for category+period upsert · SetBudgetUseCase checks category existence via ICategoryRepository before upserting, returning 404 for nonexistent categories · GetBudgetsUseCase computes spent for all budgets in a period with single batched sumExpensesByCategory call (all categoryIds at once), avoiding N+1 queries · ITransactionRepository extended with sumExpensesByCategory(userId, categoryIds, dateFrom, dateToExclusive) as single Prisma groupBy aggregate over EXPENSE transactions · sumExpensesByCategory enforces ownership through account→user relation in Prisma query itself, preventing cross-user category leakage · Category is a new domain entity (added in B1) with ICategoryRepository port and PrismaCategoryRepository implementation alongside pre-existing Account/Transaction ports · Posting an expense that would make balance negative rejected with 'Insufficient funds for expense transaction'; balance updates immediately on transaction posting

## Where
prisma/schema.prisma, PrismaAccountRepository.ts, PrismaTransactionRepository.ts, SetBudgetUseCase.ts, GetBudgetsUseCase.ts, CreateAccountUseCase.ts, src/app/api/budgets/route.ts, Account.ts, Budget.ts, Transaction.ts, Category.ts, migration 20260722000000_derive_account_balance, migration 20260722221457_add_budgets
