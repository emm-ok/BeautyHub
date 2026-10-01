"use client";

import { deleteProductImage, getProductImages, reorderProductImages, setPrimaryProductImage, uploadProductImage } from "@/services/product-image";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const productImagesQueryKey = (
  productId: string,
) =>
  [
    "admin",
    "products",
    productId,
    "images",
  ] as const;

export function useProductImages(
  productId: string,
) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: productImagesQueryKey(productId),
    queryFn: async () => {
      const token = await getToken();

      const response = await getProductImages(
        productId,
        token ?? undefined,
      );

      return response.data;
    },
    enabled: Boolean(productId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUploadProductImage(
  productId: string,
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      altText,
    }: {
      file: File;
      altText: string;
    }) => {
      const token = await getToken();

      return uploadProductImage(
        productId,
        file,
        altText,
        token ?? undefined,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          productImagesQueryKey(productId),
      });
    },
  });
}


export function useDeleteProductImage(
  productId: string,
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const token = await getToken();

      return deleteProductImage(
        productId,
        imageId,
        token ?? undefined,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          productImagesQueryKey(productId),
      });
    },
  });
}

export function useSetPrimaryProductImage(
  productId: string,
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const token = await getToken();

      return setPrimaryProductImage(
        productId,
        imageId,
        token ?? undefined,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          productImagesQueryKey(productId),
      });
    },
  });
}


export function useReorderProductImages(
  productId: string,
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      imageIds: string[],
    ) => {
      const token = await getToken();

      return reorderProductImages(
        productId,
        imageIds,
        token ?? undefined,
      );
    },

    onSuccess: (response) => {
      queryClient.setQueryData(
        productImagesQueryKey(productId),
        response.data,
      );
    },
  });
}