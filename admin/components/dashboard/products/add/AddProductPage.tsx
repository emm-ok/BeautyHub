"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  PackagePlus,
  UploadCloud,
} from "lucide-react";

import Link from "next/link";

import { motion } from "framer-motion";
import { useState } from "react";

import { ProductFormSection } from "./ProductFormSection";
import { ProductImageUploadZone } from "./ProductImageUploadZone";
import { ProductImageManager } from "./ProductImageManager";
import { createProduct } from "@/services/products";
import { uploadProductImage } from "@/services/product-image";

interface PendingImage {
  id: string;
  file: File;
  preview: string;
  altText: string;
}

type SubmissionState =
  | "idle"
  | "creating"
  | "uploading"
  | "partial"
  | "success"
  | "error";

export function AddProductPage() {
  const [pendingImages, setPendingImages] =
    useState<PendingImage[]>([]);

  const [createdProduct, setCreatedProduct] =
    useState<{
      id: string;
      name: string;
    } | null>(null);

  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  const [error, setError] =
    useState<string | null>(null);

  async function handleCreateProduct(
    values: any,
  ) {
    setError(null);

    try {
      setSubmissionState("creating");

      /*
       * Replace this with your existing
       * createProduct mutation/API call.
       */
      const product = await createProduct(
        values,
      );

      setCreatedProduct({
        id: product.id,
        name: product.name,
      });

      if (pendingImages.length > 0) {
        setSubmissionState("uploading");

        const failures: string[] = [];

        for (
          const image of pendingImages
        ) {
          try {
            await uploadProductImage(
              product.id,
              image.file,
              image.altText,
            );
          } catch {
            failures.push(
              image.file.name,
            );
          }
        }

        if (failures.length > 0) {
          setSubmissionState("partial");

          setError(
            `Product created, but ${failures.length} image${failures.length > 1 ? "s" : ""} failed to upload.`,
          );

          return;
        }
      }

      setSubmissionState("success");
    } catch (err) {
      setSubmissionState("error");

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create product.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: -8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-8"
        >
          <Link
            href="/admin/products"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Products
          </Link>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
                  <PackagePlus className="h-4 w-4" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  Product management
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
                Add product
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                Create a complete product catalogue
                entry with pricing, inventory,
                education, suitability and product
                photography.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="text-sm font-semibold text-red-900">
                Something needs attention
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>
            </div>
          </motion.div>
        )}

        {/* Uploading status */}
        {submissionState ===
          "uploading" && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
              <UploadCloud className="h-4 w-4 text-neutral-700" />
            </div>

            <div>
              <p className="text-sm font-semibold text-neutral-950">
                Uploading product images
              </p>

              <p className="text-sm text-neutral-500">
                Your product has been created. We are
                securely uploading its images.
              </p>
            </div>

            <Loader2 className="ml-auto h-5 w-5 animate-spin text-neutral-500" />
          </motion.div>
        )}

        {/* Success */}
        {submissionState ===
          "success" && (
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />

            <div>
              <p className="text-sm font-semibold text-emerald-950">
                Product created successfully
              </p>

              <p className="text-sm text-emerald-700">
                {createdProduct?.name} is now available
                in the product catalogue.
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {/* Product form sections go here */}

            {!createdProduct && (
              <>
                {/* Basic information */}
                {/* Pricing */}
                {/* Inventory */}
                {/* Content */}
                {/* Suitability */}
                {/* Visibility */}
              </>
            )}

            {/* Images */}
            <ProductFormSection
              title="Product photography"
              description={
                createdProduct
                  ? "Manage the images associated with this product."
                  : "Upload clear product photography. The first uploaded image becomes the primary image."
              }
            >
              {createdProduct ? (
                <ProductImageManager
                  productId={
                    createdProduct.id
                  }
                />
              ) : (
                <ProductImageUploadZone
                  images={pendingImages}
                  onChange={
                    setPendingImages
                  }
                />
              )}
            </ProductFormSection>

            {/* Form actions */}
            {!createdProduct && (
              <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur">
                <p className="hidden text-sm text-neutral-500 sm:block">
                  Review all information before
                  creating the product.
                </p>

                <button
                  type="submit"
                  disabled={
                    submissionState ===
                    "creating"
                  }
                  onClick={() => handleCreateProduct()}
                  className="ml-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submissionState ===
                  "creating" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create product"
                  )}
                </button>
              </div>
            )}

            {createdProduct && (
              <div className="flex flex-col justify-end gap-3 sm:flex-row">
                <Link
                  href="/admin/products"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
                >
                  Back to products
                </Link>

                <Link
                  href={`/admin/products/${createdProduct.id}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                  View product
                </Link>
              </div>
            )}
          </div>

          {/* Right rail */}
          <aside className="hidden xl:block">
            <div className="sticky top-8 space-y-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Publishing checklist
                </p>

                <div className="mt-5 space-y-4 text-sm">
                  <ChecklistItem
                    label="Product information"
                    complete={false}
                  />

                  <ChecklistItem
                    label="Pricing"
                    complete={false}
                  />

                  <ChecklistItem
                    label="Inventory"
                    complete={false}
                  />

                  <ChecklistItem
                    label="Product photography"
                    complete={
                      pendingImages.length >
                      0
                    }
                  />

                  <ChecklistItem
                    label="Suitability information"
                    complete={false}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-neutral-950 p-5 text-white">
                <p className="text-sm font-semibold">
                  Catalogue standard
                </p>

                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Use accurate product information and
                  clear photography. Verification should
                  only be enabled when the product has
                  been reviewed according to your
                  catalogue process.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "flex h-5 w-5 items-center justify-center rounded-full border",
          complete
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-neutral-300",
        ].join(" ")}
      >
        {complete && (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
      </div>

      <span
        className={
          complete
            ? "text-neutral-900"
            : "text-neutral-500"
        }
      >
        {label}
      </span>
    </div>
  );
}