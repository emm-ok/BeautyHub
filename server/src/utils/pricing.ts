import { DiscountType, Prisma } from "@prisma/client";

type CalculateSalePriceInput = {
  price: number | Prisma.Decimal;
  discountType: DiscountType;
  discountValue?: number | Prisma.Decimal | null;
};

export function calculateSalePrice({
  price,
  discountType,
  discountValue,
}: CalculateSalePriceInput): Prisma.Decimal {
  const originalPrice = new Prisma.Decimal(price);

  if (
    discountType === DiscountType.NONE ||
    discountValue === null ||
    discountValue === undefined
  ) {
    return originalPrice;
  }

  const value = new Prisma.Decimal(discountValue);

  if (discountType === DiscountType.PERCENTAGE) {
    return originalPrice
      .mul(new Prisma.Decimal(100).sub(value))
      .div(100);
  }

  if (discountType === DiscountType.FIXED_AMOUNT) {
    return originalPrice.sub(value);
  }

  return originalPrice;
}