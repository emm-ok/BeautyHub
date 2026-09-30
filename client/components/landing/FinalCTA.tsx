"use client";

import Link from "next/link";

import {
  ArrowRight,
  Search,
} from "lucide-react";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 0.6,
        }}
        className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-neutral-950 px-7 py-16 text-center text-white sm:px-12 sm:py-20"
      >
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            <Search className="h-5 w-5 text-neutral-300" />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Start exploring
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Find products that
            make sense for you.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-neutral-400 sm:text-base">
            Explore the BeautyHub catalogue
            or tell us what you're looking
            for and start discovering.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/discover"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
            >
              Find what I need

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore products
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}