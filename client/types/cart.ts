export interface CartProductImage {
  id: string;
  url: string;
  altText: string | null;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;

  price: string | number;
  salePrice: string | number;

  stockQuantity: number;

  status:
    | "ACTIVE"
    | "INACTIVE"
    | "OUT_OF_STOCK";

  verificationStatus:
    | "VERIFIED"
    | "NOT_VERIFIED";

  size: string | null;
  unit: string | null;

  image: CartProductImage | null;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;

  product: CartProduct;

  unitPrice: string | number;
  lineTotal: string | number;

  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  totalItems: number;
  subtotal: string | number;
  deliveryFee: string | number;
  total: string | number;
  currency: string;
}

export interface Cart {
  id: string;
  userId: string;

  items: CartItem[];

  summary: CartSummary;

  createdAt: string;
  updatedAt: string;
}

export interface CartApiResponse {
  success: boolean;
  data: Cart;
  message?: string;
}

export interface AddCartItemInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}