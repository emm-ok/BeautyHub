"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
  BadgeCheck,
} from "lucide-react";

import { motion } from "framer-motion";

import { Product } from "@/types/products";

interface ProductCardProps {
  product: Product;
}

function formatPrice(value: string | number) {
  return `₦${Number(value).toLocaleString("en-NG")}`;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const image = product.images[0];

  const hasDiscount =
    Number(product.salePrice) <
    Number(product.price);

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-black/5"
    >
      <Link
        href={`/products/${product.id}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {image ? (
            <Image
              src={image.url}
              alt={
                image.altText ||
                product.name
              }
              fill
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1024px) 33vw,
                25vw
              "
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}

          {product.verificationStatus ===
            "VERIFIED" && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          )}

          {hasDiscount && (
            <div className="absolute right-3 top-3 rounded-full bg-neutral-950 px-2.5 py-1.5 text-xs font-medium text-white">
              Save{" "}
              {Math.round(
                ((Number(product.price) -
                  Number(product.salePrice)) /
                  Number(product.price)) *
                  100
              )}
              %
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {product.brand && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  {product.brand}
                </p>
              )}

              <h2 className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-neutral-950">
                {product.name}
              </h2>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-950" />
          </div>

          <p className="mt-2 text-xs text-neutral-400">
            {product.category.name.replace(
              "_",
              " "
            )}
            {product.size
              ? ` · ${product.size}${product.unit ? ` ${product.unit}` : ""}`
              : ""}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="font-semibold text-neutral-950">
              {formatPrice(product.salePrice)}
            </span>

            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}