"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Droplets,
  FlaskConical,
  Heart,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    title: "Cleansers",
    description: "Start with a clean foundation.",
    icon: Droplets,
    href: "/products?category=cleansers",
    size: "large",
  },
  {
    title: "Serums",
    description: "Targeted care for specific concerns.",
    icon: FlaskConical,
    href: "/products?category=serums",
    size: "small",
  },
  {
    title: "Moisturisers",
    description: "Keep your skin balanced and hydrated.",
    icon: Heart,
    href: "/products?category=moisturisers",
    size: "small",
  },
  {
    title: "Body Care",
    description: "Care beyond your face.",
    icon: Layers3,
    href: "/products?category=body-care",
    size: "large",
  },
];

export default function FeaturedCategories() {
  return (
    <section id="categories" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-neutral-500" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Explore the collection
              </span>
            </div>

            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">
              Start with what your skin needs.
            </h2>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-700"
          >
            View all products

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
              >
                <Link
                  href={category.href}
                  className={`group relative block overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-neutral-50 ${
                    category.size === "large"
                      ? "min-h-[320px]"
                      : "min-h-[260px]"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-neutral-200/50" />

                  <div className="relative flex h-full flex-col justify-between p-7 sm:p-9">
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
                        <Icon className="h-5 w-5 text-neutral-700" />
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight className="h-4 w-4 text-neutral-600" />
                      </div>
                    </div>

                    <div className="mt-20">
                      <h3 className="text-2xl font-semibold tracking-[-0.035em] text-neutral-950">
                        {category.title}
                      </h3>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}