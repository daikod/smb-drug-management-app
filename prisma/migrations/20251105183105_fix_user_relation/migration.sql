-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DrugCategory" ADD VALUE 'ANTIHISTAMINE';
ALTER TYPE "DrugCategory" ADD VALUE 'ANTIHYPERTENSIVE';
ALTER TYPE "DrugCategory" ADD VALUE 'ANTIDIABETIC';
ALTER TYPE "DrugCategory" ADD VALUE 'ANTICOAGULANT';
ALTER TYPE "DrugCategory" ADD VALUE 'ANTIDEPRESSANT';
ALTER TYPE "DrugCategory" ADD VALUE 'ANTIPSYCHOTIC';
ALTER TYPE "DrugCategory" ADD VALUE 'ANXIOLYTIC';
ALTER TYPE "DrugCategory" ADD VALUE 'SEDATIVE';
ALTER TYPE "DrugCategory" ADD VALUE 'MUSCLE_RELAXANT';
ALTER TYPE "DrugCategory" ADD VALUE 'OPHTHALMIC';
ALTER TYPE "DrugCategory" ADD VALUE 'OTIC';
ALTER TYPE "DrugCategory" ADD VALUE 'CONTRACEPTIVE';
ALTER TYPE "DrugCategory" ADD VALUE 'HORMONE_THERAPY';
ALTER TYPE "DrugCategory" ADD VALUE 'ANTIEMETIC';
ALTER TYPE "DrugCategory" ADD VALUE 'LAXATIVE';
ALTER TYPE "DrugCategory" ADD VALUE 'ANTACID';
ALTER TYPE "DrugCategory" ADD VALUE 'DIURETIC';
ALTER TYPE "DrugCategory" ADD VALUE 'BRONCHODILATOR';
ALTER TYPE "DrugCategory" ADD VALUE 'ANTIPARASITIC';
ALTER TYPE "DrugCategory" ADD VALUE 'CHEMOTHERAPY';
