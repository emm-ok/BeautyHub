"use client";

import Link from "next/link";

import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { CartSummary as CartSummaryType } from "@/types/cart";

import { useCartDrawer } from "@/components/layout/CartProvider";

interface CartSummaryProps {
  summary: CartSummaryType;
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

export default function CartSummary({
  summary,
}: CartSummaryProps) {
  const { closeCart } =
    useCartDrawer();

  return (
    <div className="border-t border-neutral-200 bg-white p-5 sm:p-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">
            Subtotal
          </span>

          <span className="font-semibold text-neutral-950">
            {formatPrice(
              summary.subtotal
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">
            Delivery
          </span>

          <span className="text-xs font-medium text-neutral-400">
            Calculated at checkout
          </span>
        </div>

        <div className="flex items-end justify-between border-t border-neutral-100 pt-4">
          <div>
            <p className="text-sm font-medium text-neutral-950">
              Total
            </p>

            <p className="mt-1 text-xs text-neutral-400">
              {summary.totalItems}{" "}
              {summary.totalItems === 1
                ? "item"
                : "items"}
            </p>
          </div>

          <span className="text-xl font-semibold tracking-tight text-neutral-950">
            {formatPrice(
              summary.total
            )}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        onClick={closeCart}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Proceed to checkout
        <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        Secure checkout
      </div>
    </div>
  );
}