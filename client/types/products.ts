export type ProductCategory =
  | "CLEANSER"
  | "SERUM"
  | "MOISTURISER"
  | "SUNSCREEN"
  | "TONER"
  | "BODY_CARE";

export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE";

export type ProductVerificationStatus =
  | "VERIFIED"
  | "NOT_VERIFIED";

export type ProductSortBy =
  | "createdAt"
  | "name"
  | "price"
  | "salePrice";

export type SortOrder = "asc" | "desc";

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
}

export interface Category {
  id: string;
  name: ProductCategory;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string | null;

  price: string | number;
  salePrice: string | number;

  status: ProductStatus;
  verificationStatus: ProductVerificationStatus;

  stockQuantity: number;
  lowStockThreshold?: number;

  size?: string | null;
  unit?: string | null;

  category: Category;

  images: ProductImage[];
}

export interface ProductFilters {
  search?: string;

  categoryId?: string;
  category?: ProductCategory;

  status?: ProductStatus;

  verificationStatus?: ProductVerificationStatus;

  minPrice?: number;
  maxPrice?: number;

  inStock?: boolean;

  page: number;
  limit: number;

  sortBy: ProductSortBy;
  sortOrder: SortOrder;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: ProductPagination;
}

export interface ProductsApiResponse {
  success: boolean;
  data: Product[];
  pagination: ProductPagination;
}