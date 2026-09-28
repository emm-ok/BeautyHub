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

export type SkinType =
  | "NORMAL"
  | "DRY"
  | "OILY"
  | "COMBINATION"
  | "SENSITIVE"
  | "ALL"
  | "UNKNOWN";

export type ProductCategory =
  | "CLEANSER"
  | "SERUM"
  | "MOISTURISER"
  | "SUNSCREEN"
  | "TONER"
  | "BODY_CARE";

export interface DiscoveryState {
  concerns: ProductConcern[];
  skinType?: SkinType;
  category?: ProductCategory;
  maxBudget?: number;
}

export interface ProductDiscoveryPayload {
  concerns: ProductConcern[];
  skinType?: SkinType;
  category?: ProductCategory;
  maxBudget?: number;
  verifiedOnly: boolean;
  inStockOnly: boolean;
  page: number;
  limit: number;
}

export interface DiscoveryProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface DiscoveryProductCategory {
  id: string;
  name: ProductCategory;
  slug: string;
}

export interface DiscoveryProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string | null;

  price: string | number;
  salePrice: string | number;

  status: string;
  verificationStatus: "VERIFIED" | "NOT_VERIFIED";

  size?: string | null;
  unit?: string | null;

  category: DiscoveryProductCategory;

  images: DiscoveryProductImage[];
}

export interface DiscoveryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductDiscoveryResponse {
  products: DiscoveryProduct[];
  pagination: DiscoveryPagination;
}