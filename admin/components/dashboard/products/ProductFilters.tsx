"use client";

import {
  Filter,
  Search,
  X,
} from "lucide-react";

import type {
  ProductListParams,
} from "@/types/products";

interface ProductFiltersProps {
  filters: ProductListParams;
  categories: {
    id: string;
    name: string;
  }[];
  onChange: (
    filters: ProductListParams,
  ) => void;
}

export default function ProductFilters({
  filters,
  categories,
  onChange,
}: ProductFiltersProps) {
  const update = (
    values: Partial<ProductListParams>,
  ) => {
    onChange({
      ...filters,
      ...values,
      page: 1,
    });
  };

  const hasFilters =
    Boolean(filters.categoryId) ||
    Boolean(filters.status) ||
    Boolean(filters.verificationStatus) ||
    filters.inStock !== undefined;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

          <input
            value={filters.search ?? ""}
            onChange={(event) =>
              update({
                search: event.target.value,
              })
            }
            placeholder="Search products, brands or descriptions..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-neutral-200
              bg-neutral-50
              pl-10
              pr-4
              text-sm
              text-neutral-900
              outline-none
              transition
              placeholder:text-neutral-400
              focus:border-neutral-400
              focus:bg-white
              focus:ring-4
              focus:ring-neutral-100
            "
          />
        </div>

        {/* Category */}
        <select
          value={filters.categoryId ?? ""}
          onChange={(event) =>
            update({
              categoryId:
                event.target.value || undefined,
            })
          }
          className="
            h-11
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-3
            text-sm
            text-neutral-700
            outline-none
            focus:border-neutral-400
          "
        >
          <option value="">
            All categories
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status ?? ""}
          onChange={(event) =>
            update({
              status:
                (event.target.value ||
                  undefined) as ProductListParams["status"],
            })
          }
          className="
            h-11
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-3
            text-sm
            text-neutral-700
            outline-none
            focus:border-neutral-400
          "
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="OUT_OF_STOCK">
            Out of stock
          </option>
        </select>

        {/* Verification */}
        <select
          value={
            filters.verificationStatus ?? ""
          }
          onChange={(event) =>
            update({
              verificationStatus:
                (event.target.value ||
                  undefined) as ProductListParams["verificationStatus"],
            })
          }
          className="
            h-11
            rounded-xl
            border
            border-neutral-200
            bg-white
            px-3
            text-sm
            text-neutral-700
            outline-none
            focus:border-neutral-400
          "
        >
          <option value="">
            Verification
          </option>
          <option value="VERIFIED">
            Verified
          </option>
          <option value="NOT_VERIFIED">
            Not verified
          </option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              onChange({
                page: 1,
                limit: filters.limit,
              })
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              px-3
              text-sm
              font-medium
              text-neutral-500
              transition
              hover:bg-neutral-100
              hover:text-neutral-900
            "
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}

        {!hasFilters && (
          <div className="hidden items-center gap-2 text-xs text-neutral-400 xl:flex">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </div>
        )}
      </div>
    </div>
  );
}