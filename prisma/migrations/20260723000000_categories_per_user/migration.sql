-- Categories become per-user (required FK) and gain kind + color.
-- Pre-existing rows were global seed data with no owner: they cannot satisfy
-- the new required user_id, so they are removed and re-created by the seed.
-- Referencing rows follow their FK actions (transactions/recurring_rules set
-- category_id NULL, budgets cascade).
DELETE FROM "categories";

-- DropIndex (name was globally unique; it becomes unique per user below)
DROP INDEX "categories_name_key";

-- AlterTable
ALTER TABLE "categories"
ADD COLUMN "user_id" TEXT NOT NULL,
ADD COLUMN "kind" "TransactionType" NOT NULL,
ADD COLUMN "color" VARCHAR(7) NOT NULL;

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_name_key" ON "categories"("user_id", "name");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
