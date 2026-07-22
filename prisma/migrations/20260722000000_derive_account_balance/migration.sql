-- Balance is derived from transactions from now on — drop the stored column
-- so it can never drift from the transaction history.
ALTER TABLE "accounts" DROP COLUMN "balance_cents";
