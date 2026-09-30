"use client";

import {
  BadgeCheck,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

const values = [
  {
    icon: BadgeCheck,
    title: "Verified products",
    description:
      "Clearly identified products across our curated catalogue.",
  },
  {
    icon: SearchCheck,
    title: "Personalised discovery",
    description:
      "Explore products around your skin type, concerns and needs.",
  },
  {
    icon: ShieldCheck,
    title: "Clear pricing",
    description:
      "See current prices and discounts without the guesswork.",
  },
  {
    icon: Sparkles,
    title: "Beauty, made simpler",
    description:
      "Useful product information before you decide what to buy.",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-neutral-200/70 bg-neutral-50/70">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">
        <div className="grid divide-y divide-neutral-200/70 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {values.map(
            (item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.4,
                  }}
                  transition={{
                    duration: 0.45,
                    delay:
                      index * 0.06,
                  }}
                  className="flex gap-4 px-0 py-5 first:pt-0 last:pb-0 sm:px-6 sm:first:pl-0 sm:first:pt-5 sm:last:pr-0 sm:last:pb-5 lg:py-2"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-neutral-950">
                      {item.title}
                    </h3>

                    <p className="mt-1 max-w-[220px] text-xs leading-5 text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}