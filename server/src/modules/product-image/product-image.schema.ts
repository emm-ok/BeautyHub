import { z } from "zod";

export const reorderProductImagesSchema =
  z.object({
    imageIds: z
      .array(z.string().uuid())
      .min(1)
      .max(20),
  });

export const updateProductImageSchema =
  z.object({
    altText: z
      .string()
      .trim()
      .max(200)
      .nullable()
      .optional(),
  });