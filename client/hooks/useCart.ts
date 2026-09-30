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

import type {
  AddCartItemInput,
  Cart,
} from "@/types/cart";

export const CART_QUERY_KEY = ["cart"] as const;

type UpdateCartItemInput = {
  itemId: string;
  quantity: number;
};

type MutationContext = {
  previousCart?: Cart;
};

/**
 * The cart cache is the single source of truth for the UI.
 *
 * Mutations optimistically update this cache first.
 * The server remains authoritative and the cart is
 * reconciled after the final pending mutation settles.
 */
function invalidateCartWhenSettled(
  queryClient: ReturnType<typeof useQueryClient>
) {
  /**
   * If multiple cart mutations are happening at the same time,
   * don't refetch after the first one finishes.
   *
   * Otherwise an older server response could overwrite a newer
   * optimistic UI state.
   *
   * Only reconcile when this is the final pending mutation.
   */
  if (queryClient.isMutating() === 1) {
    queryClient.invalidateQueries({
      queryKey: CART_QUERY_KEY,
    });
  }
}

export function useCart() {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

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

// Add to cart                                                                */

export function useAddCartItem() {
  const queryClient = useQueryClient();
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

    onMutate: async (input): Promise<MutationContext> => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });

      const previousCart =
        queryClient.getQueryData<Cart>(
          CART_QUERY_KEY
        );

      queryClient.setQueryData<Cart>(
        CART_QUERY_KEY,
        (currentCart) => {
          /**
           * If the cart hasn't been fetched yet,
           * don't manufacture an incomplete cart.
           *
           * The server response will populate it.
           */
          if (!currentCart) {
            return currentCart;
          }

          const existingItem =
            currentCart.items.find(
              (item) =>
                item.product.id ===
                input.productId
            );

          if (existingItem) {
            const nextQuantity =
              Math.min(
                existingItem.quantity +
                  input.quantity,
                Math.max(
                  existingItem.product
                    .stockQuantity,
                  1
                )
              );

            const quantityDifference =
              nextQuantity -
              existingItem.quantity;

            if (quantityDifference <= 0) {
              return currentCart;
            }

            return {
              ...currentCart,

              items: currentCart.items.map(
                (item) =>
                  item.id ===
                  existingItem.id
                    ? {
                        ...item,

                        quantity:
                          nextQuantity,

                        lineTotal:
                          Number(
                            item.unitPrice
                          ) *
                          nextQuantity,
                      }
                    : item
              ),

              summary: {
                ...currentCart.summary,

                totalItems:
                  currentCart.summary
                    .totalItems +
                  quantityDifference,

                subtotal:
                  Number(
                    currentCart.summary
                      .subtotal
                  ) +
                  Number(
                    itemPrice(
                      existingItem.unitPrice
                    )
                  ) *
                    quantityDifference,
              },
            };
          }

          /**
           * We cannot safely create a complete new
           * CartItem here without all server-generated
           * fields.
           *
           * Instead, preserve the existing cache and let
           * the server response reconcile the new item.
           *
           * The product-page button still gets immediate
           * feedback through the optimistic pending-product
           * state handled by ProductPurchasePanel.
           */
          return currentCart;
        }
      );

      return {
        previousCart,
      };
    },

    onError: () => {
      /**
       * We intentionally don't restore the old snapshot here.
       *
       * Multiple optimistic cart mutations can be in flight.
       * Restoring an old snapshot could remove a later valid
       * optimistic change.
       *
       * The final reconciliation fetch below is authoritative.
       */
    },

    onSettled: () => {
      invalidateCartWhenSettled(queryClient);
    },
  });
}

// Update quantity                                                            */

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: UpdateCartItemInput) => {
      const token = await getToken();

      return updateCartItem(
        itemId,
        { quantity },
        token ?? undefined
      );
    },

    onMutate: async ({
      itemId,
      quantity,
    }) => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });

      queryClient.setQueryData<Cart>(
        CART_QUERY_KEY,
        (currentCart) => {
          if (!currentCart) {
            return currentCart;
          }

          const targetItem =
            currentCart.items.find(
              (item) =>
                item.id === itemId
            );

          if (!targetItem) {
            return currentCart;
          }

          const safeQuantity = Math.max(
            1,
            Math.min(
              quantity,
              Math.max(
                targetItem.product
                  .stockQuantity,
                1
              )
            )
          );

          const quantityDifference =
            safeQuantity -
            targetItem.quantity;

          if (
            quantityDifference === 0
          ) {
            return currentCart;
          }

          const unitPrice = Number(
            targetItem.unitPrice
          );

          return {
            ...currentCart,

            items: currentCart.items.map(
              (item) =>
                item.id === itemId
                  ? {
                      ...item,

                      quantity:
                        safeQuantity,

                      lineTotal:
                        unitPrice *
                        safeQuantity,
                    }
                  : item
            ),

            summary: {
              ...currentCart.summary,

              totalItems:
                currentCart.summary
                  .totalItems +
                quantityDifference,

              subtotal:
                Number(
                  currentCart.summary
                    .subtotal
                ) +
                unitPrice *
                  quantityDifference,
            },
          };
        }
      );
    },

    onError: () => {
      /**
       * Reconciliation is handled after
       * the final mutation settles.
       */
    },

    onSettled: () => {
      invalidateCartWhenSettled(queryClient);
    },
  });
}

// Remove item                                                                */

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
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

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });

      queryClient.setQueryData<Cart>(
        CART_QUERY_KEY,
        (currentCart) => {
          if (!currentCart) {
            return currentCart;
          }

          const removedItem =
            currentCart.items.find(
              (item) =>
                item.id === itemId
            );

          if (!removedItem) {
            return currentCart;
          }

          return {
            ...currentCart,

            items: currentCart.items.filter(
              (item) =>
                item.id !== itemId
            ),

            summary: {
              ...currentCart.summary,

              totalItems:
                Math.max(
                  0,
                  currentCart.summary
                    .totalItems -
                    removedItem.quantity
                ),

              subtotal:
                Math.max(
                  0,
                  Number(
                    currentCart.summary
                      .subtotal
                  ) -
                    Number(
                      removedItem.lineTotal
                    )
                ),
            },
          };
        }
      );
    },

    onSettled: () => {
      invalidateCartWhenSettled(queryClient);
    },
  });
}

// Clear cart                                                                 */

export function useClearCart() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const token = await getToken();

      return clearCart(
        token ?? undefined
      );
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: CART_QUERY_KEY,
      });

      queryClient.setQueryData<Cart>(
        CART_QUERY_KEY,
        (currentCart) => {
          if (!currentCart) {
            return currentCart;
          }

          return {
            ...currentCart,

            items: [],

            summary: {
              ...currentCart.summary,
              totalItems: 0,
              subtotal: 0,
            },
          };
        }
      );
    },

    onSettled: () => {
      invalidateCartWhenSettled(queryClient);
    },
  });
}

// Helpers                                                                    */

function itemPrice(
  value: string | number
) {
  return Number(value);
}