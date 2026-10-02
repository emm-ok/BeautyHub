"use client";

import { motion } from "framer-motion";

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-neutral-200/80 ${className}`}
    />
  );
}

function SectionSkeleton({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-[10px] font-medium text-neutral-400">
          {number}
        </span>

        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-800">
            {title}
          </p>
          <Skeleton className="mt-2 h-2 w-32" />
        </div>
      </div>

      <div className="space-y-5 pl-0 sm:pl-10">
        {children}
      </div>
    </section>
  );
}

function FieldSkeleton({
  width = "w-24",
}: {
  width?: string;
}) {
  return (
    <div className="space-y-2.5">
      <Skeleton className={`h-2.5 ${width}`} />
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}

export default function UpdateProductDrawerSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading product details"
      aria-busy="true"
      className="flex h-full min-h-0 flex-col bg-white"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-5 sm:px-7">
        <div className="space-y-3">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3 w-56 max-w-full" />
        </div>

        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 space-y-9 overflow-y-auto px-5 py-7 sm:px-7">
        {/* 01 — Basic information */}
        <SectionSkeleton
          number="01"
          title="Basic information"
        >
          <FieldSkeleton width="w-28" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldSkeleton width="w-20" />
            <FieldSkeleton width="w-24" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>

          <FieldSkeleton width="w-28" />
        </SectionSkeleton>

        <div className="border-t border-neutral-100" />

        {/* 02 — Product media */}
        <SectionSkeleton
          number="02"
          title="Product media"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-2"
              >
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-2.5 w-3/4" />
              </div>
            ))}
          </div>

          <Skeleton className="h-24 w-full rounded-xl border border-dashed border-neutral-300" />
        </SectionSkeleton>

        <div className="border-t border-neutral-100" />

        {/* 03 — Pricing & inventory */}
        <SectionSkeleton
          number="03"
          title="Pricing & inventory"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldSkeleton width="w-24" />
            <FieldSkeleton width="w-24" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FieldSkeleton width="w-28" />
            <FieldSkeleton width="w-20" />
          </div>

          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-7 w-36" />
            <Skeleton className="mt-2 h-2.5 w-44" />
          </div>
        </SectionSkeleton>

        <div className="border-t border-neutral-100" />

        {/* 04 — Suitability & discovery */}
        <SectionSkeleton
          number="04"
          title="Suitability & discovery"
        >
          <div className="space-y-3">
            <Skeleton className="h-2.5 w-24" />
            <div className="flex flex-wrap gap-2">
              {["w-20", "w-24", "w-16", "w-28", "w-20"].map(
                (width, index) => (
                  <Skeleton
                    key={index}
                    className={`h-8 ${width} rounded-full`}
                  />
                ),
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-2.5 w-28" />
            <div className="flex flex-wrap gap-2">
              {["w-24", "w-20", "w-28", "w-16"].map(
                (width, index) => (
                  <Skeleton
                    key={index}
                    className={`h-8 ${width} rounded-full`}
                  />
                ),
              )}
            </div>
          </div>

          <FieldSkeleton width="w-32" />
        </SectionSkeleton>

        <div className="border-t border-neutral-100" />

        {/* 05 — Product education */}
        <SectionSkeleton
          number="05"
          title="Product education"
        >
          <div className="space-y-2.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </SectionSkeleton>

        <div className="border-t border-neutral-100" />

        {/* 06 — Publishing */}
        <SectionSkeleton
          number="06"
          title="Publishing"
        >
          <div className="space-y-3">
            <Skeleton className="h-2.5 w-24" />

            <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-40" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-36" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </div>
        </SectionSkeleton>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-neutral-200 bg-white px-5 py-4 sm:px-7">
        <Skeleton className="h-3 w-28" />

        <div className="flex gap-3">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      <span className="sr-only">Loading product details…</span>
    </div>
  );
}