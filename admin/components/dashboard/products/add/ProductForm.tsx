"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  productFormSchema,
  type ProductFormValues,
} from "@/schemas/admin-product.schema";

import { ProductBasicInformation } from "./ProductBasicInformation";
import { ProductPricingSection } from "./ProductPricingSection";
import { ProductInventorySection } from "./ProductInventorySection";
import { ProductContentSection } from "./ProductContentSection";
import { ProductSuitabilitySection } from "./ProductSuitabilitySection";
import { ProductVisibilitySection } from "./ProductVisibilitySection";
import { ProductFormActions } from "./ProductFormActions";

export function ProductForm() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(
      productFormSchema,
    ),

    defaultValues: {
      name: "",
      slug: "",
      description: "",
      brand: "",
      categoryId: "",

      price: 0,
      discountType: "NONE",
      discountValue: 0,

      stockQuantity: 0,
      lowStockThreshold: 5,

      howToUse: "",
      keyIngredients: "",
      benefits: "",
      suitabilityNotes: "",
      warnings: "",

      skinTypes: [],
      concerns: [],

      status: "ACTIVE",
      verificationStatus: "NOT_VERIFIED",
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(
        async (values) => {
          // handled by AddProductPage
        },
      )}
      className="space-y-6"
    >
      <ProductBasicInformation
        form={form}
      />

      <ProductPricingSection
        form={form}
      />

      <ProductInventorySection
        form={form}
      />

      <ProductContentSection
        form={form}
      />

      <ProductSuitabilitySection
        form={form}
      />

      <ProductVisibilitySection
        form={form}
      />

      <ProductFormActions
        isSubmitting={
          form.formState.isSubmitting
        }
      />
    </form>
  );
}