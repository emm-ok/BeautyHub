import "dotenv/config";

import {
  PrismaClient,
  DiscountType,
  ProductCategory,
  ProductConcern,
  ProductStatus,
  ProductVerificationStatus,
  SkinType,
} from "@prisma/client";
import {prisma } from "../src/lib/prisma.js";

const categories = [
  {
    name: ProductCategory.CLEANSER,
    slug: "cleansers",
    description: "Facial cleansers for different skin types and concerns.",
  },
  {
    name: ProductCategory.SERUM,
    slug: "serums",
    description: "Targeted skincare serums for common skin concerns.",
  },
  {
    name: ProductCategory.MOISTURISER,
    slug: "moisturisers",
    description: "Moisturisers for hydration and skin barrier support.",
  },
  {
    name: ProductCategory.SUNSCREEN,
    slug: "sunscreens",
    description: "Daily sun protection for different skin types.",
  },
  {
    name: ProductCategory.TONER,
    slug: "toners",
    description: "Toners for preparing and balancing the skin.",
  },
  {
    name: ProductCategory.BODY_CARE,
    slug: "body-care",
    description: "Body care products for healthy, smooth skin.",
  },
];

const products = [
  {
    name: "CeraGlow Gentle Hydrating Cleanser",
    slug: "ceraglow-gentle-hydrating-cleanser",
    description:
      "A gentle daily cleanser designed to remove impurities without stripping the skin.",
    brand: "CeraGlow",
    category: ProductCategory.CLEANSER,
    price: 12000,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    stockQuantity: 35,
    skinTypes: [SkinType.DRY, SkinType.NORMAL, SkinType.SENSITIVE],
    concerns: [ProductConcern.DRYNESS, ProductConcern.SENSITIVE_SKIN],
    size: "200",
    unit: "ml",
    howToUse:
      "Massage onto damp skin for 30 to 60 seconds and rinse thoroughly.",
    keyIngredients: "Ceramides, Glycerin, Panthenol",
    benefits: "Cleanses gently while helping maintain skin moisture.",
    suitabilityNotes:
      "Suitable for dry, normal and sensitive skin.",
    warnings: "For external use only.",
  },

  {
    name: "ClearBalance Acne Control Cleanser",
    slug: "clearbalance-acne-control-cleanser",
    description:
      "A clarifying cleanser formulated for oily and acne-prone skin.",
    brand: "ClearBalance",
    category: ProductCategory.CLEANSER,
    price: 14500,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 28,
    skinTypes: [SkinType.OILY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.ACNE_PRONE,
      ProductConcern.OILY_SKIN,
      ProductConcern.BUMPY_SKIN,
    ],
    size: "150",
    unit: "ml",
    howToUse:
      "Apply to wet skin, gently massage and rinse. Use once or twice daily.",
    keyIngredients: "Salicylic Acid, Niacinamide, Zinc",
    benefits:
      "Helps remove excess oil and supports clearer-looking skin.",
    suitabilityNotes:
      "Best suited to oily and combination skin.",
    warnings:
      "Introduce gradually if your skin is sensitive.",
  },

  {
    name: "GlowTheory Brightening Serum",
    slug: "glowtheory-brightening-serum",
    description:
      "A lightweight serum formulated to improve the appearance of dark spots and uneven tone.",
    brand: "GlowTheory",
    category: ProductCategory.SERUM,
    price: 22000,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 15,
    stockQuantity: 24,
    skinTypes: [SkinType.NORMAL, SkinType.DRY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.DARK_SPOTS,
      ProductConcern.UNEVEN_SKIN_TONE,
    ],
    size: "30",
    unit: "ml",
    howToUse:
      "Apply a few drops to clean skin before moisturiser.",
    keyIngredients: "Niacinamide, Alpha Arbutin, Licorice Extract",
    benefits:
      "Helps improve the appearance of pigmentation and uneven tone.",
    suitabilityNotes:
      "Suitable for normal, dry and combination skin.",
    warnings:
      "Use sunscreen during the day.",
  },

  {
    name: "PureSkin Blemish Repair Serum",
    slug: "pureskin-blemish-repair-serum",
    description:
      "A targeted serum designed to support acne-prone skin and reduce the appearance of blemishes.",
    brand: "PureSkin",
    category: ProductCategory.SERUM,
    price: 18500,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 31,
    skinTypes: [SkinType.OILY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.ACNE_PRONE,
      ProductConcern.DARK_SPOTS,
      ProductConcern.OILY_SKIN,
    ],
    size: "30",
    unit: "ml",
    howToUse:
      "Apply two to three drops to clean, dry skin once daily.",
    keyIngredients: "Niacinamide, Salicylic Acid, Zinc PCA",
    benefits:
      "Supports clearer-looking skin and helps control excess oil.",
    suitabilityNotes:
      "Designed for oily and combination skin.",
    warnings:
      "Do not combine with multiple strong exfoliating products.",
  },

  {
    name: "DermaBloom Hydration Serum",
    slug: "dermabloom-hydration-serum",
    description:
      "A lightweight hydration serum designed for dry and dehydrated-looking skin.",
    brand: "DermaBloom",
    category: ProductCategory.SERUM,
    price: 16500,
    discountType: DiscountType.FIXED_AMOUNT,
    discountValue: 2500,
    stockQuantity: 19,
    skinTypes: [SkinType.DRY, SkinType.NORMAL, SkinType.SENSITIVE],
    concerns: [
      ProductConcern.DRYNESS,
      ProductConcern.SENSITIVE_SKIN,
    ],
    size: "30",
    unit: "ml",
    howToUse:
      "Apply to clean skin morning and evening before moisturiser.",
    keyIngredients: "Hyaluronic Acid, Glycerin, Panthenol",
    benefits:
      "Helps replenish moisture and improve the feel of dry skin.",
    suitabilityNotes:
      "Suitable for dry, normal and sensitive skin.",
    warnings: "For external use only.",
  },

  {
    name: "EvenTone Vitamin C Serum",
    slug: "eventone-vitamin-c-serum",
    description:
      "A daily antioxidant serum designed to brighten dull-looking skin and support a more even tone.",
    brand: "EvenTone",
    category: ProductCategory.SERUM,
    price: 25000,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    stockQuantity: 22,
    skinTypes: [SkinType.NORMAL, SkinType.COMBINATION, SkinType.OILY],
    concerns: [
      ProductConcern.DARK_SPOTS,
      ProductConcern.UNEVEN_SKIN_TONE,
      ProductConcern.GENERAL_SKINCARE,
    ],
    size: "30",
    unit: "ml",
    howToUse:
      "Apply a small amount after cleansing and before moisturiser.",
    keyIngredients: "Vitamin C, Ferulic Acid, Vitamin E",
    benefits:
      "Helps improve dullness and the appearance of uneven tone.",
    suitabilityNotes:
      "Suitable for normal, combination and oily skin.",
    warnings:
      "Store away from direct sunlight.",
  },

  {
    name: "SoftBarrier Daily Moisturiser",
    slug: "softbarrier-daily-moisturiser",
    description:
      "A barrier-supporting moisturiser for everyday hydration and comfort.",
    brand: "SoftBarrier",
    category: ProductCategory.MOISTURISER,
    price: 13500,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 40,
    skinTypes: [SkinType.DRY, SkinType.NORMAL, SkinType.SENSITIVE],
    concerns: [
      ProductConcern.DRYNESS,
      ProductConcern.SENSITIVE_SKIN,
    ],
    size: "100",
    unit: "ml",
    howToUse:
      "Apply evenly to clean skin morning and evening.",
    keyIngredients: "Ceramides, Squalane, Glycerin",
    benefits:
      "Provides lasting hydration and supports the skin barrier.",
    suitabilityNotes:
      "Ideal for normal to dry and sensitive skin.",
    warnings: "For external use only.",
  },

  {
    name: "OilControl Lightweight Gel Moisturiser",
    slug: "oilcontrol-lightweight-gel-moisturiser",
    description:
      "A lightweight gel moisturiser designed for oily and combination skin.",
    brand: "OilControl",
    category: ProductCategory.MOISTURISER,
    price: 15000,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 12,
    stockQuantity: 27,
    skinTypes: [SkinType.OILY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.OILY_SKIN,
      ProductConcern.ACNE_PRONE,
    ],
    size: "75",
    unit: "ml",
    howToUse:
      "Apply a thin layer to clean skin morning and evening.",
    keyIngredients: "Niacinamide, Hyaluronic Acid, Green Tea",
    benefits:
      "Hydrates without leaving a heavy or greasy finish.",
    suitabilityNotes:
      "Suitable for oily and combination skin.",
    warnings: "Stop use if irritation occurs.",
  },

  {
    name: "CalmSkin Recovery Moisturiser",
    slug: "calmskin-recovery-moisturiser",
    description:
      "A soothing moisturiser formulated to support sensitive and dry skin.",
    brand: "CalmSkin",
    category: ProductCategory.MOISTURISER,
    price: 19500,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 16,
    skinTypes: [SkinType.SENSITIVE, SkinType.DRY],
    concerns: [
      ProductConcern.SENSITIVE_SKIN,
      ProductConcern.DRYNESS,
    ],
    size: "100",
    unit: "ml",
    howToUse:
      "Apply after cleansing and treatment products.",
    keyIngredients: "Ceramides, Centella Asiatica, Panthenol",
    benefits:
      "Helps soothe and moisturise dry or sensitive-feeling skin.",
    suitabilityNotes:
      "Best suited to dry and sensitive skin.",
    warnings: "For external use only.",
  },

  {
    name: "DailyShield SPF 50 Fluid",
    slug: "dailyshield-spf-50-fluid",
    description:
      "A lightweight broad-spectrum sunscreen designed for daily use.",
    brand: "DailyShield",
    category: ProductCategory.SUNSCREEN,
    price: 18000,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 50,
    skinTypes: [
      SkinType.NORMAL,
      SkinType.DRY,
      SkinType.OILY,
      SkinType.COMBINATION,
      SkinType.SENSITIVE,
    ],
    concerns: [
      ProductConcern.DARK_SPOTS,
      ProductConcern.UNEVEN_SKIN_TONE,
      ProductConcern.GENERAL_SKINCARE,
    ],
    size: "50",
    unit: "ml",
    howToUse:
      "Apply generously as the last step of your morning skincare routine.",
    keyIngredients: "Modern UV Filters, Vitamin E, Glycerin",
    benefits:
      "Provides daily UV protection with a lightweight finish.",
    suitabilityNotes:
      "Suitable for most skin types.",
    warnings:
      "Reapply regularly during prolonged outdoor exposure.",
  },

  {
    name: "MatteGuard Oil Control SPF 50",
    slug: "matteguard-oil-control-spf-50",
    description:
      "A lightweight sunscreen with a comfortable finish for oily and combination skin.",
    brand: "MatteGuard",
    category: ProductCategory.SUNSCREEN,
    price: 21000,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 8,
    stockQuantity: 34,
    skinTypes: [SkinType.OILY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.OILY_SKIN,
      ProductConcern.ACNE_PRONE,
      ProductConcern.DARK_SPOTS,
    ],
    size: "50",
    unit: "ml",
    howToUse:
      "Apply generously as the final morning skincare step.",
    keyIngredients: "UV Filters, Niacinamide, Vitamin E",
    benefits:
      "Protects against UV exposure while helping maintain a comfortable finish.",
    suitabilityNotes:
      "Best suited to oily and combination skin.",
    warnings:
      "Reapply after sweating or extended outdoor exposure.",
  },

  {
    name: "SensitiveShield Mineral SPF 50",
    slug: "sensitiveshield-mineral-spf-50",
    description:
      "A gentle mineral sunscreen formulated for sensitive skin.",
    brand: "SensitiveShield",
    category: ProductCategory.SUNSCREEN,
    price: 23500,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 14,
    skinTypes: [SkinType.SENSITIVE, SkinType.DRY],
    concerns: [
      ProductConcern.SENSITIVE_SKIN,
      ProductConcern.DRYNESS,
      ProductConcern.DARK_SPOTS,
    ],
    size: "50",
    unit: "ml",
    howToUse:
      "Apply evenly to face and exposed skin before sun exposure.",
    keyIngredients: "Zinc Oxide, Vitamin E, Squalane",
    benefits:
      "Provides mineral sun protection while supporting dry and sensitive skin.",
    suitabilityNotes:
      "Designed for sensitive and dry skin.",
    warnings: "Reapply as needed.",
  },

  {
    name: "BalancePrep Hydrating Toner",
    slug: "balanceprep-hydrating-toner",
    description:
      "A hydrating toner designed to refresh skin and prepare it for the rest of your routine.",
    brand: "BalancePrep",
    category: ProductCategory.TONER,
    price: 11000,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    stockQuantity: 30,
    skinTypes: [SkinType.NORMAL, SkinType.DRY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.DRYNESS,
      ProductConcern.UNEVEN_SKIN_TONE,
      ProductConcern.GENERAL_SKINCARE,
    ],
    size: "200",
    unit: "ml",
    howToUse:
      "Apply to clean skin using your hands or a cotton pad.",
    keyIngredients: "Glycerin, Panthenol, Aloe Vera",
    benefits:
      "Refreshes skin and provides lightweight hydration.",
    suitabilityNotes:
      "Suitable for normal, dry and combination skin.",
    warnings: "For external use only.",
  },

  {
    name: "ClearTone Balancing Toner",
    slug: "cleartone-balancing-toner",
    description:
      "A balancing toner for oily and blemish-prone skin.",
    brand: "ClearTone",
    category: ProductCategory.TONER,
    price: 12500,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 25,
    skinTypes: [SkinType.OILY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.ACNE_PRONE,
      ProductConcern.OILY_SKIN,
      ProductConcern.BUMPY_SKIN,
    ],
    size: "200",
    unit: "ml",
    howToUse:
      "Apply after cleansing and before serum or moisturiser.",
    keyIngredients: "Niacinamide, Zinc, Green Tea",
    benefits:
      "Helps balance excess oil and refresh blemish-prone skin.",
    suitabilityNotes:
      "Suitable for oily and combination skin.",
    warnings:
      "Patch test before regular use.",
  },

  {
    name: "SmoothBody AHA Body Lotion",
    slug: "smoothbody-aha-body-lotion",
    description:
      "A smoothing body lotion designed to improve the appearance of rough and uneven body skin.",
    brand: "SmoothBody",
    category: ProductCategory.BODY_CARE,
    price: 16000,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 15,
    stockQuantity: 29,
    skinTypes: [
      SkinType.NORMAL,
      SkinType.DRY,
      SkinType.COMBINATION,
    ],
    concerns: [
      ProductConcern.ROUGH_SKIN,
      ProductConcern.BUMPY_SKIN,
      ProductConcern.DRYNESS,
    ],
    size: "250",
    unit: "ml",
    howToUse:
      "Apply evenly to clean body skin once daily.",
    keyIngredients: "Lactic Acid, Urea, Glycerin",
    benefits:
      "Helps smooth rough texture and improve body skin hydration.",
    suitabilityNotes:
      "Suitable for normal, dry and combination skin.",
    warnings:
      "Avoid applying to broken or irritated skin.",
  },

  {
    name: "BodyClear Acne Wash",
    slug: "bodyclear-acne-wash",
    description:
      "A cleansing body wash formulated for body breakouts and excess oil.",
    brand: "BodyClear",
    category: ProductCategory.BODY_CARE,
    price: 14000,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 21,
    skinTypes: [SkinType.OILY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.BODY_ACNE,
      ProductConcern.OILY_SKIN,
      ProductConcern.BUMPY_SKIN,
    ],
    size: "250",
    unit: "ml",
    howToUse:
      "Massage onto wet skin, leave briefly and rinse thoroughly.",
    keyIngredients: "Salicylic Acid, Niacinamide, Zinc",
    benefits:
      "Helps cleanse excess oil and support clearer-looking body skin.",
    suitabilityNotes:
      "Suitable for oily and combination body skin.",
    warnings:
      "Avoid contact with eyes.",
  },

  {
    name: "EvenBody Brightening Lotion",
    slug: "evenbody-brightening-lotion",
    description:
      "A daily body lotion designed to improve the appearance of uneven tone and dark marks.",
    brand: "EvenBody",
    category: ProductCategory.BODY_CARE,
    price: 17500,
    discountType: DiscountType.FIXED_AMOUNT,
    discountValue: 2000,
    stockQuantity: 18,
    skinTypes: [SkinType.NORMAL, SkinType.DRY],
    concerns: [
      ProductConcern.DARK_SPOTS,
      ProductConcern.UNEVEN_SKIN_TONE,
      ProductConcern.DRYNESS,
    ],
    size: "300",
    unit: "ml",
    howToUse:
      "Apply generously to clean body skin once or twice daily.",
    keyIngredients: "Niacinamide, Alpha Arbutin, Shea Butter",
    benefits:
      "Helps improve the appearance of uneven body tone while moisturising.",
    suitabilityNotes:
      "Suitable for normal and dry skin.",
    warnings:
      "Use sunscreen on exposed skin during the day.",
  },

  {
    name: "RenewAge Peptide Serum",
    slug: "renewage-peptide-serum",
    description:
      "A peptide serum designed to support firmer-looking and smoother skin.",
    brand: "RenewAge",
    category: ProductCategory.SERUM,
    price: 32000,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 10,
    stockQuantity: 12,
    skinTypes: [SkinType.NORMAL, SkinType.DRY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.ANTI_AGING,
      ProductConcern.DRYNESS,
      ProductConcern.ROUGH_SKIN,
    ],
    size: "30",
    unit: "ml",
    howToUse:
      "Apply a few drops after cleansing and before moisturiser.",
    keyIngredients: "Peptides, Hyaluronic Acid, Squalane",
    benefits:
      "Supports smoother and more hydrated-looking skin.",
    suitabilityNotes:
      "Suitable for normal, dry and combination skin.",
    warnings: "For external use only.",
  },

  {
    name: "DailyBasics Gentle Moisturiser",
    slug: "dailybasics-gentle-moisturiser",
    description:
      "A simple everyday moisturiser suitable for a wide range of skin types.",
    brand: "DailyBasics",
    category: ProductCategory.MOISTURISER,
    price: 9500,
    discountType: DiscountType.NONE,
    discountValue: null,
    stockQuantity: 45,
    skinTypes: [
      SkinType.NORMAL,
      SkinType.DRY,
      SkinType.OILY,
      SkinType.COMBINATION,
      SkinType.SENSITIVE,
    ],
    concerns: [
      ProductConcern.GENERAL_SKINCARE,
      ProductConcern.DRYNESS,
    ],
    size: "100",
    unit: "ml",
    howToUse:
      "Apply evenly to clean skin morning and evening.",
    keyIngredients: "Glycerin, Squalane, Panthenol",
    benefits:
      "Provides simple daily hydration without a heavy feel.",
    suitabilityNotes:
      "Suitable for most skin types.",
    warnings: "For external use only.",
  },

  {
    name: "TextureReset Exfoliating Serum",
    slug: "texturereset-exfoliating-serum",
    description:
      "A targeted exfoliating serum designed to improve rough texture and clogged-looking pores.",
    brand: "TextureReset",
    category: ProductCategory.SERUM,
    price: 27500,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 12,
    stockQuantity: 15,
    skinTypes: [SkinType.OILY, SkinType.COMBINATION],
    concerns: [
      ProductConcern.ROUGH_SKIN,
      ProductConcern.BUMPY_SKIN,
      ProductConcern.ACNE_PRONE,
    ],
    size: "30",
    unit: "ml",
    howToUse:
      "Apply a small amount in the evening two to three times per week.",
    keyIngredients: "Salicylic Acid, Lactic Acid, Niacinamide",
    benefits:
      "Helps improve the appearance of uneven texture and congested pores.",
    suitabilityNotes:
      "Best suited to oily and combination skin.",
    warnings:
      "Introduce gradually and avoid over-exfoliating.",
  },

  {
    name: "CalmBarrier Sensitive Cleanser",
    slug: "calmbarrier-sensitive-cleanser",
    description:
      "A fragrance-free cleanser designed for sensitive and easily irritated skin.",
    brand: "CalmBarrier",
    category: ProductCategory.CLEANSER,
    price: 15500,
    discountType: DiscountType.PERCENTAGE,
    discountValue: 5,
    stockQuantity: 20,
    skinTypes: [SkinType.SENSITIVE, SkinType.DRY],
    concerns: [
      ProductConcern.SENSITIVE_SKIN,
      ProductConcern.DRYNESS,
    ],
    size: "200",
    unit: "ml",
    howToUse:
      "Massage gently onto damp skin and rinse with lukewarm water.",
    keyIngredients: "Ceramides, Glycerin, Oat Extract",
    benefits:
      "Gently cleanses while helping maintain skin comfort.",
    suitabilityNotes:
      "Designed for dry and sensitive skin.",
    warnings: "Avoid direct contact with eyes.",
  },
];

function calculateSalePrice(
  price: number,
  discountType: DiscountType,
  discountValue: number | null
) {
  if (discountType === DiscountType.NONE) {
    return price;
  }

  if (!discountValue) {
    throw new Error(
      "Discount value is required when discount is applied."
    );
  }

  if (discountType === DiscountType.PERCENTAGE) {
    return Number(
      (price * (1 - discountValue / 100)).toFixed(2)
    );
  }

  return Number((price - discountValue).toFixed(2));
}

async function main() {
  console.log("🌱 Starting BeautyHub seed...");

  /*
   * Clear products first.
   *
   * ProductImage, CartItem and OrderItem may have relations
   * to Product. If your database already contains order
   * history, do not run this cleanup against production.
   */
  await prisma.productImage.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("🧹 Existing product data cleared.");

  const categoryMap = new Map<
    ProductCategory,
    string
  >();

  for (const category of categories) {
    const createdCategory =
      await prisma.category.create({
        data: category,
      });

    categoryMap.set(
      createdCategory.name,
      createdCategory.id
    );
  }

  console.log(`📂 Created ${categories.length} categories.`);

  for (const product of products) {
    const categoryId = categoryMap.get(
      product.category
    );

    if (!categoryId) {
      throw new Error(
        `Category not found for ${product.name}`
      );
    }

    const salePrice = calculateSalePrice(
      product.price,
      product.discountType,
      product.discountValue
    );

    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        brand: product.brand,

        categoryId,

        price: product.price,
        salePrice,

        discountType: product.discountType,
        discountValue: product.discountValue,

        stockQuantity: product.stockQuantity,
        lowStockThreshold: 5,

        status: ProductStatus.ACTIVE,

        verificationStatus:
          ProductVerificationStatus.VERIFIED,

        howToUse: product.howToUse,
        keyIngredients: product.keyIngredients,
        benefits: product.benefits,
        suitabilityNotes: product.suitabilityNotes,
        warnings: product.warnings,

        skinTypes: product.skinTypes,
        concerns: product.concerns,

        size: product.size,
        unit: product.unit,
      },
    });

    console.log(`✓ ${product.name}`);
  }

  console.log("");
  console.log(
    `✅ Seed completed successfully: ${products.length} products created.`
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);

    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });