#!/usr/bin/env ts-node

import { readFileSync } from 'fs';
import { join } from 'path';
import { DatabaseClient } from '../src/infrastructure/database/client';

async function runMigrations() {
  console.log('🗄️  Running database migrations...');

  const client = DatabaseClient.getInstance();

  try {
    const migrationsDir = join(
      __dirname,
      '../src/infrastructure/database/migrations'
    );

    const migrations = [
      '001_create_accounts_table.sql',
      '002_create_transactions_table.sql',
    ];

    for (const migration of migrations) {
      console.log(`  Running ${migration}...`);
      const sql = readFileSync(join(migrationsDir, migration), 'utf-8');
      await client.query(sql);
      console.log(`  ✅ ${migration} completed`);
    }

    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await DatabaseClient.disconnect();
  }
}

runMigrations();
