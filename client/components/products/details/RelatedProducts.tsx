"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Product } from "@/types/products";
import ProductCard from "../ProductCard";

interface RelatedProductsProps {
  products?: Product[];
}

export default function RelatedProducts({
  products = [],
}: RelatedProductsProps) {
  return (
    <section className="border-t border-neutral-200 pt-16">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neutral-500" />

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              You may also like
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            Related products
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-500">
            Discover other products that may
            complement your routine.
          </p>
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-700"
        >
          Shop all products

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {products.length > 0 ? (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {products.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </motion.div>
      ) : (
        <div className="mt-8 rounded-[2rem] border border-dashed border-neutral-200 bg-neutral-50/70 px-6 py-14 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-neutral-300" />

          <h3 className="mt-4 text-sm font-semibold text-neutral-900">
            More recommendations coming soon
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            We&apos;ll use your product preferences
            and shopping needs to surface products
            that complement this one.
          </p>

          <Link
            href="/products"
            className="mt-5 inline-flex rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Explore catalogue
          </Link>
        </div>
      )}
    </section>
  );
}