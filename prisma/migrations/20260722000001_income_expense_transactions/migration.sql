-- Rename transaction vocabulary to the board's ubiquitous language:
-- CREDIT/DEBIT become INCOME/EXPENSE, description becomes note.
ALTER TYPE "TransactionType" RENAME VALUE 'CREDIT' TO 'INCOME';
ALTER TYPE "TransactionType" RENAME VALUE 'DEBIT' TO 'EXPENSE';
ALTER TABLE "transactions" RENAME COLUMN "description" TO "note";
