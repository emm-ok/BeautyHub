"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";


import ProductCard from "../ProductCard";
import { useRelatedProducts } from "@/hooks/useProduct";

interface RelatedProductsProps {
  productId: string;
}

export default function RelatedProducts({
  productId,
}: RelatedProductsProps) {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRelatedProducts(productId);

  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleProducts = 4;
  const maxIndex = Math.max(products.length - visibleProducts, 0);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const handlePrevious = () => {
    if (!canGoPrevious) return;

    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (!canGoNext) return;

    setCurrentIndex((prev) =>
      Math.min(prev + 1, maxIndex),
    );
  };

  return (
    <section
      aria-labelledby="related-products-heading"
      className="border-t border-neutral-200 pt-16"
    >
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neutral-400" />

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              You may also like
            </p>
          </div>

          <h2
            id="related-products-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl"
          >
            Related products
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-500">
            Discover products that may complement this
            product and your everyday routine.
          </p>
        </div>

        <Link
          href="/products"
          className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
        >
          Shop all products

          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-8 overflow-hidden">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="
                  min-w-[72%]
                  sm:min-w-[42%]
                  lg:min-w-[calc((100%-48px)/4)]
                "
              >
                <div className="overflow-hidden rounded-[1.5rem] border border-neutral-200 bg-neutral-50">
                  <div className="aspect-[4/5] animate-pulse bg-neutral-200" />

                  <div className="space-y-3 p-4">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="mt-8 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 px-6 py-12 text-center">
          <Sparkles className="mx-auto h-7 w-7 text-neutral-300" />

          <h3 className="mt-4 text-sm font-semibold text-neutral-900">
            Recommendations unavailable
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            We couldn&apos;t load related products right now.
            Please try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-neutral-950
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-neutral-800
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />

            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        !isError &&
        products.length === 0 && (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-neutral-200 bg-neutral-50/70 px-6 py-14 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-neutral-300" />

            <h3 className="mt-4 text-sm font-semibold text-neutral-900">
              More recommendations coming soon
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              We couldn&apos;t find other products that closely
              match this one right now.
            </p>

            <Link
              href="/products"
              className="
                mt-5
                inline-flex
                rounded-xl
                bg-neutral-950
                px-5
                py-3
                text-sm
                font-medium
                text-white
                transition
                hover:bg-neutral-800
              "
            >
              Explore catalogue
            </Link>
          </div>
        )}

      {/* Carousel */}
      {!isLoading &&
        !isError &&
        products.length > 0 && (
          <div className="relative mt-8">
            {/* Carousel controls */}
            <div className="mb-5 flex justify-end gap-2">
              <button
                type="button"
                aria-label="Previous products"
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-200
                  bg-white
                  text-neutral-700
                  shadow-sm
                  transition-all
                  duration-300
                  hover:border-neutral-300
                  hover:bg-neutral-950
                  hover:text-white
                  disabled:pointer-events-none
                  disabled:opacity-30
                "
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                aria-label="Next products"
                onClick={handleNext}
                disabled={!canGoNext}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-neutral-200
                  bg-white
                  text-neutral-700
                  shadow-sm
                  transition-all
                  duration-300
                  hover:border-neutral-300
                  hover:bg-neutral-950
                  hover:text-white
                  disabled:pointer-events-none
                  disabled:opacity-30
                "
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Carousel viewport */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-4"
                animate={{
                  x: `calc(-${currentIndex} * (25% + 12px))`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 30,
                  mass: 0.8,
                }}
                drag="x"
                dragConstraints={{
                  left: 0,
                  right: 0,
                }}
                dragElastic={0.08}
                onDragEnd={(_, info) => {
                  const threshold = 50;

                  if (info.offset.x < -threshold) {
                    handleNext();
                  }

                  if (info.offset.x > threshold) {
                    handlePrevious();
                  }
                }}
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="
                      min-w-[78%]
                      sm:min-w-[46%]
                      lg:min-w-[calc((100%-48px)/4)]
                    "
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Carousel progress */}
            {products.length > visibleProducts && (
              <div className="mt-6 flex items-center justify-center gap-1.5">
                {Array.from({
                  length: maxIndex + 1,
                }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to product position ${
                      index + 1
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-6 bg-neutral-950"
                        : "w-1.5 bg-neutral-200 hover:bg-neutral-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
    </section>
  );
}