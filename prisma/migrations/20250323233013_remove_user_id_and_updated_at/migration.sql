/*
  Warnings:

  - You are about to drop the column `updated_at` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "updated_at",
DROP COLUMN "user_id";
