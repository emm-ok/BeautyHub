"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

import { motion } from "framer-motion";

import { useCartDrawer } from "@/components/layout/CartProvider";

export default function CartEmptyState() {
  const { closeCart } =
    useCartDrawer();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100"
      >
        <ShoppingCart className="h-7 w-7 text-neutral-500" />
      </motion.div>

      <h3 className="mt-5 text-base font-semibold text-neutral-950">
        Your cart is empty
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
        Explore our verified beauty products
        and find something that works for you.
      </p>

      <Link
        href="/products"
        onClick={closeCart}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Browse products
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}