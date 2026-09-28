"use client";

import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import {
  PRODUCT_TYPE_OPTIONS,
} from "@/constants//discovery";
import { ProductCategory } from "@/types/discovery";

interface ProductTypeStepProps {
  selected?: ProductCategory;
  onChange: (category?: ProductCategory) => void;
}

export default function ProductTypeStep({
  selected,
  onChange,
}: ProductTypeStepProps) {
  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-neutral-500">
          Step 3 of 4
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          What kind of product are you looking for?
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
          Choose a category, or let us show you products based
          on your needs.
        </p>
      </div>

      <div className="mb-4">
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onChange(undefined)}
          className={[
            "flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all",
            selected === undefined
              ? "border-neutral-950 bg-neutral-950 text-white shadow-lg"
              : "border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              selected === undefined
                ? "bg-white text-black"
                : "bg-neutral-100",
            ].join(" ")}
          >
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h3 className="font-medium">
              Show me what fits my needs
            </h3>

            <p
              className={[
                "mt-1 text-sm",
                selected === undefined
                  ? "text-neutral-300"
                  : "text-neutral-500",
              ].join(" ")}
            >
              Don&apos;t worry about choosing a product type.
            </p>
          </div>

          {selected === undefined && (
            <Check className="h-5 w-5 shrink-0" />
          )}
        </motion.button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PRODUCT_TYPE_OPTIONS.map((option) => {
          const isSelected = selected === option.value;

          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(option.value)}
              className={[
                "rounded-2xl border p-5 text-left transition-all",
                isSelected
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-lg"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">
                    {option.label}
                  </h3>

                  <p
                    className={[
                      "mt-1 text-sm",
                      isSelected
                        ? "text-neutral-300"
                        : "text-neutral-500",
                    ].join(" ")}
                  >
                    {option.description}
                  </p>
                </div>

                {isSelected && (
                  <Check className="h-5 w-5 shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}