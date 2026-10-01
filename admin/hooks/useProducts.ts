"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProduct,
  deleteProduct,
  getActiveCategories,
  getProduct,
  getProductKPIs,
  getProducts,
  updateProduct,
} from "@/services/products";

import type {
  CreateProductInput,
  ProductListParams,
  UpdateProductInput,
} from "@/types/products";

export const productKeys = {
  all: ["products"] as const,

  lists: () =>
    [...productKeys.all, "list"] as const,

  list: (params: ProductListParams) =>
    [...productKeys.lists(), params] as const,

  detail: (id: string) =>
    [...productKeys.all, "detail", id] as const,

  kpis: () =>
    [...productKeys.all, "kpis"] as const,
};

export function useProducts(
  params: ProductListParams = {},
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    staleTime: 60 * 1000,
    placeholderData: (previousData) =>
      previousData,
  });
}

export function useProduct(
  productId: string,
) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductKPIs() {
  return useQuery({
    queryKey: productKeys.kpis(),
    queryFn: getProductKPIs,
    staleTime: 60 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateProductInput,
    ) => createProduct(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.kpis(),
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductInput;
    }) =>
      updateProduct(productId, data),

    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        productKeys.detail(
          variables.productId,
        ),
        response,
      );

      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.kpis(),
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: productKeys.kpis(),
      });
    },
  });
}

export function useActiveCategories() {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: getActiveCategories,
    staleTime: 10 * 60 * 1000,
  });
}