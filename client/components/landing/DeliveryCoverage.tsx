"use client";

import {
  ArrowRight,
  MapPin,
  Truck,
} from "lucide-react";

import { motion } from "framer-motion";

const states = [
  "Lagos",
  "Abuja",
  "Rivers",
  "Oyo",
  "Kano",
  "Enugu",
  "Kaduna",
  "Delta",
];

export default function DeliveryCoverage() {
  return (
    <section className="border-y border-neutral-200/70 bg-neutral-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-950 text-white">
              <Truck className="h-5 w-5" />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Delivery
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
              Beauty delivered
              across Nigeria.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-500">
              We're starting with selected
              states and expanding coverage
              as BeautyHub grows.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-neutral-500" />

              <span className="text-sm font-semibold text-neutral-950">
                Current delivery coverage
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {states.map(
                (state, index) => (
                  <motion.div
                    key={state}
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
                        index * 0.05,
                    }}
                    className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm"
                  >
                    {state}
                  </motion.div>
                )
              )}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-neutral-950">
                  15
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  states targeted for
                  initial coverage
                </p>
              </div>

              <button
                type="button"
                className="group flex items-center gap-2 text-xs font-semibold text-neutral-800"
              >
                Check availability

                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}