import { z } from "zod";

export const productFormSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2, "Product name is required."),

    slug: z
      .string()
      .trim()
      .min(2, "Slug is required.")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers and hyphens.",
      ),

    description: z
      .string()
      .trim()
      .min(
        20,
        "Description should contain at least 20 characters.",
      ),

    brand: z
      .string()
      .trim()
      .optional(),

    categoryId: z
      .string()
      .min(
        1,
        "Select a product category.",
      ),

    price: z
      .number()
      .positive(
        "Price must be greater than zero.",
      ),

    discountType: z.enum([
      "NONE",
      "PERCENTAGE",
      "FIXED_AMOUNT",
    ]),

    discountValue: z
      .number()
      .min(0)
      .optional(),

    stockQuantity: z
      .number()
      .int()
      .min(0),

    lowStockThreshold: z
      .number()
      .int()
      .min(0),

    howToUse: z.string().optional(),

    keyIngredients: z.string().optional(),

    benefits: z.string().optional(),

    suitabilityNotes:
      z.string().optional(),

    warnings: z.string().optional(),

    skinTypes: z.array(
      z.enum([
        "NORMAL",
        "DRY",
        "OILY",
        "COMBINATION",
        "SENSITIVE",
        "ALL",
        "UNKNOWN",
      ]),
    ),

    concerns: z.array(
      z.enum([
        "ACNE_PRONE",
        "DARK_SPOTS",
        "UNEVEN_SKIN_TONE",
        "DRYNESS",
        "OILY_SKIN",
        "SENSITIVE_SKIN",
        "ROUGH_SKIN",
        "BUMPY_SKIN",
        "BODY_ACNE",
        "ANTI_AGING",
        "GENERAL_SKINCARE",
        "GENERAL_BODY_CARE",
      ]),
    ),

    status: z.enum([
      "ACTIVE",
      "INACTIVE",
      "OUT_OF_STOCK",
    ]),

    verificationStatus: z.enum([
      "VERIFIED",
      "NOT_VERIFIED",
    ]),
  })
  .superRefine((data, ctx) => {
    if (
      data.discountType !== "NONE" &&
      (!data.discountValue ||
        data.discountValue <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message:
          "Discount value is required.",
      });
    }

    if (
      data.discountType === "PERCENTAGE" &&
      data.discountValue !== undefined &&
      data.discountValue > 100
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message:
          "Percentage discount cannot exceed 100%.",
      });
    }

    if (
      data.discountType ===
        "FIXED_AMOUNT" &&
      data.discountValue !== undefined &&
      data.discountValue >= data.price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message:
          "Fixed discount must be less than the product price.",
      });
    }
  });

export type ProductFormValues =
  z.infer<typeof productFormSchema>;