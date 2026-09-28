/*
  Warnings:

  - Added the required column `salePrice` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "salePrice" DECIMAL(12,2) NOT NULL;

-- CreateIndex
CREATE INDEX "products_salePrice_idx" ON "products"("salePrice");
