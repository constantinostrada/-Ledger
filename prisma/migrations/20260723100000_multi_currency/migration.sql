-- Users gain a base currency; transactions snapshot their value converted
-- into it (integer cents) at posting time.

-- AlterTable
ALTER TABLE "users" ADD COLUMN "base_currency" CHAR(3) NOT NULL DEFAULT 'USD';

-- AlterTable: added nullable first so existing rows can be backfilled.
ALTER TABLE "transactions"
ADD COLUMN "base_amount_cents" INTEGER,
ADD COLUMN "base_currency" CHAR(3) NOT NULL DEFAULT 'USD';

-- Backfill: all pre-existing data is USD and every user's base is USD,
-- so the base value equals the original amount.
UPDATE "transactions" SET "base_amount_cents" = "amount_cents";

ALTER TABLE "transactions" ALTER COLUMN "base_amount_cents" SET NOT NULL;
