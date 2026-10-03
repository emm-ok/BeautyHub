"use client";

import { useMemo, useState } from "react";

import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  SignInButton,
  useUser,
} from "@clerk/nextjs";

import { Product } from "@/types/products";

import {
  useAddCartItem,
  useCart,
} from "@/hooks/useCart";

import {
  useCartDrawer,
} from "@/components/layout/CartProvider";

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
  const {
    isSignedIn,
    isLoaded,
  } = useUser();

  const {
    openCart,
  } = useCartDrawer();

  const {
    data: cart,
  } = useCart();

  const addCartMutation =
    useAddCartItem();

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  /**
   * This is intentionally local UI state.
   *
   * It is not the cart itself.
   * The cart remains owned by TanStack Query.
   *
   * This state simply communicates the immediate
   * result of the user's click while the mutation
   * is being reconciled.
   */
  const [
    recentlyAdded,
    setRecentlyAdded,
  ] = useState(false);

  const discount = useMemo(
    () =>
      getDiscountPercentage(
        product
      ),
    [product]
  );

  const isInStock =
    product.status === "ACTIVE" &&
    product.stockQuantity > 0;

  const maxQuantity = Math.max(
    product.stockQuantity,
    1
  );

  const cartItem = cart?.items.find(
    (item) =>
      item.product.id === product.id
  );

  const isAlreadyInCart =
    Boolean(cartItem);

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

  const handleAddToCart = () => {
    if (!isInStock || !isSignedIn) {
      return;
    }

    /**
     * Optimistic visual feedback.
     *
     * This happens before the API response.
     */
    setRecentlyAdded(true);

    addCartMutation.mutate(
      {
        productId: product.id,
        quantity,
      },
      {
        onSuccess: () => {
          setQuantity(1);

          window.setTimeout(() => {
            setRecentlyAdded(false);
          }, 500);

          openCart();
        },

        onError: () => {
          setRecentlyAdded(false);
        },
      }
    );
  };

  const mutationError = addCartMutation.error as (Error & {
    response?: {
      data?: {
        message?: string;
      };
    };
  }) | null;
  const errorMessage = mutationError?.response?.data?.message;

    console.log("addCartMutation",addCartMutation);

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

      {/* API error */}

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="mt-4 overflow-hidden"
          >
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {`Only ${product.stockQuantity} available in stock. Please reduce the quantity and try again.`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add to cart */}

      {isLoaded && isSignedIn ? (
        <motion.button
          type="button"
          onClick={
            handleAddToCart
          }
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
          className={[
            "mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-semibold transition",
            isInStock
              ? "bg-neutral-950 text-white hover:bg-neutral-800"
              : "cursor-not-allowed bg-neutral-200 text-neutral-500",
          ].join(" ")}
        >
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            {recentlyAdded ? (
              <motion.span
                key="added"
                initial={{
                  opacity: 0,
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
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Added to cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{
                  opacity: 0,
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
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />

                {isInStock
                  ? isAlreadyInCart
                    ? "Add more to cart"
                    : recentlyAdded ? "Added to cart" : "Add to cart"
                  : "Out of stock"}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ) : (
        <SignInButton mode="modal">
          <motion.button
            type="button"
            disabled={!isInStock}
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
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
          >
            <ShoppingBag className="h-4 w-4" />

            {isInStock
              ? "Sign in to add to cart"
              : "Out of stock"}
          </motion.button>
        </SignInButton>
      )}

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