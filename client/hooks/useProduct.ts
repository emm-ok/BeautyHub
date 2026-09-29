"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductById } from "@/services/products";

export function useProduct(
  productId: string
) {
  return useQuery({
    queryKey: [
      "product",
      productId,
    ],

    queryFn: () =>
      getProductById(productId),

    enabled: Boolean(productId),

    staleTime: 60_000,
  });
}