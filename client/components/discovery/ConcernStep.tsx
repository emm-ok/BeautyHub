"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { ProductConcern } from "@/types/discovery";
import { CONCERN_OPTIONS } from "@/constants/discovery";


interface ConcernStepProps {
  selected: ProductConcern[];
  onChange: (concerns: ProductConcern[]) => void;
}

export default function ConcernStep({
  selected,
  onChange,
}: ConcernStepProps) {
  const toggleConcern = (concern: ProductConcern) => {
    if (selected.includes(concern)) {
      onChange(
        selected.filter((item) => item !== concern)
      );
      return;
    }

    if (selected.length >= 5) return;

    onChange([...selected, concern]);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-neutral-500">
          Step 1 of 4
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          What would you like to address?
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
          Select the concerns you want your products to focus on.
          You can choose up to five.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {CONCERN_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.value);
          const disabled =
            !isSelected && selected.length >= 5;

          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={!disabled ? { y: -2 } : undefined}
              whileTap={!disabled ? { scale: 0.99 } : undefined}
              onClick={() => toggleConcern(option.value)}
              disabled={disabled}
              className={[
                "group relative rounded-2xl border p-5 text-left transition-all duration-200",
                isSelected
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-lg"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md",
                disabled
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">
                    {option.label}
                  </h3>

                  <p
                    className={[
                      "mt-1 text-sm leading-5",
                      isSelected
                        ? "text-neutral-300"
                        : "text-neutral-500",
                    ].join(" ")}
                  >
                    {option.description}
                  </p>
                </div>

                <div
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
                    isSelected
                      ? "border-white bg-white text-black"
                      : "border-neutral-300 bg-white",
                  ].join(" ")}
                >
                  {isSelected && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        {selected.length}/5 selected
      </p>
    </div>
  );
}