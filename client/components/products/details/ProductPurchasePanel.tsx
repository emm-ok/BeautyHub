"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

import { Product } from "@/types/products";

interface ProductPurchasePanelProps {
  product: Product;
}

function formatPrice(
  value: string | number
) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(Number(value));
}

function getDiscountPercentage(
  product: Product
) {
  const price = Number(
    product.price
  );

  const salePrice = Number(
    product.salePrice
  );

  if (
    !price ||
    salePrice >= price
  ) {
    return 0;
  }

  return Math.round(
    ((price - salePrice) / price) *
      100
  );
}

export default function ProductPurchasePanel({
  product,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] =
    useState(1);

  const discount =
    useMemo(
      () =>
        getDiscountPercentage(product),
      [product]
    );

  const isInStock =
    product.stockQuantity > 0;

  const maxQuantity = Math.max(
    product.stockQuantity,
    1
  );

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(
        current + 1,
        maxQuantity
      )
    );
  };

  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.25)] sm:p-8">
      {/* Price */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl font-semibold tracking-tight text-neutral-950">
            {formatPrice(
              product.salePrice
            )}
          </span>

          {discount > 0 && (
            <>
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(
                  product.price
                )}
              </span>

              <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-xs font-semibold text-white">
                {discount}% off
              </span>
            </>
          )}
        </div>

        {product.size &&
          product.unit && (
            <p className="mt-2 text-sm text-neutral-500">
              {product.size}{" "}
              {product.unit}
            </p>
          )}
      </div>

      {/* Stock */}
      <div className="mt-6 flex items-center gap-2">
        <span
          className={[
            "h-2 w-2 rounded-full",
            isInStock
              ? "bg-emerald-500"
              : "bg-red-500",
          ].join(" ")}
        />

        <span className="text-sm font-medium text-neutral-700">
          {isInStock
            ? product.stockQuantity <=
              (product.lowStockThreshold ??
                5)
              ? `Only ${product.stockQuantity} left`
              : "In stock"
            : "Currently unavailable"}
        </span>
      </div>

      {/* Quantity */}
      {isInStock && (
        <div className="mt-7">
          <p className="mb-3 text-sm font-medium text-neutral-900">
            Quantity
          </p>

          <div className="flex w-fit items-center overflow-hidden rounded-xl border border-neutral-200">
            <button
              type="button"
              onClick={
                decreaseQuantity
              }
              disabled={
                quantity === 1
              }
              className="flex h-11 w-11 items-center justify-center text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="flex h-11 min-w-12 items-center justify-center border-x border-neutral-200 text-sm font-medium">
              {quantity}
            </span>

            <button
              type="button"
              onClick={
                increaseQuantity
              }
              disabled={
                quantity >=
                maxQuantity
              }
              className="flex h-11 w-11 items-center justify-center text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add to cart */}
      <motion.button
        type="button"
        whileHover={
          isInStock
            ? { y: -1 }
            : undefined
        }
        whileTap={
          isInStock
            ? { scale: 0.99 }
            : undefined
        }
        disabled={!isInStock}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
      >
        <ShoppingBag className="h-4 w-4" />

        {isInStock
          ? "Add to cart"
          : "Out of stock"}
      </motion.button>

      {/* Trust */}
      <div className="mt-6 grid gap-3 border-t border-neutral-100 pt-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-neutral-500" />

          <span className="text-xs text-neutral-500">
            Verified product information
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Check className="h-4 w-4 text-neutral-500" />

          <span className="text-xs text-neutral-500">
            Secure checkout
          </span>
        </div>
      </div>
    </div>
  );
}