"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  X,
} from "lucide-react";

import { useCart } from "@/hooks/useCart";

import {
  useCartDrawer,
} from "@/components/layout/CartProvider";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import CartEmptyState from "./CartEmptyState";
import CartLoading from "./CartLoading";

export default function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
  } = useCartDrawer();

  const {
    data: cart,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] cursor-default bg-neutral-950/35 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 38,
              mass: 0.9,
            }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-neutral-100 px-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
                  <ShoppingBag className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-base font-semibold tracking-tight text-neutral-950">
                    Your cart
                  </h2>

                  <p className="text-xs text-neutral-400">
                    {cart?.summary.totalItems ??
                      0}{" "}
                    {cart?.summary
                      .totalItems === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isFetching &&
                  !isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-neutral-400" />
                  )}

                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Close cart"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex min-h-0 flex-1 flex-col">
              {isLoading ? (
                <CartLoading />
              ) : isError ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-neutral-950">
                    We couldn't load your cart
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
                    Please try again. Your cart
                    items are still safe.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      refetch()
                    }
                    className="mt-5 rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
                  >
                    Try again
                  </button>
                </div>
              ) : !cart ||
                cart.items.length === 0 ? (
                <CartEmptyState />
              ) : (
                <>
                  {/* Continue shopping */}
                  <div className="shrink-0 border-b border-neutral-100 px-5 py-3 sm:px-6">
                    <button
                      type="button"
                      onClick={closeCart}
                      className="flex items-center gap-2 text-xs font-medium text-neutral-500 transition hover:text-neutral-950"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Continue shopping
                    </button>
                  </div>

                  {/* Items */}
                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                    <div className="space-y-5">
                      <AnimatePresence
                        initial={false}
                        mode="popLayout"
                      >
                        {cart.items.map(
                          (item) => (
                            <CartItem
                              key={item.id}
                              item={item}
                            />
                          )
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="shrink-0">
                    <CartSummary
                      summary={
                        cart.summary
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}