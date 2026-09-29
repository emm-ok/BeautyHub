"use client";

import { SearchX } from "lucide-react";

interface ProductEmptyStateProps {
  hasFilters: boolean;
  onClear: () => void;
}

export default function ProductEmptyState({
  hasFilters,
  onClear,
}: ProductEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
        <SearchX className="h-5 w-5 text-neutral-500" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-neutral-950">
        No products found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
        {hasFilters
          ? "Try adjusting your search or filters to find more products."
          : "There are no products available right now."}
      </p>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}