"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

import { DiscoveryProduct } from "@/types/discovery";

interface DiscoveryProductCardProps {
  product: DiscoveryProduct;
}

const formatPrice = (price: string | number) => {
  const amount =
    typeof price === "string" ? Number(price) : price;

  return `₦${amount.toLocaleString("en-NG")}`;
};

export default function DiscoveryProductCard({
  product,
}: DiscoveryProductCardProps) {
  const primaryImage =
    product.images.find((image) => image.isPrimary) ??
    product.images[0];

  const hasDiscount =
    Number(product.salePrice) < Number(product.price);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={
                primaryImage.altText ||
                product.name
              }
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              No image
            </div>
          )}

          {product.verificationStatus === "VERIFIED" && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-medium text-neutral-900 shadow-sm backdrop-blur">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              {product.brand && (
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {product.brand}
                </p>
              )}

              <h3 className="mt-1 line-clamp-2 text-sm font-medium text-neutral-950">
                {product.name}
              </h3>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-950" />
          </div>

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

          {product.size && (
            <p className="mt-1 text-xs text-neutral-400">
              {product.size}
              {product.unit ? ` ${product.unit}` : ""}
            </p>
          )}
        </div>
      </Link>
    </motion.article>
  );
}