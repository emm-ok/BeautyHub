import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  createProductSchema,
  productQuerySchema,
  updateProductSchema,
  relatedProductsParamsSchema,
  relatedProductsQuerySchema,
} from "./product.schema.js";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  getRelatedProducts,
  getActiveCategories
} from "./product.service.js";
import { errorMonitor } from "node:events";

export async function createProductController(
  req: Request,
  res: Response
) {
  try {
    const data = createProductSchema.parse(
      req.body
    );

    const product = await createProduct(data);

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Error creating product", error.flatten())
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.flatten(),
      });
    }

    console.error("Error creating product", error)

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create product.",
    });
  }
}



export async function getProductsController(
  req: Request,
  res: Response
) {
  try {
    const filters =
      productQuerySchema.parse(req.query);

    const result = await getProducts(filters);

    return res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters.",
        errors: error.flatten(),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products.",
    });
  }
}



export async function getProductController(
  req: Request,
  res: Response
) {
  try {
    const product = await getProductById(
      req.params.id as string
    );

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch product.";

    const status =
      message === "Product not found."
        ? 404
        : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}



export async function updateProductController(
  req: Request,
  res: Response
) {
  try {
    const data =
      updateProductSchema.parse(req.body);

    const product = await updateProduct(
      req.params.id as string,
      data
    );

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: error.flatten(),
      });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update product.";

    const status =
      message === "Product not found."
        ? 404
        : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}



export async function deleteProductController(
  req: Request,
  res: Response
) {
  try {
    const result = await deleteProduct(
      req.params.id as string
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete product.";

    const status =
      message === "Product not found."
        ? 404
        : message.includes("referenced")
          ? 409
          : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}




export async function getRelatedProductsController(
  req: Request,
  res: Response,
) {
  const paramsResult =
    relatedProductsParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID.",
      errors: paramsResult.error.flatten(),
    });
  }

  const queryResult =
    relatedProductsQuerySchema.safeParse(req.query);

  if (!queryResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid recommendation parameters.",
      errors: queryResult.error.flatten(),
    });
  }

  try {
    const products = await getRelatedProducts(
      paramsResult.data.id,
      {
        limit: queryResult.data.limit,
      },
    );

    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(
      "Get related products error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve related products.",
    });
  }
}


export async function getActiveCategoriesController(
  _req: Request,
  res: Response,
) {
  const categories = await getActiveCategories();

  return res.status(200).json({
    success: true,
    data: categories,
  });
}