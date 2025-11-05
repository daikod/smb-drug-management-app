/*
  Warnings:

  - Added the required column `userId` to the `Drug` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drug" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Drug_userId_idx" ON "Drug"("userId");

-- AddForeignKey
ALTER TABLE "Drug" ADD CONSTRAINT "Drug_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
