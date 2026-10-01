"use client";

import {
  AlertTriangle,
  BadgeCheck,
  Package,
  PackageCheck,
} from "lucide-react";
import { motion } from "framer-motion";

import type { ProductKPIs } from "@/types/products";

interface ProductKpiCardsProps {
  data?: ProductKPIs;
  isLoading: boolean;
}

const cards = [
  {
    key: "totalProducts",
    label: "Total products",
    icon: Package,
    description: "Across your catalogue",
  },
  {
    key: "activeProducts",
    label: "Active products",
    icon: PackageCheck,
    description: "Currently visible",
  },
  {
    key: "verifiedProducts",
    label: "Verified products",
    icon: BadgeCheck,
    description: "Marked as verified",
  },
  {
    key: "lowStockProducts",
    label: "Low stock",
    icon: AlertTriangle,
    description: "Needs attention",
  },
] as const;

export default function ProductKpiCards({
  data,
  isLoading,
}: ProductKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        const value = data?.[card.key] ?? 0;

        return (
          <motion.div
            key={card.key}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.05,
            }}
            className="
              rounded-2xl
              border
              border-neutral-200
              bg-white
              p-5
              shadow-[0_1px_2px_rgba(0,0,0,0.03)]
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500">
                  {card.label}
                </p>

                {isLoading ? (
                  <div className="mt-3 h-8 w-16 animate-pulse rounded-lg bg-neutral-100" />
                ) : (
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                    {value.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-50 text-neutral-500">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-3 text-xs text-neutral-400">
              {card.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}