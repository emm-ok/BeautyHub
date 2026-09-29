"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";

interface ProductDetailsErrorProps {
  onRetry: () => void;
}

export default function ProductDetailsError({
  onRetry,
}: ProductDetailsErrorProps) {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-16">
        <div className="w-full rounded-[2rem] border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
            <RefreshCcw className="h-5 w-5 text-neutral-500" />
          </div>

          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-950">
            We couldn&apos;t load this product
          </h1>

          <p className="mt-3 text-sm leading-7 text-neutral-500">
            Something went wrong while loading
            the product information. Please try
            again.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <RefreshCcw className="h-4 w-4" />
              Try again
            </button>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to products
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}