"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import ProductGridSkeleton from "./ProductGridSkeleton";
import ProductEmptyState from "./ProductEmptyState";
import ProductPagination from "./ProductPagination";
import ProductToolbar from "./ProductToolbar";

import { useProducts } from "@/hooks/useProducts";

import {
  DEFAULT_PRODUCT_FILTERS,
} from "@/constants/products";

import {
  ProductFilters as ProductFiltersType,
} from "@/types/products";

const parseNumber = (
  value: string | null
) => {
  if (!value) return undefined;

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : undefined;
};

const parseBoolean = (
  value: string | null
) => {
  if (value === "true") return true;
  if (value === "false") return false;

  return undefined;
};

function getFiltersFromParams(
  params: URLSearchParams
): ProductFiltersType {
  return {
    ...DEFAULT_PRODUCT_FILTERS,

    search:
      params.get("search") || undefined,

    category:
      (params.get(
        "category"
      ) as ProductFiltersType["category"]) ||
      undefined,

    categoryId:
      params.get("categoryId") ||
      undefined,

    minPrice: parseNumber(
      params.get("minPrice")
    ),

    maxPrice: parseNumber(
      params.get("maxPrice")
    ),

    inStock:
      params.has("inStock")
        ? parseBoolean(
            params.get("inStock")
          )
        : DEFAULT_PRODUCT_FILTERS.inStock,

    verificationStatus:
      (params.get(
        "verificationStatus"
      ) as ProductFiltersType["verificationStatus"]) ||
      DEFAULT_PRODUCT_FILTERS.verificationStatus,

    status:
      (params.get(
        "status"
      ) as ProductFiltersType["status"]) ||
      DEFAULT_PRODUCT_FILTERS.status,

    page:
      Number(params.get("page")) ||
      DEFAULT_PRODUCT_FILTERS.page,

    limit:
      Number(params.get("limit")) ||
      DEFAULT_PRODUCT_FILTERS.limit,

    sortBy:
      (params.get(
        "sortBy"
      ) as ProductFiltersType["sortBy"]) ||
      DEFAULT_PRODUCT_FILTERS.sortBy,

    sortOrder:
      (params.get(
        "sortOrder"
      ) as ProductFiltersType["sortOrder"]) ||
      DEFAULT_PRODUCT_FILTERS.sortOrder,
  };
}

function filtersToQuery(
  filters: ProductFiltersType
) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set(
      "search",
      filters.search
    );
  }

  if (filters.category) {
    params.set(
      "category",
      filters.category
    );
  }

  if (filters.categoryId) {
    params.set(
      "categoryId",
      filters.categoryId
    );
  }

  if (filters.minPrice !== undefined) {
    params.set(
      "minPrice",
      String(filters.minPrice)
    );
  }

  if (filters.maxPrice !== undefined) {
    params.set(
      "maxPrice",
      String(filters.maxPrice)
    );
  }

  if (filters.inStock !== undefined) {
    params.set(
      "inStock",
      String(filters.inStock)
    );
  }

  if (filters.verificationStatus) {
    params.set(
      "verificationStatus",
      filters.verificationStatus
    );
  }

  if (filters.status) {
    params.set(
      "status",
      filters.status
    );
  }

  if (filters.page > 1) {
    params.set(
      "page",
      String(filters.page)
    );
  }

  if (filters.limit !== 12) {
    params.set(
      "limit",
      String(filters.limit)
    );
  }

  if (filters.sortBy !== "createdAt") {
    params.set(
      "sortBy",
      filters.sortBy
    );
  }

  if (filters.sortOrder !== "desc") {
    params.set(
      "sortOrder",
      filters.sortOrder
    );
  }

  return params;
}

export default function ProductsShell() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * URL is the single source of truth for filters.
   *
   * There is intentionally NO:
   *
   * const [filters, setFilters] = useState(...)
   *
   * This prevents the:
   *
   * URL → state → URL → state
   *
   * render/navigation loop.
   */
  const filters = useMemo(() => {
    return getFiltersFromParams(
      new URLSearchParams(
        searchParams.toString()
      )
    );
  }, [searchParams]);

  /*
   * Search input is local state because we want
   * to debounce typing before changing the URL.
   */
  const [searchValue, setSearchValue] =
    useState(
      filters.search || ""
    );

  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false);

  /*
   * Keep the search input synchronized with
   * browser back/forward navigation.
   */
  useEffect(() => {
    setSearchValue(
      filters.search || ""
    );
  }, [filters.search]);

  /*
   * Update URL when search changes.
   *
   * We compare the existing URL value before
   * navigating. This is important because
   * router.replace() itself causes a render.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed =
        searchValue.trim();

      const currentSearch =
        searchParams.get("search") || "";

      if (trimmed === currentSearch) {
        return;
      }

      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      if (trimmed) {
        params.set(
          "search",
          trimmed
        );
      } else {
        params.delete("search");
      }

      /*
       * Searching should always return
       * to the first page.
       */
      params.delete("page");

      const queryString =
        params.toString();

      router.replace(
        queryString
          ? `${pathname}?${queryString}`
          : pathname,
        {
          scroll: false,
        }
      );
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    searchValue,
    searchParams,
    pathname,
    router,
  ]);

  /*
   * Update filters directly in the URL.
   *
   * No React filter state is involved.
   */
  const updateFilters = useCallback(
    (
      updates: Partial<ProductFiltersType>
    ) => {
      const nextFilters: ProductFiltersType = {
        ...filters,
        ...updates,
      };

      const params =
        filtersToQuery(nextFilters);

      const nextQuery =
        params.toString();

      const currentQuery =
        searchParams.toString();

      /*
       * Do nothing if the URL is already
       * representing the requested filters.
       */
      if (nextQuery === currentQuery) {
        return;
      }

      router.replace(
        nextQuery
          ? `${pathname}?${nextQuery}`
          : pathname,
        {
          scroll: false,
        }
      );
    },
    [
      filters,
      searchParams,
      pathname,
      router,
    ]
  );

  /*
   * Reset filters by replacing the URL with
   * the default public catalogue state.
   */
  const clearFilters = useCallback(() => {
    const clearedFilters: ProductFiltersType = {
      ...DEFAULT_PRODUCT_FILTERS,

      search: undefined,
      category: undefined,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
    };

    const params =
      filtersToQuery(clearedFilters);

    const queryString =
      params.toString();

    router.replace(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      }
    );

    setSearchValue("");
    setMobileFiltersOpen(false);
  }, [
    pathname,
    router,
  ]);

  /*
   * React Query now receives a stable,
   * memoized filters object derived from the URL.
   */
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useProducts(filters);

  const hasFilters = Boolean(
    filters.search ||
      filters.category ||
      filters.categoryId ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
  );

  return (
    <main className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              BeautyHub Store
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              Find products that fit your routine.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
              Explore verified beauty and personal-care
              products selected to make finding what you
              need simpler.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Desktop filters */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <div className="mb-6 flex items-center gap-2">
                <Filter className="h-4 w-4" />

                <h2 className="text-sm font-semibold text-neutral-950">
                  Filters
                </h2>
              </div>

              <ProductFilters
                filters={filters}
                onChange={updateFilters}
                onClear={clearFilters}
              />
            </div>
          </div>

          {/* Main catalogue */}
          <div className="min-w-0">
            <ProductToolbar
              filters={filters}
              searchValue={searchValue}
              resultCount={
                data?.pagination.total ?? 0
              }
              onSearchChange={
                setSearchValue
              }
              onChange={updateFilters}
              onOpenFilters={() =>
                setMobileFiltersOpen(true)
              }
            />

            {/* Fetching indicator */}
            <AnimatePresence>
              {isFetching &&
                !isLoading && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="mt-4 flex items-center gap-2 text-xs text-neutral-400"
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neutral-400" />

                    Updating products...
                  </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-6">
              {isLoading ? (
                <ProductGridSkeleton />
              ) : isError ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center">
                  <h2 className="text-lg font-semibold text-red-950">
                    We couldn&apos;t load the
                    catalogue
                  </h2>

                  <p className="mt-2 text-sm text-red-700">
                    Please try again.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      refetch()
                    }
                    className="mt-5 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
                  >
                    Try again
                  </button>
                </div>
              ) : data?.products.length ? (
                <>
                  <ProductGrid
                    products={data.products}
                  />

                  <ProductPagination
                    page={
                      data.pagination.page
                    }
                    totalPages={
                      data.pagination.totalPages
                    }
                    hasNextPage={
                      data.pagination.hasNextPage
                    }
                    hasPreviousPage={
                      data.pagination.hasPreviousPage
                    }
                    onPageChange={(page) =>
                      updateFilters({
                        page,
                      })
                    }
                  />
                </>
              ) : (
                <ProductEmptyState
                  hasFilters={hasFilters}
                  onClear={clearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
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
                setMobileFiltersOpen(false)
              }
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 280,
              }}
              className="fixed inset-y-0 right-0 z-50 w-[min(90vw,380px)] overflow-y-auto bg-white p-6 shadow-2xl lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-neutral-400">
                    Catalogue
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-neutral-950">
                    Filters
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(false)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                onChange={updateFilters}
                onClear={clearFilters}
              />

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="mt-8 w-full rounded-xl bg-neutral-950 py-3 text-sm font-medium text-white"
              >
                View products
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}