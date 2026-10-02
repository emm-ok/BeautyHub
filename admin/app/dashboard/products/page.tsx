"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import ProductKpiCards from "@/components/dashboard/products/ProductKpiCards";
import ProductFilters from "@/components/dashboard/products/ProductFilters";
import ProductPagination from "@/components/dashboard/products/ProductPagination";
import ProductTable from "@/components/dashboard/products/ProductTable";
import AddProductDrawer from "@/components/dashboard/products/AddProductDrawer";

import {
  useDeleteProduct,
  useProductKPIs,
  useProducts,
  useActiveCategories
} from "@/hooks/useProducts";

import type {
  AdminProduct,
  ProductListParams,
} from "@/types/products";

export default function AdminProductsPage() {
  const [
    isAddProductOpen,
    setIsAddProductOpen,
  ] = useState(false);

  const [filters, setFilters] =
    useState<ProductListParams>({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const {
    data: productResponse,
    isLoading,
    isFetching,
  } = useProducts(filters);

  const {
    data: kpiResponse,
    isLoading: kpisLoading,
  } = useProductKPIs();

  const {
    data: categories = [],
  } = useActiveCategories();

  const deleteProduct =
    useDeleteProduct();

  const products =
    productResponse?.data ?? [];

  const pagination =
    productResponse?.pagination;

  const kpis =
    kpiResponse?.data;

  const handleDelete = async (
    product: AdminProduct,
  ) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    await deleteProduct.mutateAsync(
      product.id,
    );
  };

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    [categories],
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Catalogue
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Products
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Manage your BeautyHub catalogue,
              pricing, inventory and product
              visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsAddProductOpen(true)
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-neutral-950
              px-4
              text-sm
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-neutral-800
              focus:outline-none
              focus:ring-4
              focus:ring-neutral-200
            "
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </header>

        {/* KPIs */}
        <ProductKpiCards
          data={kpis}
          isLoading={kpisLoading}
        />

        {/* Filters */}
        <ProductFilters
          filters={filters}
          categories={categoryOptions}
          onChange={setFilters}
        />

        {/* Table */}
        <div className="relative">
          {isFetching && !isLoading && (
            <div
              className="absolute inset-x-0 top-0 z-10 h-[2px] overflow-hidden bg-neutral-100"
              aria-label="Refreshing"
              role="progressbar"
            >
              <motion.div
                className="absolute inset-y-0 w-1/3 bg-neutral-950"
                initial={{ x: "-100%" }}
                animate={{ x: "400%" }}
                transition={{
                  duration: 1.15,
                  ease: [0.4, 0, 0.2, 1],
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </div>
          )}

          {isLoading ? (
            <ProductTableSkeleton />
          ) : (
            <ProductTable
              products={products}
              onDelete={handleDelete}
            />
          )}
        </div>

        {/* Pagination */}
        {!isLoading && (
          <ProductPagination
            pagination={pagination}
            onPageChange={(page) =>
              setFilters((previous) => ({
                ...previous,
                page,
              }))
            }
          />
        )}
      </div>

      <AddProductDrawer
        open={isAddProductOpen}
        onClose={() =>
          setIsAddProductOpen(false)
        }
      />
    </>
  );
}

function ProductTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="hidden md:block">
        <div className="h-12 border-b border-neutral-100 bg-neutral-50/70" />

        {Array.from({ length: 8 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex items-center gap-6 border-b border-neutral-100 px-5 py-4"
            >
              <div className="h-11 w-11 animate-pulse rounded-xl bg-neutral-100" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-48 animate-pulse rounded bg-neutral-100" />
                <div className="h-2.5 w-24 animate-pulse rounded bg-neutral-100" />
              </div>

              <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-100" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-100" />
            </div>
          ),
        )}
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-neutral-100"
            />
          ),
        )}
      </div>
    </div>
  );
}




