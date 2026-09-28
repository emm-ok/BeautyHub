"use client";

import { DISCOVERY_STEPS } from "@/constants/discovery";
import { Check } from "lucide-react";


interface DiscoveryProgressProps {
  currentStep: number;
}

export default function DiscoveryProgress({
  currentStep,
}: DiscoveryProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {DISCOVERY_STEPS.map((step, index) => {
          const completed = currentStep > step.id;
          const active = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-all duration-300",
                    completed
                      ? "border-black bg-black text-white"
                      : active
                        ? "border-black bg-white text-black shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-400",
                  ].join(" ")}
                >
                  {completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>

                <span
                  className={[
                    "mt-2 hidden text-xs transition-colors sm:block",
                    active || completed
                      ? "text-neutral-900"
                      : "text-neutral-400",
                  ].join(" ")}
                >
                  {step.shortTitle}
                </span>
              </div>

              {index < DISCOVERY_STEPS.length - 1 && (
                <div className="mx-2 mt-[-18px] h-px flex-1 bg-neutral-200 sm:mx-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}