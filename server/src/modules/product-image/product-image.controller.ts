import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  createProductImage,
  deleteProductImage,
  getProductImages,
  reorderProductImages,
  setPrimaryProductImage,
} from "./product-image.service.js";

import {
  reorderProductImagesSchema,
} from "./product-image.schema.js";



export async function uploadProductImageController(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required.",
      });
    }

    const image =
      await createProductImage(
        req.params.productId as string,
        req.file,
        req.body.altText
      );

    return res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error uploading image", error)
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to upload product image.",
    });
  }
}



export async function getProductImagesController(
  req: Request,
  res: Response
) {
  try {
    const images =
      await getProductImages(
        req.params.productId as string
      );

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch product images.";

    return res.status(404).json({
      success: false,
      message,
    });
  }
}



export async function deleteProductImageController(
  req: Request,
  res: Response
) {
  try {
    const result =
      await deleteProductImage(
        req.params.productId as string,
        req.params.imageId as string
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete product image.";

    const status =
      message === "Product image not found."
        ? 404
        : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}



export async function reorderProductImagesController(
  req: Request,
  res: Response
) {
  try {
    const { imageIds } =
      reorderProductImagesSchema.parse(
        req.body
      );

    const images =
      await reorderProductImages(
        req.params.productId as string,
        imageIds
      );

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid image order.",
        errors: error.flatten(),
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to reorder images.",
    });
  }
}



export async function setPrimaryProductImageController(
  req: Request,
  res: Response
) {
  try {
    const image =
      await setPrimaryProductImage(
        req.params.productId as string,
        req.params.imageId as string
      );

    return res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to update primary image.";

    const status =
      message === "Product image not found."
        ? 404
        : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}