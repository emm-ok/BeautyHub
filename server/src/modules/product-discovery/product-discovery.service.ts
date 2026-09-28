import { Prisma, ProductVerificationStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import type { ProductDiscoveryInput } from "./product-discovery.schema.js";

export async function discoverProducts(
  filters: ProductDiscoveryInput
) {
  const {
    concerns,
    skinType,
    category,
    maxBudget,
    // verifiedOnly,
    inStockOnly,
    page,
    limit,
  } = filters;

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    verificationStatus: "VERIFIED",

    category: {
      isActive: true,
    },
  };

  // Category
  if (category) {
    where.category = {
      isActive: true,
      name: category,
    };
  }

  // Customer budget
  if (maxBudget !== undefined) {
    where.salePrice = {
      lte: maxBudget,
    };
  }

  // Stock
  if (inStockOnly) {
    where.stockQuantity = {
      gt: 0,
    };
  }

  // // Verification
  // if (verifiedOnly) {
  //   where.verificationStatus =
  //     ProductVerificationStatus.VERIFIED;
  // }

  // Skin type
  if (skinType) {
    where.skinTypes = {
      hasSome: [skinType, "ALL"],
    };
  }

  // Product concerns
  if (concerns && concerns.length > 0) {
    where.concerns = {
      hasSome: concerns,
    };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,

      skip,
      take: limit,

      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        images: {
          select: {
            id: true,
            url: true,
            altText: true,
          },

          orderBy: {
            createdAt: "asc",
          },

          take: 1,
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
}