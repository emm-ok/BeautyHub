import type { Request, Response } from "express";

import { productDiscoverySchema } from "./product-discovery.schema.js";
import { discoverProducts } from "./product-discovery.service.js";

export async function productDiscoveryController(
  req: Request,
  res: Response
) {
  try {
    const filters = productDiscoverySchema.safeParse(req.body);

    if (!filters.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid product discovery filters.",
        errors: filters.error.flatten(),
      });
    }

    const result = await discoverProducts(filters.data);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Product discovery error:", error);
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to discover products.",
    });
  }
}