import api from "@/lib/api";

import type {
  CreateProductInput,
  ProductKPIsResponse,
  ProductListParams,
  ProductResponse,
  ProductsResponse,
  UpdateProductInput,
} from "@/types/products";

export async function getProducts(
  params: ProductListParams = {},
): Promise<ProductsResponse> {
  const response =
    await api.get<ProductsResponse>(
      `/products`,
      {
        params,
      },
    );

  return response.data;
}

export async function getProduct(
  productId: string,
): Promise<ProductResponse> {
  const response =
    await api.get<ProductResponse>(
      `/products/${productId}`,
    );

  return response.data;
}

export async function createProduct(
  data: CreateProductInput,
): Promise<ProductResponse> {
  const response =
    await api.post<ProductResponse>(
      `/products`,
      data,
    );

  return response.data;
}

export async function updateProduct(
  productId: string,
  data: UpdateProductInput,
): Promise<ProductResponse> {
  const response =
    await api.patch<ProductResponse>(
      `/products/${productId}`,
      data,
    );

  return response.data;
}

export async function deleteProduct(
  productId: string,
) {
  const response = await api.delete(
    `/products/${productId}`,
  );

  return response.data;
}

export async function getProductKPIs(): Promise<ProductKPIsResponse> {
  const response =
    await api.get<ProductKPIsResponse>(
      `/dashboard/products/kpis`,
    );

  return response.data;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

interface CategoriesResponse {
  success: boolean;
  data: ProductCategory[];
}

export async function getActiveCategories(): Promise<ProductCategory[]> {
  const response =
    await api.get<CategoriesResponse>(
      `/products/categories`,
      {
        params: {
          active: true,
        },
      },
    );

  return response.data.data;
}