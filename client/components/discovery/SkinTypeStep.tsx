"use client";

import { Check, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

import {
  SKIN_TYPE_OPTIONS,
} from "@/constants/discovery";
import { SkinType } from "@/types/discovery";

interface SkinTypeStepProps {
  selected?: SkinType;
  onChange: (skinType: SkinType) => void;
}

export default function SkinTypeStep({
  selected,
  onChange,
}: SkinTypeStepProps) {
  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-neutral-500">
          Step 2 of 4
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          What&apos;s your skin type?
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
          Choose the option that best describes your skin.
          Not sure? That&apos;s completely fine.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SKIN_TYPE_OPTIONS.map((option) => {
          const isSelected = selected === option.value;

          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(option.value)}
              className={[
                "group rounded-2xl border p-5 text-left transition-all",
                isSelected
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-lg"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
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
                    "flex h-6 w-6 items-center justify-center rounded-full border",
                    isSelected
                      ? "border-white bg-white text-black"
                      : "border-neutral-300",
                  ].join(" ")}
                >
                  {isSelected ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : option.value === "UNKNOWN" ? (
                    <HelpCircle className="h-3.5 w-3.5 text-neutral-400" />
                  ) : null}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}