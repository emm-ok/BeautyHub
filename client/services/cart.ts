import api from "@/lib/api";

import {
  AddCartItemInput,
  Cart,
  CartApiResponse,
  UpdateCartItemInput,
} from "@/types/cart";

function authConfig(token?: string) {
  if (!token) {
    return undefined;
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getCart(
  token?: string
): Promise<Cart> {
  const response = await api.get<CartApiResponse>(
    "/cart",
    authConfig(token)
  );

  return response.data.data;
}

export async function addCartItem(
  input: AddCartItemInput,
  token?: string
): Promise<Cart> {
  const response = await api.post<CartApiResponse>(
    "/cart/items",
    input,
    authConfig(token)
  );

  return response.data.data;
}

export async function updateCartItem(
  itemId: string,
  input: UpdateCartItemInput,
  token?: string
): Promise<Cart> {
  const response = await api.patch<CartApiResponse>(
    `/cart/items/${itemId}`,
    input,
    authConfig(token)
  );

  return response.data.data;
}

export async function removeCartItem(
  itemId: string,
  token?: string
): Promise<Cart> {
  const response = await api.delete<CartApiResponse>(
    `/cart/items/${itemId}`,
    authConfig(token)
  );

  return response.data.data;
}

export async function clearCart(
  token?: string
): Promise<Cart> {
  const response = await api.delete<CartApiResponse>(
    "/cart",
    authConfig(token)
  );

  return response.data.data;
}