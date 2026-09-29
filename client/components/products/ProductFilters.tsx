"use client";

import { Check, RotateCcw } from "lucide-react";

import {
  PRODUCT_CATEGORIES,
  PRICE_RANGES,
} from "@/constants/products";

import { ProductFilters as ProductFiltersType } from "@/types/products";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onChange: (
    updates: Partial<ProductFiltersType>
  ) => void;
  onClear: () => void;
}

export default function ProductFilters({
  filters,
  onChange,
  onClear,
}: ProductFiltersProps) {
  const selectedPriceRange =
    PRICE_RANGES.find(
      (range) =>
        ("minPrice" in range ? range.minPrice : undefined) ===
          filters.minPrice &&
        ("maxPrice" in range ? range.maxPrice : undefined) ===
          filters.maxPrice
    );

  return (
    <aside className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-950">
            Category
          </h3>

          {filters.category && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  category: undefined,
                  page: 1,
                })
              }
              className="text-xs text-neutral-400 hover:text-neutral-950"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-1">
          {PRODUCT_CATEGORIES.map(
            (category) => {
              const selected =
                filters.category ===
                category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      category: selected
                        ? undefined
                        : category.value,
                      page: 1,
                    })
                  }
                  className={[
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition",
                    selected
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                  ].join(" ")}
                >
                  <span>
                    {category.label}
                  </span>

                  {selected && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-8">
        <h3 className="mb-4 text-sm font-semibold text-neutral-950">
          Price
        </h3>

        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const selected =
              selectedPriceRange?.label ===
              range.label;

            return (
              <button
                key={range.label}
                type="button"
                onClick={() =>
                  onChange({
                    minPrice:
                      "minPrice" in range
                        ? range.minPrice
                        : undefined,
                    maxPrice:
                      "maxPrice" in range
                        ? range.maxPrice
                        : undefined,
                    page: 1,
                  })
                }
                className={[
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition",
                  selected
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                ].join(" ")}
              >
                <span>{range.label}</span>

                {selected && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(event) =>
              onChange({
                minPrice: event.target.value
                  ? Number(event.target.value)
                  : undefined,
                page: 1,
              })
            }
            className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-950"
          />

          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              onChange({
                maxPrice: event.target.value
                  ? Number(event.target.value)
                  : undefined,
                page: 1,
              })
            }
            className="h-10 w-full rounded-xl border border-neutral-200 px-3 text-sm outline-none transition focus:border-neutral-950"
          />
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-8">
        <h3 className="mb-4 text-sm font-semibold text-neutral-950">
          Availability
        </h3>

        <button
          type="button"
          onClick={() =>
            onChange({
              inStock:
                filters.inStock === true
                  ? undefined
                  : true,
              page: 1,
            })
          }
          className="flex w-full items-center justify-between text-sm text-neutral-600"
        >
          <span>In stock</span>

          <span
            className={[
              "flex h-5 w-5 items-center justify-center rounded-md border transition",
              filters.inStock
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-300",
            ].join(" ")}
          >
            {filters.inStock && (
              <Check className="h-3.5 w-3.5" />
            )}
          </span>
        </button>
      </div>

      <div className="border-t border-neutral-100 pt-8">
        <h3 className="mb-4 text-sm font-semibold text-neutral-950">
          Product standard
        </h3>

        <button
          type="button"
          onClick={() =>
            onChange({
              verificationStatus:
                filters.verificationStatus ===
                "VERIFIED"
                  ? undefined
                  : "VERIFIED",
              page: 1,
            })
          }
          className="flex w-full items-center justify-between text-sm text-neutral-600"
        >
          <span>Verified products</span>

          <span
            className={[
              "flex h-5 w-5 items-center justify-center rounded-md border transition",
              filters.verificationStatus ===
                "VERIFIED"
                ? "border-neutral-950 bg-neutral-950 text-white"
                : "border-neutral-300",
            ].join(" ")}
          >
            {filters.verificationStatus ===
              "VERIFIED" && (
              <Check className="h-3.5 w-3.5" />
            )}
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950"
      >
        <RotateCcw className="h-4 w-4" />
        Reset filters
      </button>
    </aside>
  );
}