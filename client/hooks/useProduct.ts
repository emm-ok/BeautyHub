"use client";

import { useQuery } from "@tanstack/react-query";

import { getProductById, getRelatedProducts } from "@/services/products";

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

export const relatedProductsQueryKey = (
  productId: string,
  limit: number,
) => ["products", productId, "related", limit] as const;

export function useRelatedProducts(
  productId: string,
  limit = 6,
) {
  return useQuery({
    queryKey: relatedProductsQueryKey(
      productId,
      limit,
    ),

    queryFn: async () => {
      const response = await getRelatedProducts(
        productId,
        limit,
      );

      return response.data;
    },

    enabled: Boolean(productId),

    staleTime: 5 * 60 * 1000,

    gcTime: 15 * 60 * 1000,

    retry: 1,
  });
}