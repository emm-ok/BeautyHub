import { z } from "zod";

import {
  DiscountType,
  ProductCategory,
  ProductStatus,
  ProductVerificationStatus,
} from "@prisma/client";

const optionalString = z
  .string()
  .trim()
  .optional()
  .nullable();

export const createProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters."),

    slug: z
      .string()
      .trim()
      .min(2, "Product slug is required."),

    description: z
      .string()
      .trim()
      .min(10, "Product description must be at least 10 characters."),

    brand: optionalString,

    categoryId: z
      .string()
      .uuid("Invalid category ID."),

    price: z
      .number()
      .positive("Price must be greater than zero."),

    discountType: z
      .nativeEnum(DiscountType)
      .default(DiscountType.NONE),

    discountValue: z
      .number()
      .positive("Discount value must be greater than zero.")
      .nullable()
      .optional(),

    stockQuantity: z
      .number()
      .int()
      .min(0)
      .default(0),

    lowStockThreshold: z
      .number()
      .int()
      .min(0)
      .default(5),

    status: z
      .nativeEnum(ProductStatus)
      .default(ProductStatus.ACTIVE),

    verificationStatus: z
      .nativeEnum(ProductVerificationStatus)
      .default(ProductVerificationStatus.NOT_VERIFIED),

    howToUse: optionalString,

    keyIngredients: optionalString,

    benefits: optionalString,

    suitabilityNotes: optionalString,

    warnings: optionalString,

    size: optionalString,

    unit: optionalString,
  })
  .superRefine((data, ctx) => {
    if (data.discountType === DiscountType.NONE) {
      if (
        data.discountValue !== null &&
        data.discountValue !== undefined
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["discountValue"],
          message:
            "Discount value must be empty when discount type is NONE.",
        });
      }

      return;
    }

    if (
      data.discountValue === null ||
      data.discountValue === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message:
          "Discount value is required when a discount is applied.",
      });

      return;
    }

    if (
      data.discountType === DiscountType.PERCENTAGE &&
      data.discountValue > 100
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%.",
      });
    }

    if (
      data.discountType === DiscountType.FIXED_AMOUNT &&
      data.discountValue >= data.price
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["discountValue"],
        message:
          "Fixed discount must be less than the product price.",
      });
    }
  });

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional(),

  categoryId: z
    .string()
    .uuid()
    .optional(),

  category: z
    .nativeEnum(ProductCategory)
    .optional(),

  status: z
    .nativeEnum(ProductStatus)
    .optional(),

  verificationStatus: z
    .nativeEnum(ProductVerificationStatus)
    .optional(),

  minPrice: z
    .coerce
    .number()
    .nonnegative()
    .optional(),

  maxPrice: z
    .coerce
    .number()
    .nonnegative()
    .optional(),

  inStock: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  page: z
    .coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .default(12),

  sortBy: z
    .enum(["createdAt", "name", "price", "salePrice"])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type CreateProductInput = z.infer<
  typeof createProductSchema
>;

export type UpdateProductInput = z.infer<
  typeof updateProductSchema
>;

export type ProductQueryInput = z.infer<
  typeof productQuerySchema
>;