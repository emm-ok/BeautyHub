import api from "@/lib/api";
import type {
  DeleteProductImageResponse,
  ProductImageResponse,
  ProductImagesResponse,
  ReorderProductImagesResponse,
} from "@/types/product-image";

function getUrl(productId: string) {
  return `/products/${productId}/images`;
}

export async function getProductImages(
  productId: string,
  token?: string,
): Promise<ProductImagesResponse> {
  const response =
    await api.get<ProductImagesResponse>(
      getUrl(productId),
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

  return response.data;
}

export async function uploadProductImage(
  productId: string,
  file: File,
  altText: string,
  token?: string,
): Promise<ProductImageResponse> {
  const formData = new FormData();

  formData.append("image", file);

  if (altText.trim()) {
    formData.append("altText", altText.trim());
  }

  const response =
    await api.post<ProductImageResponse>(
      getUrl(productId),
      formData,
      {
        headers: {
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      },
    );

  return response.data;
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
  token?: string,
): Promise<DeleteProductImageResponse> {
  const response =
    await api.delete<DeleteProductImageResponse>(
      `${getUrl(productId)}/${imageId}`,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

  return response.data;
}

export async function setPrimaryProductImage(
  productId: string,
  imageId: string,
  token?: string,
): Promise<ProductImageResponse> {
  const response =
    await api.patch<ProductImageResponse>(
      `${getUrl(productId)}/${imageId}/primary`,
      {},
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

  return response.data;
}

export async function reorderProductImages(
  productId: string,
  imageIds: string[],
  token?: string,
): Promise<ReorderProductImagesResponse> {
  const response =
    await api.patch<ReorderProductImagesResponse>(
      `${getUrl(productId)}/reorder`,
      { imageIds },
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      },
    );

  return response.data;
}