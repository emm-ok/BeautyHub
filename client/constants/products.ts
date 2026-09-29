import {
  ProductCategory,
  ProductFilters,
  ProductSortBy,
  SortOrder,
} from "@/types/products";

export const PRODUCT_CATEGORIES: {
  value: ProductCategory;
  label: string;
}[] = [
  {
    value: "CLEANSER",
    label: "Cleansers",
  },
  {
    value: "SERUM",
    label: "Serums",
  },
  {
    value: "MOISTURISER",
    label: "Moisturisers",
  },
  {
    value: "SUNSCREEN",
    label: "Sunscreens",
  },
  {
    value: "TONER",
    label: "Toners",
  },
  {
    value: "BODY_CARE",
    label: "Body Care",
  },
];

export const PRICE_RANGES = [
  {
    label: "Under ₦10,000",
    maxPrice: 10000,
  },
  {
    label: "₦10,000 – ₦20,000",
    minPrice: 10000,
    maxPrice: 20000,
  },
  {
    label: "₦20,000 – ₦30,000",
    minPrice: 20000,
    maxPrice: 30000,
  },
  {
    label: "₦30,000+",
    minPrice: 30000,
  },
] as const;

export const PRODUCT_SORT_OPTIONS: {
  value: `${ProductSortBy}:${SortOrder}`;
  label: string;
}[] = [
  {
    value: "createdAt:desc",
    label: "Newest",
  },
  {
    value: "name:asc",
    label: "Name: A–Z",
  },
  {
    value: "salePrice:asc",
    label: "Price: Low to High",
  },
  {
    value: "salePrice:desc",
    label: "Price: High to Low",
  },
];

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  page: 1,
  limit: 12,
  sortBy: "createdAt",
  sortOrder: "desc",

  // Public catalogue defaults.
  status: "ACTIVE",
  verificationStatus: "VERIFIED",
  inStock: true,
};