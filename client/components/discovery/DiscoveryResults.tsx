"use client";

import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

import DiscoveryProductCard from "./DiscoveryProductCard";

import {
  CONCERN_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  SKIN_TYPE_OPTIONS,
} from "@/constants/discovery";

import {
  DiscoveryState,
  ProductDiscoveryResponse,
} from "@/types/discovery";

interface DiscoveryResultsProps {
  results: ProductDiscoveryResponse;
  state: DiscoveryState;
  onEdit: () => void;
  onBack: () => void;
}

const formatNaira = (value?: number) => {
  if (!value) return null;

  return `₦${value.toLocaleString("en-NG")}`;
};

export default function DiscoveryResults({
  results,
  state,
  onEdit,
  onBack,
}: DiscoveryResultsProps) {
  const concernLabels = state.concerns.map(
    (concern) =>
      CONCERN_OPTIONS.find(
        (option) => option.value === concern
      )?.label
  );

  const skinTypeLabel = SKIN_TYPE_OPTIONS.find(
    (option) => option.value === state.skinType
  )?.label;

  const categoryLabel = PRODUCT_TYPE_OPTIONS.find(
    (option) => option.value === state.category
  )?.label;

  return (
    <div>
      <div className="mb-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Your BeautyHub matches
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Products matched to your needs
            </h1>

            <p className="mt-3 text-sm text-neutral-500">
              {results.pagination.total}{" "}
              {results.pagination.total === 1
                ? "product"
                : "products"}{" "}
              found for your preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:border-neutral-400"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Edit preferences
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap gap-2"
      >
        {concernLabels.filter(Boolean).map((label) => (
          <span
            key={label}
            className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700"
          >
            {label}
          </span>
        ))}

        {skinTypeLabel && skinTypeLabel !== "I'm not sure" && (
          <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
            {skinTypeLabel} skin
          </span>
        )}

        {categoryLabel && (
          <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
            {categoryLabel}
          </span>
        )}

        {state.maxBudget && (
          <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
            Up to {formatNaira(state.maxBudget)}
          </span>
        )}
      </motion.div>

      {results.products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-neutral-950">
            We couldn&apos;t find an exact match
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            Try adjusting your preferences or budget and
            we&apos;ll search again.
          </p>

          <button
            type="button"
            onClick={onEdit}
            className="mt-6 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Adjust preferences
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {results.products.map((product) => (
            <DiscoveryProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}