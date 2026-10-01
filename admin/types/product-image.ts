export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  public_id: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImagesResponse {
  success: boolean;
  data: ProductImage[];
}

export interface ProductImageResponse {
  success: boolean;
  data: ProductImage;
}

export interface DeleteProductImageResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export interface ReorderProductImagesResponse {
  success: boolean;
  data: ProductImage[];
}