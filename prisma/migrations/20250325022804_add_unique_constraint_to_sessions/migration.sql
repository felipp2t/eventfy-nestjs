/*
  Warnings:

  - A unique constraint covering the columns `[account_id]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_account_id_key" ON "sessions"("account_id");
