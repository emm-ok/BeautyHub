"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@clerk/nextjs";

import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart";

import {
  AddCartItemInput,
} from "@/types/cart";

export const CART_QUERY_KEY = ["cart"];

export function useCart() {
  const { isLoaded, isSignedIn, getToken } =
    useAuth();

  return useQuery({
    queryKey: CART_QUERY_KEY,

    queryFn: async () => {
      const token = await getToken();

      return getCart(token ?? undefined);
    },

    enabled: isLoaded && isSignedIn,

    staleTime: 30_000,

    retry: 1,
  });
}

export function useAddCartItem() {
  const queryClient =
    useQueryClient();

  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (
      input: AddCartItemInput
    ) => {
      const token = await getToken();

      return addCartItem(
        input,
        token ?? undefined
      );
    },

    onSuccess: (cart) => {
      queryClient.setQueryData(
        CART_QUERY_KEY,
        cart
      );
    },
  });
}

export function useUpdateCartItem() {
  const queryClient =
    useQueryClient();

  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => {
      const token = await getToken();

      return updateCartItem(
        itemId,
        { quantity },
        token ?? undefined
      );
    },

    onSuccess: (cart) => {
      queryClient.setQueryData(
        CART_QUERY_KEY,
        cart
      );
    },
  });
}

export function useRemoveCartItem() {
  const queryClient =
    useQueryClient();

  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (
      itemId: string
    ) => {
      const token = await getToken();

      return removeCartItem(
        itemId,
        token ?? undefined
      );
    },

    onSuccess: (cart) => {
      queryClient.setQueryData(
        CART_QUERY_KEY,
        cart
      );
    },
  });
}

export function useClearCart() {
  const queryClient =
    useQueryClient();

  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();

      return clearCart(
        token ?? undefined
      );
    },

    onSuccess: (cart) => {
      queryClient.setQueryData(
        CART_QUERY_KEY,
        cart
      );
    },
  });
}