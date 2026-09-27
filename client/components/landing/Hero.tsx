"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const benefits = [
  "Curated products",
  "Transparent pricing",
  "Simple product guidance",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-[#fafaf9]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-neutral-200/40 blur-3xl" />
        <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-stone-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-2 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-neutral-700" />

            <span className="text-xs font-medium tracking-wide text-neutral-600">
              Beauty shopping, thoughtfully curated
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="max-w-3xl text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-neutral-950">
            Beauty products
            <br />
            <span className="text-neutral-400">you can trust.</span>
          </h1>

          {/* Description */}
          <p className="mt-8 max-w-xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            Discover carefully selected skincare and personal-care products,
            understand what you&apos;re buying, and shop with clear pricing
            from one trusted destination.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:shadow-lg"
            >
              Explore products

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-medium text-neutral-800 transition-all hover:border-neutral-400 hover:bg-neutral-50"
            >
              How it works
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.35 + index * 0.08,
                  duration: 0.4,
                }}
                className="flex items-center gap-2"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950">
                  <Check className="h-3 w-3 text-white" />
                </div>

                <span className="text-xs font-medium text-neutral-600">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="relative"
        >
          <div className="relative mx-auto max-w-[520px]">
            {/* Main visual card */}
            <div className="relative aspect-[0.88] overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
              <div className="relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-[#f1eee9]">
                {/* Decorative circles */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/60" />
                <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#ddd7ce]/60" />

                {/* Product visual */}
                <div className="relative flex flex-1 items-center justify-center">
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <div className="absolute left-1/2 top-8 h-52 w-52 -translate-x-1/2 rounded-full bg-white/60 blur-2xl" />

                    <div className="relative flex h-64 w-48 flex-col items-center justify-end rounded-[2.5rem] border border-neutral-300 bg-white px-5 pb-7 pt-8 shadow-2xl">
                      <div className="absolute left-1/2 top-0 h-12 w-20 -translate-x-1/2 -translate-y-1/2 rounded-t-xl rounded-b-md border border-neutral-300 bg-neutral-100" />

                      <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
                        BEAUTYHUB
                      </div>

                      <div className="text-center">
                        <p className="text-xl font-semibold tracking-tight text-neutral-900">
                          Hydrating
                        </p>

                        <p className="mt-1 text-sm text-neutral-500">
                          Skin Essentials
                        </p>
                      </div>

                      <div className="mt-7 h-px w-16 bg-neutral-200" />

                      <p className="mt-4 text-[9px] uppercase tracking-[0.22em] text-neutral-400">
                        Daily Care
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom product information */}
                <div className="relative border-t border-neutral-200/80 bg-white/90 p-5 backdrop-blur-xl">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                        Featured
                      </p>

                      <h3 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
                        Everyday Skin Essentials
                      </h3>
                    </div>

                    <div className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700">
                      Curated
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating trust card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -right-3 top-16 hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl sm:block lg:-right-10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-neutral-900">
                    Verified selection
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-500">
                    Carefully curated
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating price card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.95, duration: 0.5 }}
              className="absolute -bottom-5 -left-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-xl sm:-left-8"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Clear pricing
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-semibold tracking-tight text-neutral-950">
                  No surprises
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}