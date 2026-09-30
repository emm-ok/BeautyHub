"use client";

import {
  BadgeCheck,
  BookOpen,
  CircleDollarSign,
  Search,
} from "lucide-react";

import { motion } from "framer-motion";

const benefits = [
  {
    number: "01",
    icon: Search,
    title: "Less guesswork",
    description:
      "Discover products using practical filters around skin type, concerns, category and budget.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "More useful information",
    description:
      "Understand what a product does, how to use it, its key ingredients and suitability.",
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "A clearer catalogue",
    description:
      "Verified products are clearly identified so you can distinguish them while browsing.",
  },
  {
    number: "04",
    icon: CircleDollarSign,
    title: "Transparent pricing",
    description:
      "See current selling prices alongside applicable original prices and discounts.",
  },
];

export default function WhyBeautyHub() {
  return (
    <section className="overflow-hidden bg-neutral-950 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Why BeautyHub
            </p>

            <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Beauty shopping
              shouldn't feel like
              guesswork.
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-neutral-400 sm:text-base">
              BeautyHub brings product
              discovery, useful product
              information and purchasing
              into one simpler experience.
            </p>
          </motion.div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2">
            {benefits.map(
              (item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.number}
                    initial={{
                      opacity: 0,
                      y: 18,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.08,
                    }}
                    className="bg-neutral-950 p-7 sm:p-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                        <Icon className="h-4 w-4 text-neutral-300" />
                      </div>

                      <span className="text-xs font-medium text-neutral-600">
                        {item.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-base font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-neutral-500">
                      {item.description}
                    </p>
                  </motion.div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}