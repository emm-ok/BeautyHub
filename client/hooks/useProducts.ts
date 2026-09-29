"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProducts } from "@/services/products";
import { ProductFilters } from "@/types/products";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),

    placeholderData: keepPreviousData,

    staleTime: 30_000,
  });
}