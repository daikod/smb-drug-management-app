/*
  Warnings:

  - Added the required column `expiryDate` to the `Drug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityAvailable` to the `Drug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier` to the `Drug` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Drug` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drug" ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "quantityAvailable" INTEGER NOT NULL,
ADD COLUMN     "supplier" TEXT NOT NULL,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL;
