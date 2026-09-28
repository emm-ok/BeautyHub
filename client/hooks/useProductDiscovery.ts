"use client";

import { useMutation } from "@tanstack/react-query";
import { ProductDiscoveryPayload } from "@/types/discovery";
import { discoverProducts } from "@/services/product-discovery";

export function useProductDiscovery() {
  return useMutation({
    mutationFn: (payload: ProductDiscoveryPayload) =>
      discoverProducts(payload),
  });
}