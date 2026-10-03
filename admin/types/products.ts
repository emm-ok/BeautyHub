export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "OUT_OF_STOCK";

export type ProductVerificationStatus =
  | "VERIFIED"
  | "NOT_VERIFIED";

export type DiscountType =
  | "NONE"
  | "PERCENTAGE"
  | "FIXED_AMOUNT";

export interface AdminProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProductImage {
  id: string;
  url: string;
  altText: string | null;
}

export interface Product {
  id: string;

  name: string;
  slug: string;
  description: string;

  brand?: string | null;

  categoryId: string;
  category: AdminProductCategory;

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

  images: AdminProductImage[];

  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;

  price: string;
  salePrice: string;

  discountType: DiscountType;
  discountValue: string | null;

  stockQuantity: number;
  lowStockThreshold: number;

  status: ProductStatus;
  verificationStatus: ProductVerificationStatus;

  howToUse: string | null;
  keyIngredients: string | null;
  benefits: string | null;
  suitabilityNotes: string | null;
  warnings: string | null;

  size: string | null;
  unit: string | null;

  category: AdminProductCategory;

  images: AdminProductImage[];

  createdAt: string;
  updatedAt: string;
}

export interface ProductListParams {
  search?: string;
  categoryId?: string;
  category?: string;
  status?: ProductStatus;
  verificationStatus?: ProductVerificationStatus;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;

  page?: number;
  limit?: number;

  sortBy?:
    | "createdAt"
    | "name"
    | "price"
    | "salePrice"
    | "stockQuantity";

  sortOrder?: "asc" | "desc";
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
  success: boolean;
  data: AdminProduct[];
  pagination: ProductPagination;
}

export interface ProductResponse {
  success: boolean;
  data: AdminProduct;
}

export interface ProductKPIs {
  totalProducts: number;
  activeProducts: number;
  verifiedProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface ProductKPIsResponse {
  success: boolean;
  data: ProductKPIs;
}

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

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  brand?: string;
  categoryId: string;

  price: number;
  discountType: DiscountType;
  discountValue?: number | null;

  stockQuantity: number;
  lowStockThreshold?: number;

  status: ProductStatus;
  verificationStatus: ProductVerificationStatus;

  howToUse?: string;
  keyIngredients?: string;
  benefits?: string;
  suitabilityNotes?: string;
  warnings?: string;

  skinTypes: SkinType[];
  concerns: ProductConcern[];

  size?: string;
  unit?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;