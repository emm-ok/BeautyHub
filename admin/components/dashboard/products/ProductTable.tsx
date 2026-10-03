"use client";

import {
  ChevronRight,
  Loader2,
  Package,
  PackageOpen,
  Trash2,
} from "lucide-react";

import type { AdminProduct } from "@/types/products";
import UpdateProductDrawer from "./UpdateProductDrawer";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ProductTableProps {
  products: AdminProduct[];
  onDelete: (
    product: AdminProduct,
  ) => void;
  isLoading?: boolean;
  error?: unknown;
}

function formatPrice(value: string) {
  return `₦${Number(value).toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

function getStockClasses(product: AdminProduct) {
  if (product.stockQuantity <= 0) {
    return "text-red-600";
  }

  if (
    product.stockQuantity <=
    product.lowStockThreshold
  ) {
    return "text-amber-600";
  }

  return "text-neutral-700";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Unable to load products.";
}

function StatusBadge({
  status,
}: {
  status: AdminProduct["status"];
}) {
  const styles = {
    ACTIVE:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    INACTIVE:
      "bg-neutral-100 text-neutral-600 ring-neutral-500/10",
    OUT_OF_STOCK:
      "bg-red-50 text-red-700 ring-red-600/10",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/^\w/, (letter) =>
          letter.toUpperCase(),
        )}
    </span>
  );
}

function VerificationBadge({
  verified,
}: {
  verified: boolean;
}) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-medium
        ring-1
        ring-inset
        ${verified
          ? "bg-blue-50 text-blue-700 ring-blue-600/10"
          : "bg-neutral-100 text-neutral-500 ring-neutral-500/10"
        }
      `}
    >
      {verified ? "Verified" : "Not verified"}
    </span>
  );
}

export default function ProductTable({
  products,
  onDelete,
}: ProductTableProps) {
  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState<string | null>(null);

  /* =========================================================
     DRAWER
  ========================================================== */

  const drawerOpen =
    selectedProductId !== null;

  const openProductDrawer = (
    productId: string,
  ) => {
    setSelectedProductId(productId);
  };

  const closeProductDrawer = () => {
    setSelectedProductId(null);
  };

  /* =========================================================
     EMPTY
  ========================================================== */

  if (!products.length) {
    return (
      <>
        <div
          className="
            flex
            min-h-[360px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-neutral-200
            bg-neutral-50/50
            px-6
            text-center
          "
        >
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-white
              text-neutral-400
              shadow-sm
              ring-1
              ring-neutral-200
            "
          >
            <Package className="h-5 w-5" />
          </div>

          <h3
            className="
              mt-4
              text-sm
              font-semibold
              text-neutral-900
            "
          >
            No products found
          </h3>

          <p
            className="
              mt-1
              max-w-sm
              text-xs
              leading-5
              text-neutral-400
            "
          >
            Products matching your current
            filters will appear here.
          </p>
        </div>

        <UpdateProductDrawer
          open={drawerOpen}
          productId={selectedProductId}
          onClose={closeProductDrawer}
        />
      </>
    );
  }

  // if (products.length === 0) {
  //   return (
  //     <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
  //       <PackageOpen className="mx-auto h-8 w-8 text-neutral-300" />

  //       <h3 className="mt-4 text-sm font-semibold text-neutral-900">
  //         No products found
  //       </h3>

  //       <p className="mt-1 text-sm text-neutral-500">
  //         Try adjusting your search or filters.
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Product
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Category
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Price
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Stock
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Verification
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Status
                </th>

                <th className="w-12 px-4" />
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              <AnimatePresence initial={false}>
                {products.map((product) => {
                  const image =
                    product.images?.[0];

                  return (
                    <motion.tr
                      key={product.id}
                      layout
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      onClick={() =>
                        openProductDrawer(
                          product.id,
                        )
                      }
                      className="
                      group
                      cursor-pointer
                      bg-white
                      transition-colors
                      hover:bg-neutral-50/80
                    "
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                            {image ? (
                              <Image
                                src={image.url}
                                alt={
                                  image.altText ??
                                  product.name
                                }
                                fill
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-neutral-300">
                                <PackageOpen className="h-4 w-4" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                className="
                                max-w-[260px]
                                truncate
                                text-xs
                                font-semibold
                                text-neutral-900
                              "
                              >
                                {product.name}
                              </p>

                              {product.discountType !==
                                "NONE" &&
                                Number(
                                  product.discountValue ??
                                  0,
                                ) > 0 && (
                                  <span
                                    className="
                                    rounded-md
                                    bg-neutral-100
                                    px-1.5
                                    py-0.5
                                    text-[9px]
                                    font-semibold
                                    text-neutral-500
                                  "
                                  >
                                    Sale
                                  </span>
                                )}
                            </div>

                            <p
                              className="
                              mt-1
                              truncate
                              text-[10px]
                              text-neutral-400
                            "
                            >
                              {product.brand ??
                                "BeautyHub catalogue"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {product.category.name ?? "—"}
                      </td>

                      <td className="px-4 py-4">
                        <div>
                          <p
                            className="
                            text-xs
                            font-semibold
                            text-neutral-900
                          "
                          >
                            {formatPrice(
                              product.salePrice,
                            )}
                          </p>

                          {Number(
                            product.price,
                          ) >
                            Number(
                              product.salePrice,
                            ) && (
                              <p
                                className="
                              mt-0.5
                              text-[10px]
                              text-neutral-400
                              line-through
                            "
                              >
                                {formatPrice(
                                  product.price,
                                )}
                              </p>
                            )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            product.stockQuantity ===
                              0
                              ? "text-sm font-semibold text-red-600"
                              : product.stockQuantity <=
                                product.lowStockThreshold
                                ? "text-sm font-semibold text-amber-600"
                                : "text-sm text-neutral-700"
                          }
                        >
                          {product.stockQuantity}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <VerificationBadge
                          verified={
                            product.verificationStatus ===
                            "VERIFIED"
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={product.status}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(product);
                          }}
                          className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          text-neutral-400
                          transition
                          hover:bg-neutral-100
                          hover:text-neutral-900
                        "
                          aria-label={`Actions for ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        <AnimatePresence initial={false}>
          {products.map((product) => {
            const image =
              product.images?.[0];

            return (
              <motion.button
                key={product.id}
                type="button"
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                onClick={() =>
                  openProductDrawer(
                    product.id,
                  )
                }
                className="
                  group
                  block
                  w-full
                  cursor-pointer
                  bg-white
                  px-4
                  py-4
                  text-left
                  transition
                  hover:bg-neutral-50/80
                  sm:px-5
                "
              >
                <div className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {image ? (
                      <Image
                        src={image.url}
                        alt={
                          image.altText ??
                          product.name
                        }
                        fill
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-300">
                        <PackageOpen className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p
                          className="truncate text-xs font-semibold text-neutral-900"
                        >
                          {product.name}
                        </p>

                        <p
                          className="mt-1 truncate text-[10px] text-neutral-400"
                        >
                          {product.brand ??
                            "BeautyHub catalogue"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <ChevronRight
                          className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300 transition group-hover:text-neutral-700"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(product);
                          }}
                          className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          text-neutral-400
                          transition
                          hover:bg-neutral-100
                          hover:text-neutral-900
                        "
                          aria-label={`Actions for ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusBadge
                        status={
                          product.status
                        }
                      />

                      <VerificationBadge
                        verified={
                          product.verificationStatus ===
                          "VERIFIED"
                        }
                      />
                    </div>

                    <div
                      className="mt-3 grid grid-cols-3 gap-3 border-t border-neutral-100 pt-3"
                    >
                      <div>
                        <p
                          className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400"
                        >
                          Price
                        </p>
                        <p
                          className="mt-1 text-xs font-semibold text-neutral-900"
                        >
                          {formatPrice(
                            product.salePrice,
                          )}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400"
                        >
                          Stock
                        </p>
                        <p
                          className={`mt-1 text-xs font-semibold ${getStockClasses(product)} `}
                        >
                          {product.stockQuantity.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-[9px] font-medium uppercase tracking-[0.1em] text-neutral-400"
                        >
                          Category
                        </p>

                        <p
                          className="mt-1 truncate text-xs font-medium text-neutral-700"
                        >
                          {product.category?.name ??
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <UpdateProductDrawer
        open={drawerOpen}
        productId={selectedProductId}
        onClose={closeProductDrawer}
      />
    </>
  );
}