"use client";

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

import { motion } from "framer-motion";

import { useProducts } from "@/hooks/useProducts";

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

export default function FeaturedProducts() {
  const {
    data,
    isLoading,
  } = useProducts({
    page: 1,
    limit: 4,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const products =
    data?.products ?? [];

  return (
    <section
      id="featured-products"
      className="bg-white py-24 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Featured products
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
              Products worth
              exploring.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
              Explore a selection from the
              BeautyHub catalogue, with
              useful information to help
              you make a more informed
              choice.
            </p>
          </div>

          <Link
            href="/products"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-neutral-950"
          >
            Explore all products

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({
                length: 4,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="animate-pulse"
                  >
                    <div className="aspect-[4/5] rounded-[1.5rem] bg-neutral-100" />

                    <div className="mt-4 h-3 w-20 rounded bg-neutral-100" />

                    <div className="mt-2 h-4 w-36 rounded bg-neutral-100" />

                    <div className="mt-3 h-4 w-24 rounded bg-neutral-100" />
                  </div>
                )
              )
            : products.map(
                (product, index) => {
                  const image =
                    product.images?.[0];

                  return (
                    <motion.article
                      key={
                        product.id
                      }
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.5,
                        delay:
                          index * 0.07,
                      }}
                      className="group"
                    >
                      <Link
                        href={`/products/${product.id}`}
                      >
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-neutral-100">
                          {image ? (
                            <img
                              src={
                                image.url
                              }
                              alt={
                                image.altText ??
                                product.name
                              }
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                              No image
                            </div>
                          )}

                          {product.verificationStatus ===
                            "VERIFIED" && (
                            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-800 backdrop-blur">
                              <BadgeCheck className="h-3 w-3" />
                              Verified
                            </div>
                          )}
                        </div>

                        <div className="mt-4">
                          {product.brand && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                              {
                                product.brand
                              }
                            </p>
                          )}

                          <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-neutral-950">
                            {
                              product.name
                            }
                          </h3>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm font-semibold text-neutral-950">
                              {formatPrice(
                                product.salePrice
                              )}
                            </span>

                            {Number(
                              product.price
                            ) >
                              Number(
                                product.salePrice
                              ) && (
                              <span className="text-xs text-neutral-400 line-through">
                                {formatPrice(
                                  product.price
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                }
              )}
        </div>
      </div>
    </section>
  );
}