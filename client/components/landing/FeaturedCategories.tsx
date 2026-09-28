"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Droplets,
  FlaskConical,
  Heart,
  Layers3,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    title: "Cleansers",
    description: "Start with a clean foundation.",
    icon: Droplets,
    href: "/products?category=cleansers",
    size: "large",
    image:
      "/assets/category/beautyhub-catg-img1.jpg",
  },
  {
    title: "Serums",
    description: "Targeted care for specific concerns.",
    icon: FlaskConical,
    href: "/products?category=serums",
    size: "small",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Moisturisers",
    description: "Keep your skin balanced and hydrated.",
    icon: Heart,
    href: "/products?category=moisturisers",
    size: "small",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Body Care",
    description: "Care beyond your face.",
    icon: Layers3,
    href: "/products?category=body-care",
    size: "large",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function FeaturedCategories() {
  return (
    <section id="categories" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
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

        {/* Categories */}
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
                  className={`group relative block overflow-hidden rounded-[1.75rem] border border-neutral-200 ${
                    category.size === "large"
                      ? "min-h-[320px]"
                      : "min-h-[260px]"
                  }`}
                >
                  {/* Background Image */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.08 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <img
                      src={category.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </motion.div>

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/35" />

                  {/* Bottom Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="relative flex h-full flex-col justify-between p-7 sm:p-9">
                    {/* Top */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 shadow-sm backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-neutral-800" />
                      </div>

                      <motion.div
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/90 backdrop-blur-sm"
                        whileHover={{ rotate: 45 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4 text-neutral-700" />
                      </motion.div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-20">
                      <h3 className="text-2xl font-semibold tracking-[-0.035em] text-white">
                        {category.title}
                      </h3>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
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