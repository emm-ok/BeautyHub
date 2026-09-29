"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Loader2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { motion } from "framer-motion";

import { CartItem as CartItemType } from "@/types/cart";

import {
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemType;
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

export default function CartItem({
  item,
}: CartItemProps) {
  const updateMutation =
    useUpdateCartItem();

  const removeMutation =
    useRemoveCartItem();

  const isUpdating =
    updateMutation.isPending;

  const isRemoving =
    removeMutation.isPending;

  const maxQuantity =
    Math.max(
      item.product.stockQuantity,
      1
    );

  const decrease = () => {
    if (item.quantity <= 1) {
      return;
    }

    updateMutation.mutate({
      itemId: item.id,
      quantity: item.quantity - 1,
    });
  };

  const increase = () => {
    if (
      item.quantity >=
      maxQuantity
    ) {
      return;
    }

    updateMutation.mutate({
      itemId: item.id,
      quantity: item.quantity + 1,
    });
  };

  const remove = () => {
    removeMutation.mutate(item.id);
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        height: 0,
      }}
      className="flex gap-4 border-b border-neutral-100 pb-5"
    >
      <Link
        href={`/products/${item.product.id}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100"
      >
        {item.product.image ? (
          <Image
            src={item.product.image.url}
            alt={
              item.product.image.altText ??
              item.product.name
            }
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            No image
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {item.product.brand && (
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                {item.product.brand}
              </p>
            )}

            <Link
              href={`/products/${item.product.id}`}
              className="mt-1 block truncate text-sm font-medium text-neutral-950 transition hover:text-neutral-600"
            >
              {item.product.name}
            </Link>
          </div>

          <button
            type="button"
            onClick={remove}
            disabled={isRemoving}
            aria-label={`Remove ${item.product.name}`}
            className="shrink-0 text-neutral-400 transition hover:text-red-600 disabled:opacity-40"
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-2">
          <span className="text-sm font-semibold text-neutral-950">
            {formatPrice(
              item.unitPrice
            )}
          </span>

          {Number(item.product.price) >
            Number(
              item.product.salePrice
            ) && (
            <span className="ml-2 text-xs text-neutral-400 line-through">
              {formatPrice(
                item.product.price
              )}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center overflow-hidden rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={decrease}
              disabled={
                item.quantity <= 1 ||
                isUpdating
              }
              className="flex h-8 w-8 items-center justify-center text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="flex h-8 min-w-9 items-center justify-center border-x border-neutral-200 px-2 text-xs font-medium text-neutral-900">
              {isUpdating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                item.quantity
              )}
            </span>

            <button
              type="button"
              onClick={increase}
              disabled={
                item.quantity >=
                  maxQuantity ||
                isUpdating
              }
              className="flex h-8 w-8 items-center justify-center text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="text-sm font-semibold text-neutral-950">
            {formatPrice(
              item.lineTotal
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
}