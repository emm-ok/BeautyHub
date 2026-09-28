import { z } from "zod";
import { DiscountType } from "@prisma/client";

export const productPricingSchema = z
  .object({
    price: z.number().positive(),

    salePrice: z.number().positive(),

    discountType: z
      .nativeEnum(DiscountType)
      .default(DiscountType.NONE),

    discountValue: z
      .number()
      .positive()
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Sale price cannot be greater than original price
    if (data.salePrice > data.price) {
      ctx.addIssue({
        code: "custom",
        path: ["salePrice"],
        message: "Sale price cannot be greater than the original price.",
      });
    }

    // No discount
    if (data.discountType === DiscountType.NONE) {
      if (data.salePrice !== data.price) {
        ctx.addIssue({
          code: "custom",
          path: ["salePrice"],
          message:
            "Sale price must equal the original price when there is no discount.",
        });
      }

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

    // Discount exists but no value was supplied
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

    // Percentage discount
    if (data.discountType === DiscountType.PERCENTAGE) {
      if (data.discountValue > 100) {
        ctx.addIssue({
          code: "custom",
          path: ["discountValue"],
          message: "Percentage discount cannot exceed 100%.",
        });
      }
    }

    // Fixed discount
    if (data.discountType === DiscountType.FIXED_AMOUNT) {
      if (data.discountValue >= data.price) {
        ctx.addIssue({
          code: "custom",
          path: ["discountValue"],
          message:
            "Fixed discount must be less than the original price.",
        });
      }
    }
  });