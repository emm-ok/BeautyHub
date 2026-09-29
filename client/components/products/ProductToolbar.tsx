"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import {
  PRODUCT_SORT_OPTIONS,
} from "@/constants/products";

import {
  ProductFilters,
} from "@/types/products";

interface ProductToolbarProps {
  filters: ProductFilters;
  searchValue: string;
  resultCount: number;
  onSearchChange: (value: string) => void;
  onChange: (
    updates: Partial<ProductFilters>
  ) => void;
  onOpenFilters: () => void;
}

export default function ProductToolbar({
  filters,
  searchValue,
  resultCount,
  onSearchChange,
  onChange,
  onOpenFilters,
}: ProductToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

          <input
            type="search"
            value={searchValue}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search products, brands or ingredients..."
            className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/5"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <select
            value={`${filters.sortBy}:${filters.sortOrder}`}
            onChange={(event) => {
              const [
                sortBy,
                sortOrder,
              ] = event.target.value.split(":");

              onChange({
                sortBy:
                  sortBy as ProductFilters["sortBy"],
                sortOrder:
                  sortOrder as ProductFilters["sortOrder"],
                page: 1,
              });
            }}
            className="h-12 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 outline-none transition focus:border-neutral-950"
          >
            {PRODUCT_SORT_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-950">
            {resultCount}
          </span>{" "}
          {resultCount === 1
            ? "product"
            : "products"}
        </p>
      </div>
    </div>
  );
}