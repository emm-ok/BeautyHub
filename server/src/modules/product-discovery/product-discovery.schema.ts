import { z } from "zod";
import {
  ProductCategory,
  ProductConcern,
  SkinType,
} from "@prisma/client";

export const productDiscoverySchema = z.object({
  concerns: z
    .array(z.enum(ProductConcern))
    .max(5)
    .optional()
    .default([]),

  skinType: z.enum(SkinType).optional(),

  category: z.enum(ProductCategory).optional(),

  maxBudget: z
    .number()
    .positive()
    .optional(),

  // verifiedOnly: z
  //   .boolean()
  //   .optional()
  //   .default(true),

  inStockOnly: z
    .boolean()
    .optional()
    .default(true),

  page: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1),

  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .default(12),
});

export type ProductDiscoveryInput = z.infer<
  typeof productDiscoverySchema
>;