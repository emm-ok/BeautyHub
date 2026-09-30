"use client";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import type {
  CartSummary as CartSummaryType,
} from "@/types/cart";

import {
  useCartDrawer,
} from "@/components/layout/CartProvider";

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

  /**
   * Delivery is calculated at checkout,
   * so there is currently no delivery charge
   * included in the cart drawer.
   *
   * Using subtotal here ensures the displayed
   * total follows the optimistic cart state
   * immediately.
   */
  const optimisticSubtotal =
    Number(summary.subtotal) || 0;

  const delivery = 0;

  const optimisticTotal =
    optimisticSubtotal + delivery;

  const totalItems =
    summary.totalItems ?? 0;

  return (
    <div className="border-t border-neutral-200 bg-white p-5 sm:p-6">
      <div className="space-y-3">
        {/* Subtotal */}

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">
            Subtotal
          </span>

          <motion.span
            key={optimisticSubtotal}
            initial={{
              opacity: 0.5,
              y: 3,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.15,
            }}
            className="font-semibold text-neutral-950"
          >
            {formatPrice(
              optimisticSubtotal
            )}
          </motion.span>
        </div>

        {/* Delivery */}

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">
            Delivery
          </span>

          <span className="text-xs font-medium text-neutral-400">
            Calculated at checkout
          </span>
        </div>

        {/* Total */}

        <div className="flex items-end justify-between border-t border-neutral-100 pt-4">
          <div>
            <p className="text-sm font-medium text-neutral-950">
              Total
            </p>

            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.p
                key={totalItems}
                initial={{
                  opacity: 0,
                  y: 3,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -3,
                }}
                transition={{
                  duration: 0.15,
                }}
                className="mt-1 text-xs text-neutral-400"
                aria-live="polite"
              >
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.span
              key={optimisticTotal}
              initial={{
                opacity: 0.5,
                y: 4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -4,
              }}
              transition={{
                duration: 0.15,
              }}
              className="text-xl font-semibold tracking-tight text-neutral-950"
              aria-live="polite"
            >
              {formatPrice(
                optimisticTotal
              )}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Checkout */}

      <Link
        href="/checkout"
        onClick={closeCart}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Proceed to checkout

        <ArrowRight className="h-4 w-4" />
      </Link>

      {/* Trust */}

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
        <ShieldCheck className="h-3.5 w-3.5" />

        Secure checkout
      </div>
    </div>
  );
}