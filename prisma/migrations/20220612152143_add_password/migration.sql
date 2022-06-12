/*
  Warnings:

  - You are about to drop the column `HashedRefreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "HashedRefreshToken",
ADD COLUMN     "hashedPassword" TEXT,
ADD COLUMN     "hashedRefreshToken" TEXT;
