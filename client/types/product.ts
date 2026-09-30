export type ProductCategoryName =
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

export type SortOrder =
  | "asc"
  | "desc";

export type SkinType =
  | "NORMAL"
  | "DRY"
  | "OILY"
  | "COMBINATION"
  | "SENSITIVE"
  | "ALL"
  | "UNKNOWN";

export type ProductConcern =
  | "ACNE_PRONE"
  | "DARK_SPOTS"
  | "UNEVEN_SKIN_TONE"
  | "DRYNESS"
  | "OILY_SKIN"
  | "SENSITIVE_SKIN"
  | "ROUGH_SKIN"
  | "BUMPY_SKIN"
  | "BODY_ACNE"
  | "ANTI_AGING"
  | "GENERAL_SKINCARE"
  | "GENERAL_BODY_CARE";

export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
}

export interface ProductCategory {
  id: string;
  name: ProductCategoryName;
  slug: string;
  description?: string | null;
}

export interface Product {
  id: string;

  name: string;
  slug: string;
  description: string;

  brand?: string | null;

  category: ProductCategory;

  price: string | number;
  salePrice: string | number;

  discountType?: 
    | "NONE"
    | "PERCENTAGE"
    | "FIXED_AMOUNT";

  discountValue?: string | number | null;

  stockQuantity: number;
  lowStockThreshold?: number;

  status: ProductStatus;
  verificationStatus: ProductVerificationStatus;

  howToUse?: string | null;
  keyIngredients?: string | null;
  benefits?: string | null;
  suitabilityNotes?: string | null;
  warnings?: string | null;

  skinTypes?: SkinType[];
  concerns?: ProductConcern[];

  size?: string | null;
  unit?: string | null;

  images: ProductImage[];

  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  category?: ProductCategoryName;

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

export interface ProductApiResponse {
  success: boolean;
  data: Product;
}



export interface RelatedProductCategory {
  id: string;
  name: string;
}

export interface RelatedProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
}

export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;

  price: string;
  salePrice: string;

  verificationStatus: "VERIFIED" | "NOT_VERIFIED";

  category: RelatedProductCategory;

  images: RelatedProductImage[];
}

export interface RelatedProductsResponse {
  success: boolean;
  data: RelatedProduct[];
}
