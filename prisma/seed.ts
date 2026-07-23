import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Deterministic ids + upserts keep the seed idempotent: re-running it
// converges to the same state instead of duplicating rows.

const demoUser = {
  id: 'user-demo',
  email: 'demo@ledger.dev',
  name: 'Demo User',
  password: 'Demo1234!',
};

// Categories belong to a user; these mirror the defaults every new user
// gets on registration (see src/domain/services/defaultCategories.ts).
const categories = [
  {
    id: 'cat-salary',
    userId: 'user-demo',
    name: 'Salary',
    kind: 'INCOME' as const,
    color: '#22C55E',
  },
  {
    id: 'cat-groceries',
    userId: 'user-demo',
    name: 'Groceries',
    kind: 'EXPENSE' as const,
    color: '#F59E0B',
  },
  {
    id: 'cat-rent',
    userId: 'user-demo',
    name: 'Rent',
    kind: 'EXPENSE' as const,
    color: '#3B82F6',
  },
  {
    id: 'cat-utilities',
    userId: 'user-demo',
    name: 'Utilities',
    kind: 'EXPENSE' as const,
    color: '#06B6D4',
  },
  {
    id: 'cat-entertainment',
    userId: 'user-demo',
    name: 'Entertainment',
    kind: 'EXPENSE' as const,
    color: '#EC4899',
  },
];

// Balances are never stored — each account's balance derives from its
// transactions below (opening-balance credits included).
const accounts = [
  {
    id: 'acc-demo-checking',
    userId: 'user-demo',
    name: 'Everyday Checking',
    type: 'CHECKING' as const,
    currency: 'USD',
  },
  {
    id: 'acc-demo-savings',
    userId: 'user-demo',
    name: 'Rainy Day Savings',
    type: 'SAVINGS' as const,
    currency: 'USD',
  },
  {
    id: 'acc-demo-eur',
    userId: 'user-demo',
    name: 'Euro Travel Fund',
    type: 'SAVINGS' as const,
    currency: 'EUR',
  },
];

// base_amount_cents is the amount converted into the demo user's base
// currency (USD) at posting time; USD rows convert 1:1, EUR rows use the
// fixed 1 EUR = 1.08 USD rate from FixedExchangeRateProvider.
const transactions = [
  {
    id: 'txn-seed-opening-checking',
    accountId: 'acc-demo-checking',
    categoryId: null,
    amountCents: 250_000, // $2,500.00
    currency: 'USD',
    baseAmountCents: 250_000,
    baseCurrency: 'USD',
    type: 'INCOME' as const,
    note: 'Opening balance',
    date: new Date('2026-06-30T00:00:00.000Z'),
  },
  {
    id: 'txn-seed-opening-savings',
    accountId: 'acc-demo-savings',
    categoryId: null,
    amountCents: 1_000_000, // $10,000.00
    currency: 'USD',
    baseAmountCents: 1_000_000,
    baseCurrency: 'USD',
    type: 'INCOME' as const,
    note: 'Opening balance',
    date: new Date('2026-06-30T00:00:00.000Z'),
  },
  {
    id: 'txn-seed-0001',
    accountId: 'acc-demo-checking',
    categoryId: 'cat-salary',
    amountCents: 350_000,
    currency: 'USD',
    baseAmountCents: 350_000,
    baseCurrency: 'USD',
    type: 'INCOME' as const,
    note: 'Monthly salary',
    date: new Date('2026-07-01T09:00:00.000Z'),
  },
  {
    id: 'txn-seed-0002',
    accountId: 'acc-demo-checking',
    categoryId: 'cat-rent',
    amountCents: 120_000,
    currency: 'USD',
    baseAmountCents: 120_000,
    baseCurrency: 'USD',
    type: 'EXPENSE' as const,
    note: 'July rent',
    date: new Date('2026-07-02T12:00:00.000Z'),
  },
  {
    id: 'txn-seed-0003',
    accountId: 'acc-demo-checking',
    categoryId: 'cat-groceries',
    amountCents: 8_754,
    currency: 'USD',
    baseAmountCents: 8_754,
    baseCurrency: 'USD',
    type: 'EXPENSE' as const,
    note: 'Weekly groceries',
    date: new Date('2026-07-05T17:30:00.000Z'),
  },
  {
    id: 'txn-seed-0004',
    accountId: 'acc-demo-savings',
    categoryId: null,
    amountCents: 50_000,
    currency: 'USD',
    baseAmountCents: 50_000,
    baseCurrency: 'USD',
    type: 'INCOME' as const,
    note: 'Monthly savings transfer',
    date: new Date('2026-07-03T08:00:00.000Z'),
  },
  {
    id: 'txn-seed-eur-opening',
    accountId: 'acc-demo-eur',
    categoryId: null,
    amountCents: 100_000, // €1,000.00
    currency: 'EUR',
    baseAmountCents: 108_000, // $1,080.00 at 1 EUR = 1.08 USD
    baseCurrency: 'USD',
    type: 'INCOME' as const,
    note: 'Opening balance',
    date: new Date('2026-06-30T00:00:00.000Z'),
  },
  {
    id: 'txn-seed-eur-0001',
    accountId: 'acc-demo-eur',
    categoryId: 'cat-entertainment',
    amountCents: 4_500, // €45.00
    currency: 'EUR',
    baseAmountCents: 4_860, // $48.60 at 1 EUR = 1.08 USD
    baseCurrency: 'USD',
    type: 'EXPENSE' as const,
    note: 'Museum tickets',
    date: new Date('2026-07-06T10:00:00.000Z'),
  },
];

async function main(): Promise<void> {
  // The password hash is only computed on create, so re-runs leave the
  // existing row untouched.
  await prisma.user.upsert({
    where: { id: demoUser.id },
    update: { email: demoUser.email, name: demoUser.name },
    create: {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      passwordHash: await bcrypt.hash(demoUser.password, 10),
    },
  });

  for (const category of categories) {
    const { id, ...data } = category;
    await prisma.category.upsert({
      where: { id },
      update: data,
      create: category,
    });
  }

  for (const account of accounts) {
    const { id, ...data } = account;
    await prisma.account.upsert({
      where: { id },
      update: data,
      create: account,
    });
  }

  for (const transaction of transactions) {
    const { id, ...data } = transaction;
    await prisma.transaction.upsert({
      where: { id },
      update: data,
      create: transaction,
    });
  }

  console.log(
    `Seeded 1 user, ${categories.length} categories, ${accounts.length} accounts, ${transactions.length} transactions`
  );
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
