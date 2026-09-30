"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  FlaskConical,
  HeartPulse,
  Info,
  ListChecks,
} from "lucide-react";

import { motion } from "framer-motion";

const information = [
  {
    icon: Info,
    label: "What it does",
  },
  {
    icon: FlaskConical,
    label: "Key ingredients",
  },
  {
    icon: HeartPulse,
    label: "Skin suitability",
  },
  {
    icon: ListChecks,
    label: "How to use it",
  },
];

export default function ProductEducation() {
  return (
    <section className="bg-neutral-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
            }}
            className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.3)] sm:p-9"
          >
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-neutral-100 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Product information
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                    Know what you're
                    choosing.
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
                  <Info className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {information.map(
                  (item, index) => {
                    const Icon =
                      item.icon;

                    return (
                      <motion.div
                        key={item.label}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          delay:
                            index * 0.08,
                        }}
                        className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5"
                      >
                        <Icon className="h-4 w-4 text-neutral-600" />

                        <p className="mt-5 text-sm font-medium text-neutral-900">
                          {item.label}
                        </p>
                      </motion.div>
                    );
                  }
                )}
              </div>
            </div>
          </motion.div>

          <div className="max-w-xl lg:pl-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Product education
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-4xl">
              Don't just see a
              product. Understand it.
            </h2>

            <p className="mt-5 text-sm leading-7 text-neutral-500 sm:text-base">
              Every product should give you
              enough context to understand
              what you're buying and whether
              it makes sense for your routine.
            </p>

            <Link
              href="/products"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Explore products

              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}