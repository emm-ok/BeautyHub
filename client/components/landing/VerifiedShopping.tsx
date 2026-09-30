"use client";

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  Check,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

export default function VerifiedShopping() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-50">
          <div className="grid lg:grid-cols-[1fr_0.9fr]">
            <div className="p-7 sm:p-10 lg:p-14">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
                <BadgeCheck className="h-5 w-5" />
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Verified shopping
              </p>

              <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
                A clearer way to
                identify products.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
                BeautyHub clearly identifies
                products that have been marked
                as verified within the store
                catalogue, making it easier to
                shop with the information
                available to you.
              </p>

              <Link
                href="/products?verificationStatus=VERIFIED"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950"
              >
                Explore verified products

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative overflow-hidden bg-neutral-950 p-7 text-white sm:p-10 lg:p-14">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl" />

              <div className="relative space-y-4">
                {[
                  "Clearly marked verification status",
                  "Useful product information",
                  "Transparent pricing",
                  "Curated BeautyHub catalogue",
                ].map(
                  (item, index) => (
                    <motion.div
                      key={item}
                      initial={{
                        opacity: 0,
                        x: 15,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          index * 0.08,
                      }}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-950">
                        <Check className="h-4 w-4" />
                      </div>

                      <span className="text-sm text-neutral-300">
                        {item}
                      </span>
                    </motion.div>
                  )
                )}

                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
                  <ShieldCheck className="h-4 w-4 text-neutral-500" />

                  <p className="text-xs leading-5 text-neutral-500">
                    Verification status is
                    displayed directly on
                    eligible product listings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}