/*
  Warnings:

  - The values [ACNE,OILINESS] on the enum `ProductConcern` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `name` on the `categories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('CLEANSER', 'SERUM', 'MOISTURISER', 'SUNSCREEN', 'TONER', 'BODY_CARE');

-- AlterEnum
BEGIN;
CREATE TYPE "ProductConcern_new" AS ENUM ('ACNE_PRONE', 'DARK_SPOTS', 'UNEVEN_SKIN_TONE', 'DRYNESS', 'OILY_SKIN', 'SENSITIVE_SKIN', 'ROUGH_SKIN', 'BUMPY_SKIN', 'BODY_ACNE', 'ANTI_AGING', 'GENERAL_SKINCARE', 'GENERAL_BODY_CARE');
ALTER TABLE "products" ALTER COLUMN "concerns" TYPE "ProductConcern_new"[] USING ("concerns"::text::"ProductConcern_new"[]);
ALTER TYPE "ProductConcern" RENAME TO "ProductConcern_old";
ALTER TYPE "ProductConcern_new" RENAME TO "ProductConcern";
DROP TYPE "public"."ProductConcern_old";
COMMIT;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "name",
ADD COLUMN     "name" "ProductCategory" NOT NULL;
