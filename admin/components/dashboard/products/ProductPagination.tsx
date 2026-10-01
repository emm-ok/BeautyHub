"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type {
  ProductPagination as Pagination,
} from "@/types/products";

interface ProductPaginationProps {
  pagination?: Pagination;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({
  pagination,
  onPageChange,
}: ProductPaginationProps) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-neutral-400">
        Page {pagination.page} of{" "}
        {pagination.totalPages} ·{" "}
        {pagination.total.toLocaleString()} products
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={
            !pagination.hasPreviousPage
          }
          onClick={() =>
            onPageChange(
              pagination.page - 1,
            )
          }
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-lg
            border
            border-neutral-200
            bg-white
            px-3
            text-xs
            font-medium
            text-neutral-700
            transition
            hover:bg-neutral-50
            disabled:pointer-events-none
            disabled:opacity-40
          "
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>

        <button
          type="button"
          disabled={
            !pagination.hasNextPage
          }
          onClick={() =>
            onPageChange(
              pagination.page + 1,
            )
          }
          className="
            inline-flex
            h-9
            items-center
            gap-1.5
            rounded-lg
            border
            border-neutral-200
            bg-white
            px-3
            text-xs
            font-medium
            text-neutral-700
            transition
            hover:bg-neutral-50
            disabled:pointer-events-none
            disabled:opacity-40
          "
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}