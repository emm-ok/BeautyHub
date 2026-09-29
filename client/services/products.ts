
import api from "@/lib/api";
import { Product, ProductApiResponse } from "@/types/product";
import {
  ProductFilters,
  ProductsApiResponse,
  ProductsResponse,
} from "@/types/products";

export async function getProducts(
  filters: ProductFilters
): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.categoryId) {
    params.set("categoryId", filters.categoryId);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.verificationStatus) {
    params.set(
      "verificationStatus",
      filters.verificationStatus
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

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));
  params.set("sortBy", filters.sortBy);
  params.set("sortOrder", filters.sortOrder);

  const response =
    await api.get<ProductsApiResponse>(
      `/products?${params.toString()}`
    );

  return {
    products: response.data.data,
    pagination: response.data.pagination,
  };
}

export async function getProductById(
  id: string
): Promise<Product> {
  const response =
    await api.get<ProductApiResponse>(
      `/products/${id}`
    );

  return response.data.data;
}