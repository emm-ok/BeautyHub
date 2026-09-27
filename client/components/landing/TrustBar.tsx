"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  CreditCard,
  Truck,
} from "lucide-react";

const items = [
  {
    icon: BadgeCheck,
    title: "Curated products",
    description: "Thoughtfully selected",
  },
  {
    icon: BookOpen,
    title: "Product education",
    description: "Know what you buy",
  },
  {
    icon: CreditCard,
    title: "Transparent pricing",
    description: "Clear from start to finish",
  },
  {
    icon: Truck,
    title: "Reliable delivery",
    description: "Updates through WhatsApp",
  },
];

export default function TrustBar() {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-neutral-200 lg:grid-cols-4 lg:divide-y-0">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="flex items-center gap-3 px-5 py-6 sm:px-8"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                <Icon className="h-4 w-4 text-neutral-700" />
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {item.title}
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}