import React, { Suspense } from 'react'
import ProductsShell from "@/components/products/ProductsShell";

export const metadata = {
  title: "Shop Beauty & Personal Care | BeautyHub",
  description:
    "Explore verified skincare and beauty products at BeautyHub Store.",
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsShell />
    </Suspense>
  )
}