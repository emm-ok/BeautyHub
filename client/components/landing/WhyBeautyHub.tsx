"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  CircleDollarSign,
  SearchCheck,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: SearchCheck,
    title: "Discover with confidence",
    description:
      "Find products through a focused catalogue designed around real skincare and body-care needs.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Understand before you buy",
    description:
      "Get useful information about ingredients, benefits, usage and suitability before making a purchase.",
  },
  {
    number: "03",
    icon: CircleDollarSign,
    title: "Know what you're paying",
    description:
      "See product and delivery costs clearly so there are no surprises at checkout.",
  },
  {
    number: "04",
    icon: BadgeCheck,
    title: "Shop a curated selection",
    description:
      "BeautyHub keeps the catalogue focused so discovering the right products doesn't feel overwhelming.",
  },
];

export default function WhyBeautyHub() {
  return (
    <section id="discover" className="border-y border-neutral-200 bg-[#fafaf9] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Why BeautyHub
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.05em] text-neutral-950 sm:text-5xl">
              Beauty shopping should feel simple.
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-neutral-600">
              BeautyHub is built around a simple idea: finding and buying
              beauty products shouldn't require endless searching, conflicting
              information or unclear pricing.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                    <span className="text-xs font-semibold tracking-[0.15em] text-neutral-400">
                      {feature.number}
                    </span>

                    <Icon className="h-5 w-5 text-neutral-500" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-neutral-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}