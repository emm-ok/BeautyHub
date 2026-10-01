import { ProductStatus, ProductVerificationStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
export async function getProductKPIs() {
  const [
    totalProducts,
    activeProducts,
    verifiedProducts,
    lowStockProducts,
    outOfStockProducts,
  ] = await Promise.all([
    prisma.product.count(),

    prisma.product.count({
      where: {
        status: ProductStatus.ACTIVE,
      },
    }),

    prisma.product.count({
      where: {
        verificationStatus:
          ProductVerificationStatus.VERIFIED,
      },
    }),

    prisma.product.count({
      where: {
        stockQuantity: {
          gt: 0,
          lte: 5,
        },
      },
    }),

    prisma.product.count({
      where: {
        stockQuantity: 0,
      },
    }),
  ]);

  return {
    totalProducts,
    activeProducts,
    verifiedProducts,
    lowStockProducts,
    outOfStockProducts,
  };
}