"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

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

  const carouselRef = useRef<HTMLDivElement>(null);

  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [canGoNext, setCanGoNext] = useState(
    products.length > 1,
  );

  /**
   * Determine whether the carousel can move
   * in either direction.
   */
  const updateNavigationState = () => {
    const container = carouselRef.current;

    if (!container) return;

    const maxScrollLeft =
      container.scrollWidth - container.clientWidth;

    setCanGoPrevious(container.scrollLeft > 5);

    setCanGoNext(
      container.scrollLeft < maxScrollLeft - 5,
    );
  };

  /**
   * Scroll the carousel by approximately one card.
   */
  const scrollCarousel = (direction: "left" | "right") => {
    const container = carouselRef.current;

    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>(
        "[data-carousel-card]",
      );

    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;

    const gap = 16;

    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left:
        direction === "right"
          ? scrollAmount
          : -scrollAmount,
      behavior: "smooth",
    });

    /*
     * Allow the browser to finish the smooth scroll
     * before recalculating the arrow state.
     */
    window.setTimeout(
      updateNavigationState,
      350,
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
                  min-w-[78%]
                  sm:min-w-[46%]
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
              We couldn&apos;t find other products that
              closely match this one right now.
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
            {/* Controls */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs text-neutral-400">
                {products.length}{" "}
                {products.length === 1
                  ? "recommendation"
                  : "recommendations"}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous products"
                  onClick={() =>
                    scrollCarousel("left")
                  }
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
                  onClick={() =>
                    scrollCarousel("right")
                  }
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
            </div>

            {/* Carousel */}
            <div
              ref={carouselRef}
              onScroll={updateNavigationState}
              className="
                -mx-4
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                px-4
                pb-4
                scroll-smooth
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:-mx-6
                sm:px-6
                lg:-mx-0
                lg:px-0
              "
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  data-carousel-card
                  className="
                    min-w-[78%]
                    snap-start
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
                    duration: 0.4,
                    delay: index * 0.06,
                    ease: "easeOut",
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Mobile swipe hint */}
            {products.length > 1 && (
              <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 sm:hidden">
                <span>Swipe to explore</span>

                <ArrowRight className="h-3 w-3" />
              </div>
            )}
          </div>
        )}
    </section>
  );
}