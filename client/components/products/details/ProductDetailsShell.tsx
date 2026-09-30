"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

import { useProduct } from "@/hooks/useProduct";

import ProductImageGallery from "./ProductImageGallery";
import ProductPurchasePanel from "./ProductPurchasePanel";
import ProductInformation from "./ProductInformation";
import ProductEducation from "./ProductEducation";
import ProductSuitability from "./ProductSuitability";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import ProductDetailsError from "./ProductDetailsError";
import RelatedProducts from "./RelatedProducts";
import ProductWarnings from "./ProductWarnings";

interface ProductDetailsShellProps {
  productId: string;
}

export default function ProductDetailsShell({
  productId,
}: ProductDetailsShellProps) {
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProduct(productId);

  if (isLoading) {
    return (
      <ProductDetailsSkeleton />
    );
  }

  if (isError || !product) {
    return (
      <ProductDetailsError
        onRetry={() => refetch()}
      />
    );
  }

  const categoryName =
    product.category.name.replace(
      /_/g,
      " "
    );

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link
              href="/products"
              className="transition hover:text-neutral-900"
            >
              Products
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="text-neutral-500">
              {categoryName}
            </span>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="max-w-[180px] truncate text-neutral-700 sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product hero */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to products
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:items-start lg:gap-14">
          {/* Images */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
            }}
          >
            <ProductImageGallery
              images={product.images}
              productName={
                product.name
              }
            />
          </motion.div>

          {/* Product summary */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.08,
            }}
            className="lg:sticky lg:top-8"
          >
            {/* Brand / category */}
            <div className="flex flex-wrap items-center gap-3">
              {product.brand && (
                <span className="text-sm font-medium text-neutral-500">
                  {product.brand}
                </span>
              )}

              <span className="h-1 w-1 rounded-full bg-neutral-300" />

              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                {categoryName}
              </span>
            </div>

            {/* Name */}
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* Verification */}
            {product.verificationStatus ===
              "VERIFIED" && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2">
                <BadgeCheck className="h-4 w-4 text-neutral-700" />

                <span className="text-xs font-medium text-neutral-700">
                  Verified product
                </span>
              </div>
            )}

            {/* Short description */}
            <p className="mt-6 text-sm leading-7 text-neutral-500 sm:text-base">
              {product.description}
            </p>

            {/* Purchase */}
            <div className="mt-8">
              <ProductPurchasePanel
                product={product}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Education / information */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <ProductInformation
              product={product}
            />

            <ProductSuitability
              product={product}
            />

            <ProductEducation
              product={product}
            />

            <ProductWarnings
              warnings={
                product.warnings
              }
            />
          </div>
        </div>
      </section>

      {/* Related products */}
      <section className="bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <RelatedProducts productId={product.id} />
        </div>
      </section>
    </main>
  );
}