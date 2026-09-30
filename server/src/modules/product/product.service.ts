import {
  Prisma,
  ProductStatus,
  ProductVerificationStatus,
  SkinType,
} from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import type {
  CreateProductInput,
  ProductQueryInput,
  UpdateProductInput,
} from "./product.schema.js";
import { calculateSalePrice } from "../../utils/pricing.js";

export async function createProduct(
  data: CreateProductInput
) {
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category || !category.isActive) {
    throw new Error("Category does not exist or is inactive.");
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      slug: data.slug,
    },
  });

  if (existingProduct) {
    throw new Error("A product with this slug already exists.");
  }

  const salePrice = calculateSalePrice({
    price: data.price,
    discountType: data.discountType,
    discountValue: data.discountValue ?? null,
  });

  return prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,

      ...(data.brand !== undefined && { brand: data.brand }),

      categoryId: data.categoryId,

      price: data.price,
      salePrice,

      discountType: data.discountType,
      ...(data.discountValue !== undefined && {
        discountValue: data.discountValue,
      }),

      stockQuantity: data.stockQuantity,
      ...(data.lowStockThreshold !== undefined && {
        lowStockThreshold: data.lowStockThreshold,
      }),

      status: data.status,
      verificationStatus: data.verificationStatus,

      ...(data.howToUse !== undefined && { howToUse: data.howToUse }),
      ...(data.keyIngredients !== undefined && {
        keyIngredients: data.keyIngredients,
      }),
      ...(data.benefits !== undefined && { benefits: data.benefits }),
      ...(data.suitabilityNotes !== undefined && {
        suitabilityNotes: data.suitabilityNotes,
      }),
      ...(data.warnings !== undefined && { warnings: data.warnings }),

      ...(data.size !== undefined && { size: data.size }),
      ...(data.unit !== undefined && { unit: data.unit }),
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}


export async function getProducts(
  filters: ProductQueryInput
) {
  const {
    search,
    categoryId,
    category,
    status,
    verificationStatus,
    minPrice,
    maxPrice,
    inStock,
    page,
    limit,
    sortBy,
    sortOrder,
  } = filters;

  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        brand: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (category) {
    where.category = {
      name: category,
    };
  }

  if (status) {
    where.status = status;
  }

  if (verificationStatus) {
    where.verificationStatus = verificationStatus;
  }

  if (
    minPrice !== undefined ||
    maxPrice !== undefined
  ) {
    where.salePrice = {
      ...(minPrice !== undefined
        ? {
          gte: minPrice,
        }
        : {}),

      ...(maxPrice !== undefined
        ? {
          lte: maxPrice,
        }
        : {}),
    };
  }

  if (inStock !== undefined) {
    where.stockQuantity = inStock
      ? { gt: 0 }
      : { equals: 0 };
  }

  const skip = (page - 1) * limit;

  const orderBy = {
    [sortBy]: sortOrder,
  } as Prisma.ProductOrderByWithRelationInput;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,

      orderBy,

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

          orderBy: [
            {
              isPrimary: "desc",
            },
            {
              sortOrder: "asc",
            },
          ],

          take: 1,
        },
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

      hasNextPage:
        page * limit < total,

      hasPreviousPage:
        page > 1,
    },
  };
}


export async function getProductById(
  id: string
) {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      },

      images: {
        select: {
          id: true,
          url: true,
          altText: true,
        },

        orderBy: [
          {
            isPrimary: "desc",
          },
          {
            sortOrder: "asc",
          },
        ],
      },
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  return product;
}


export async function updateProduct(
  id: string,
  data: UpdateProductInput
) {
  const existingProduct =
    await prisma.product.findUnique({
      where: {
        id,
      },
    });

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  if (data.slug && data.slug !== existingProduct.slug) {
    const slugExists =
      await prisma.product.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (slugExists) {
      throw new Error(
        "A product with this slug already exists."
      );
    }
  }

  if (data.categoryId) {
    const category =
      await prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

    if (!category || !category.isActive) {
      throw new Error(
        "Category does not exist or is inactive."
      );
    }
  }

  const price =
    data.price ?? existingProduct.price;

  const discountType =
    data.discountType ??
    existingProduct.discountType;

  const discountValue =
    data.discountValue !== undefined
      ? data.discountValue
      : existingProduct.discountValue;

  const pricingChanged =
    data.price !== undefined ||
    data.discountType !== undefined ||
    data.discountValue !== undefined;

  let salePrice = existingProduct.salePrice;

  if (pricingChanged) {
    salePrice = calculateSalePrice({
      price,
      discountType,
      discountValue,
    });
  }

  return prisma.product.update({
    where: {
      id,
    },

    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.slug !== undefined && {
        slug: data.slug,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.brand !== undefined && {
        brand: data.brand,
      }),

      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId,
      }),

      ...(data.price !== undefined && {
        price: data.price,
      }),

      ...(data.discountType !== undefined && {
        discountType: data.discountType,
      }),

      ...(data.discountValue !== undefined && {
        discountValue: data.discountValue,
      }),

      ...(pricingChanged && {
        salePrice,
      }),

      ...(data.stockQuantity !== undefined && {
        stockQuantity: data.stockQuantity,
      }),

      ...(data.lowStockThreshold !== undefined && {
        lowStockThreshold:
          data.lowStockThreshold,
      }),

      ...(data.status !== undefined && {
        status: data.status,
      }),

      ...(data.verificationStatus !== undefined && {
        verificationStatus:
          data.verificationStatus,
      }),

      ...(data.howToUse !== undefined && {
        howToUse: data.howToUse,
      }),

      ...(data.keyIngredients !== undefined && {
        keyIngredients: data.keyIngredients,
      }),

      ...(data.benefits !== undefined && {
        benefits: data.benefits,
      }),

      ...(data.suitabilityNotes !== undefined && {
        suitabilityNotes:
          data.suitabilityNotes,
      }),

      ...(data.warnings !== undefined && {
        warnings: data.warnings,
      }),

      ...(data.size !== undefined && {
        size: data.size,
      }),

      ...(data.unit !== undefined && {
        unit: data.unit,
      }),
    },

    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}


export async function deleteProduct(
  id: string
) {
  const existingProduct =
    await prisma.product.findUnique({
      where: {
        id,
      },
    });

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new Error(
        "This product cannot be deleted because it is referenced by existing records."
      );
    }

    throw error;
  }

  return {
    id,
    message: "Product deleted successfully.",
  };
}

const DEFAULT_RECOMMENDATION_LIMIT = 6;
const MAX_CANDIDATE_POOL = 30;

type RelatedProductsOptions = {
  limit?: number;
};

type RecommendationProduct = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    brand: true;
    price: true;
    salePrice: true;
    verificationStatus: true;
    categoryId: true;
    skinTypes: true;
    concerns: true;
    stockQuantity: true;
    category: {
      select: {
        id: true;
        name: true;
      };
    };
    images: {
      select: {
        id: true;
        url: true;
        altText: true;
        isPrimary: true;
        sortOrder: true;
      };
    };
  };
}>;

function getSharedValues<T>(
  first: T[],
  second: T[],
): T[] {
  return first.filter((value) => second.includes(value));
}

function calculateSkinTypeScore(
  current: SkinType[],
  candidate: SkinType[],
): number {
  if (
    current.includes(SkinType.ALL) ||
    candidate.includes(SkinType.ALL)
  ) {
    return 20;
  }

  return getSharedValues(current, candidate).length > 0
    ? 20
    : 0;
}

function calculatePriceScore(
  currentPrice: Prisma.Decimal,
  candidatePrice: Prisma.Decimal,
): number {
  const current = Number(currentPrice);
  const candidate = Number(candidatePrice);

  if (current <= 0 || candidate <= 0) {
    return 0;
  }

  const difference =
    Math.abs(candidate - current) / current;

  if (difference <= 0.2) {
    return 5;
  }

  if (difference <= 0.4) {
    return 3;
  }

  if (difference <= 0.6) {
    return 1;
  }

  return 0;
}

function calculateScore(
  currentProduct: RecommendationProduct,
  candidate: RecommendationProduct,
): number {
  let score = 0;

  const sharedConcerns = getSharedValues(
    currentProduct.concerns,
    candidate.concerns,
  );

  score += sharedConcerns.length * 40;

  if (
    currentProduct.categoryId ===
    candidate.categoryId
  ) {
    score += 25;
  }

  score += calculateSkinTypeScore(
    currentProduct.skinTypes,
    candidate.skinTypes,
  );

  if (
    candidate.verificationStatus ===
    ProductVerificationStatus.VERIFIED
  ) {
    score += 10;
  }

  if (candidate.stockQuantity > 0) {
    score += 10;
  }

  score += calculatePriceScore(
    currentProduct.salePrice,
    candidate.salePrice,
  );

  return score;
}

export async function getRelatedProducts(
  productId: string,
  options: RelatedProductsOptions = {},
) {
  const limit = Math.min(
    options.limit ?? DEFAULT_RECOMMENDATION_LIMIT,
    12,
  );

  const currentProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },

    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
      categoryId: true,
      skinTypes: true,
      concerns: true,

      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!currentProduct) {
    return null;
  }

  const candidates = await prisma.product.findMany({
    where: {
      id: {
        not: productId,
      },

      status: "ACTIVE",

      stockQuantity: {
        gt: 0,
      },

      OR: [
        {
          categoryId: currentProduct.categoryId,
        },

        ...(currentProduct.concerns.length > 0
          ? [
              {
                concerns: {
                  hasSome: currentProduct.concerns,
                },
              },
            ]
          : []),

        ...(currentProduct.skinTypes.length > 0
          ? [
              {
                skinTypes: {
                  hasSome: currentProduct.skinTypes,
                },
              },
            ]
          : []),
      ],
    },

    select: {
      id: true,
      name: true,
      slug: true,
      brand: true,
      price: true,
      salePrice: true,
      verificationStatus: true,
      categoryId: true,
      skinTypes: true,
      concerns: true,
      stockQuantity: true,

      category: {
        select: {
          id: true,
          name: true,
        },
      },

      images: {
        select: {
          id: true,
          url: true,
          altText: true,
          isPrimary: true,
          sortOrder: true,
        },

        orderBy: [
          {
            isPrimary: "desc",
          },
          {
            sortOrder: "asc",
          },
        ],

        take: 1,
      },
    },

    take: MAX_CANDIDATE_POOL,
  });

  const rankedProducts = candidates
    .map((candidate) => ({
      candidate,
      score: calculateScore(
        currentProduct as RecommendationProduct,
        candidate,
      ),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const aVerified =
        a.candidate.verificationStatus ===
        ProductVerificationStatus.VERIFIED;

      const bVerified =
        b.candidate.verificationStatus ===
        ProductVerificationStatus.VERIFIED;

      if (aVerified !== bVerified) {
        return Number(bVerified) - Number(aVerified);
      }

      return a.candidate.name.localeCompare(
        b.candidate.name,
      );
    })
    .slice(0, limit);

  return rankedProducts.map(
    ({ candidate }) => candidate,
  );
}