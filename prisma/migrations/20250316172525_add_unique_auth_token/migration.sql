/*
  Warnings:

  - A unique constraint covering the columns `[user_id,provider_id]` on the table `AuthToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_user_id_provider_id_key" ON "AuthToken"("user_id", "provider_id");
