"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { BUDGET_OPTIONS } from "@/constants/discovery";

interface BudgetStepProps {
  selected?: number;
  onChange: (budget?: number) => void;
}

const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG")}`;

export default function BudgetStep({
  selected,
  onChange,
}: BudgetStepProps) {
  const [customBudget, setCustomBudget] = useState(
    selected && !BUDGET_OPTIONS.includes(selected as never)
      ? String(selected)
      : ""
  );

  const handleCustomBudget = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = event.target.value.replace(/\D/g, "");

    setCustomBudget(raw);

    if (!raw) {
      onChange(undefined);
      return;
    }

    const amount = Number(raw);

    if (amount > 0) {
      onChange(amount);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-neutral-500">
          Step 4 of 4
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          What&apos;s your budget?
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
          We&apos;ll show products at or below your selected
          budget.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BUDGET_OPTIONS.map((budget) => {
          const isSelected = selected === budget;

          return (
            <button
              key={budget}
              type="button"
              onClick={() => {
                setCustomBudget("");
                onChange(budget);
              }}
              className={[
                "rounded-2xl border p-5 text-left transition-all",
                isSelected
                  ? "border-neutral-950 bg-neutral-950 text-white shadow-lg"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-md",
              ].join(" ")}
            >
              <span className="text-sm text-current opacity-60">
                Up to
              </span>

              <div className="mt-1 text-xl font-semibold">
                {formatNaira(budget)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <label
          htmlFor="custom-budget"
          className="text-sm font-medium text-neutral-900"
        >
          Or enter your own maximum
        </label>

        <div className="mt-3 flex items-center rounded-xl border border-neutral-200 px-4 transition focus-within:border-neutral-950 focus-within:ring-2 focus-within:ring-neutral-950/5">
          <span className="text-sm text-neutral-400">
            ₦
          </span>

          <input
            id="custom-budget"
            type="text"
            inputMode="numeric"
            value={customBudget}
            onChange={handleCustomBudget}
            placeholder="25,000"
            className="h-12 w-full bg-transparent px-2 text-sm outline-none"
          />
        </div>

        <p className="mt-2 text-xs text-neutral-400">
          You can always change this later.
        </p>
      </div>

      {selected && (
        <div className="mt-6 flex items-center gap-2 text-sm text-neutral-600">
          <ArrowRight className="h-4 w-4" />

          Showing products up to{" "}
          <strong className="text-neutral-950">
            {formatNaira(selected)}
          </strong>
        </div>
      )}
    </div>
  );
}