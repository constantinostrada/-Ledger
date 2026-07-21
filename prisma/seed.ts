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

const categories = [
  { id: 'cat-salary', name: 'Salary' },
  { id: 'cat-groceries', name: 'Groceries' },
  { id: 'cat-rent', name: 'Rent' },
  { id: 'cat-utilities', name: 'Utilities' },
  { id: 'cat-entertainment', name: 'Entertainment' },
];

const accounts = [
  {
    id: 'acc-demo-checking',
    userId: 'user-demo',
    name: 'Everyday Checking',
    type: 'CHECKING' as const,
    balanceCents: 250_000, // $2,500.00
    currency: 'USD',
  },
  {
    id: 'acc-demo-savings',
    userId: 'user-demo',
    name: 'Rainy Day Savings',
    type: 'SAVINGS' as const,
    balanceCents: 1_000_000, // $10,000.00
    currency: 'USD',
  },
];

const transactions = [
  {
    id: 'txn-seed-0001',
    accountId: 'acc-demo-checking',
    categoryId: 'cat-salary',
    amountCents: 350_000,
    currency: 'USD',
    type: 'CREDIT' as const,
    description: 'Monthly salary',
    date: new Date('2026-07-01T09:00:00.000Z'),
  },
  {
    id: 'txn-seed-0002',
    accountId: 'acc-demo-checking',
    categoryId: 'cat-rent',
    amountCents: 120_000,
    currency: 'USD',
    type: 'DEBIT' as const,
    description: 'July rent',
    date: new Date('2026-07-02T12:00:00.000Z'),
  },
  {
    id: 'txn-seed-0003',
    accountId: 'acc-demo-checking',
    categoryId: 'cat-groceries',
    amountCents: 8_754,
    currency: 'USD',
    type: 'DEBIT' as const,
    description: 'Weekly groceries',
    date: new Date('2026-07-05T17:30:00.000Z'),
  },
  {
    id: 'txn-seed-0004',
    accountId: 'acc-demo-savings',
    categoryId: null,
    amountCents: 50_000,
    currency: 'USD',
    type: 'CREDIT' as const,
    description: 'Monthly savings transfer',
    date: new Date('2026-07-03T08:00:00.000Z'),
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
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
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
