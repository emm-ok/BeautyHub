import type { Request, Response } from "express";
import { ZodError } from "zod";

import {
  addCartItemSchema,
  updateCartItemSchema,
} from "./cart.schema.js";

import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cart.service.js";

function getClerkId(req: Request): string {
  const clerkId = req.user?.clerkId;

  if (!clerkId) {
    throw new Error("Unauthorized.");
  }

  return clerkId;
}

export async function getCartController(
  req: Request,
  res: Response
) {
  try {
    const clerkId = getClerkId(req);

    const cart = await getCart(clerkId);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to fetch cart.";

    const status =
      message === "Unauthorized."
        ? 401
        : message === "User not found."
          ? 404
          : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

export async function addCartItemController(
  req: Request,
  res: Response
) {
  try {
    const clerkId = getClerkId(req);

    const input = addCartItemSchema.parse(req.body);

    const cart = await addCartItem(
      clerkId,
      input.productId,
      input.quantity
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart.",
      data: cart,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item data.",
        errors: error.flatten(),
      });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unable to add product to cart.";

    const status =
      message === "Unauthorized."
        ? 401
        : message === "User not found."
          ? 404
          : message === "Product not found."
            ? 404
            : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

export async function updateCartItemController(
  req: Request,
  res: Response
) {
  try {
    const clerkId = getClerkId(req);

    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Cart item ID is required.",
      });
    }

    const input = updateCartItemSchema.parse(req.body);

    const cart = await updateCartItem(
      clerkId,
      itemId as string,
      input.quantity
    );

    return res.status(200).json({
      success: true,
      message: "Cart updated.",
      data: cart,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item data.",
        errors: error.flatten(),
      });
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update cart item.";

    const status =
      message === "Unauthorized."
        ? 401
        : message === "Cart item not found."
          ? 404
          : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

export async function removeCartItemController(
  req: Request,
  res: Response
) {
  try {
    const clerkId = getClerkId(req);

    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Cart item ID is required.",
      });
    }

    const cart = await removeCartItem(
      clerkId,
      itemId as string
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      data: cart,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to remove cart item.";

    const status =
      message === "Unauthorized."
        ? 401
        : message === "Cart item not found."
          ? 404
          : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

export async function clearCartController(
  req: Request,
  res: Response
) {
  try {
    const clerkId = getClerkId(req);

    const cart = await clearCart(clerkId);

    return res.status(200).json({
      success: true,
      message: "Cart cleared.",
      data: cart,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to clear cart.";

    const status =
      message === "Unauthorized."
        ? 401
        : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}