"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Truck,
  Search,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Discover",
    description:
      "Browse products based on what you're looking for, from skincare essentials to body care.",
  },
  {
    step: "02",
    icon: ShoppingBag,
    title: "Choose",
    description:
      "Understand the product, check the price and add what works for you to your cart.",
  },
  {
    step: "03",
    icon: Truck,
    title: "Receive",
    description:
      "Complete your order and receive delivery updates directly through WhatsApp.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            How it works
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-neutral-950 sm:text-5xl">
            From discovery to delivery, without the friction.
          </h2>
        </div>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div className="absolute left-[16.67%] right-[16.67%] top-10 hidden h-px bg-neutral-200 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="relative text-center"
              >
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm">
                  <Icon className="h-6 w-6 text-neutral-800" />
                </div>

                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Step {step.step}
                </p>

                <h3 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-neutral-500">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-neutral-700" />

          <p className="text-sm text-neutral-600">
            Clear products. Clear prices. Clear delivery updates.
          </p>

          <ArrowRight className="hidden h-4 w-4 text-neutral-400 sm:block" />
        </motion.div>
      </div>
    </section>
  );
}