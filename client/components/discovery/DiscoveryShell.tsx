"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

import DiscoveryProgress from "./DiscoveryProgress";
import ConcernStep from "./ConcernStep";
import SkinTypeStep from "./SkinTypeStep";
import ProductTypeStep from "./ProductTypeStep";
import BudgetStep from "./BudgetStep";
import DiscoveryResults from "./DiscoveryResults";

import { useProductDiscovery } from "@/hooks/useProductDiscovery";

import {
  DEFAULT_DISCOVERY_PAGE_SIZE,
} from "@/constants/discovery";

import {
  DiscoveryState,
} from "@/types/discovery";

const INITIAL_STATE: DiscoveryState = {
  concerns: [],
  skinType: undefined,
  category: undefined,
  maxBudget: undefined,
};

const stepVariants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -20,
  },
};

export default function DiscoveryShell() {
  const [step, setStep] = useState(1);
  const [state, setState] =
    useState<DiscoveryState>(INITIAL_STATE);

  const discoveryMutation = useProductDiscovery();

  const isLoading = discoveryMutation.isPending;

  const canContinue = useMemo(() => {
    switch (step) {
      case 1:
        return state.concerns.length > 0;

      case 2:
        return Boolean(state.skinType);

      case 3:
        return true;

      case 4:
        return Boolean(state.maxBudget);

      default:
        return false;
    }
  }, [step, state]);

  const updateState = (
    updates: Partial<DiscoveryState>
  ) => {
    setState((current: any) => ({
      ...current,
      ...updates,
    }));
  };

  const handleNext = async () => {
    if (!canContinue || isLoading) return;

    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }

    await discoveryMutation.mutateAsync({
      concerns: state.concerns,
      skinType:
        state.skinType === "UNKNOWN"
          ? undefined
          : state.skinType,
      category: state.category,
      maxBudget: state.maxBudget,
      verifiedOnly: true,
      inStockOnly: true,
      page: 1,
      limit: DEFAULT_DISCOVERY_PAGE_SIZE,
    });

    setStep(5);
  };

  const handleBack = () => {
    if (isLoading) return;

    if (step > 1 && step <= 4) {
      setStep((current) => current - 1);
    }
  };

  const handleEdit = () => {
    discoveryMutation.reset();
    setStep(1);
  };

  const handleResultsBack = () => {
    discoveryMutation.reset();
    setStep(4);
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="mb-10 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Personalised product discovery
          </div>
        </div>

        {step < 5 && (
          <div className="mx-auto mb-10 max-w-4xl">
            <DiscoveryProgress currentStep={step} />
          </div>
        )}

        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
            <div className="p-5 sm:p-8 lg:p-12">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="concerns"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22 }}
                  >
                    <ConcernStep
                      selected={state.concerns}
                      onChange={(concerns) =>
                        updateState({ concerns })
                      }
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="skin-type"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22 }}
                  >
                    <SkinTypeStep
                      selected={state.skinType}
                      onChange={(skinType) =>
                        updateState({ skinType })
                      }
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="product-type"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22 }}
                  >
                    <ProductTypeStep
                      selected={state.category}
                      onChange={(category) =>
                        updateState({ category })
                      }
                    />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="budget"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.22 }}
                  >
                    <BudgetStep
                      selected={state.maxBudget}
                      onChange={(maxBudget) =>
                        updateState({ maxBudget })
                      }
                    />
                  </motion.div>
                )}

                {step === 5 &&
                  discoveryMutation.data && (
                    <motion.div
                      key="results"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.25 }}
                    >
                      <DiscoveryResults
                        results={discoveryMutation.data}
                        state={state}
                        onEdit={handleEdit}
                        onBack={handleResultsBack}
                      />
                    </motion.div>
                  )}
              </AnimatePresence>

              {discoveryMutation.isError && (
                <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-900">
                    We couldn&apos;t load your matches.
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    Please try again. Your preferences have
                    been saved.
                  </p>
                </div>
              )}

              {step < 5 && (
                <div className="mt-10 flex items-center justify-between border-t border-neutral-100 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1 || isLoading}
                    className={[
                      "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                      step === 1 || isLoading
                        ? "cursor-not-allowed text-neutral-300"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
                    ].join(" ")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canContinue || isLoading}
                    className={[
                      "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition",
                      !canContinue || isLoading
                        ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
                        : "bg-neutral-950 text-white shadow-sm hover:bg-neutral-800",
                    ].join(" ")}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Finding matches...
                      </>
                    ) : step === 4 ? (
                      <>
                        Find my products
                        <Sparkles className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {step < 5 && (
            <p className="mt-6 text-center text-xs text-neutral-400">
              Your preferences are only used to find relevant
              BeautyHub products.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}