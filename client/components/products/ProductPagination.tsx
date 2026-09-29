"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: ProductPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (pageNumber) =>
      pageNumber === 1 ||
      pageNumber === totalPages ||
      Math.abs(pageNumber - page) <= 1
  );

  return (
    <div className="mt-12 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((pageNumber, index) => {
        const previousPage = pages[index - 1];

        const hasGap =
          previousPage &&
          pageNumber - previousPage > 1;

        return (
          <div
            key={pageNumber}
            className="flex items-center"
          >
            {hasGap && (
              <span className="px-2 text-sm text-neutral-400">
                …
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                onPageChange(pageNumber)
              }
              className={[
                "h-10 min-w-10 rounded-xl px-3 text-sm font-medium transition",
                pageNumber === page
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
              ].join(" ")}
            >
              {pageNumber}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}