"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronUp } from "lucide-react";
import { motion, Variants } from "framer-motion";

import FooterLinkGroup from "./FooterLinkGroup";
import FooterTrustStrip from "./FooterTrustStrip";

const shopLinks = [
  {
    label: "All products",
    href: "/products",
  },
  {
    label: "Skincare",
    href: "/products",
  },
  {
    label: "Body care",
    href: "/products",
  },
];

const discoverLinks = [
  {
    label: "Find what I need",
    href: "/discover",
  },
  {
    label: "Shop by concern",
    href: "/discover",
  },
  {
    label: "Product education",
    href: "/products",
  },
];

const beautyHubLinks = [
  {
    label: "About BeautyHub",
    href: "/#about",
  },
  {
    label: "How it works",
    href: "/#how-it-works",
  },
  {
    label: "Categories",
    href: "/#categories",
  },
];

const supportLinks = [
  {
    label: "Contact us",
    href: "/contact",
  },
  {
    label: "Delivery information",
    href: "/delivery",
  },
  {
    label: "FAQs",
    href: "/faq",
  },
];

const footerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-white">
      {/* Trust strip */}
      <FooterTrustStrip />

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerVariants}
          className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-10"
        >
          {/* Brand */}
          <motion.div variants={footerVariants} className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="BeautyHub home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900 text-sm font-semibold text-white">
                B
              </span>

              <span className="text-lg font-semibold tracking-[-0.03em]">
                BeautyHub
              </span>
            </Link>

            <p className="mt-6 text-sm leading-7 text-neutral-400">
              A trusted beauty destination for discovering skincare and
              body-care products with clearer information and less guesswork.
            </p>

            <Link
              href="/discover"
              className="group mt-7 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-white px-4 py-2.5 text-sm font-medium text-neutral-950 transition-all duration-300 hover:bg-neutral-100"
            >
              Find what I need

              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </Link>
          </motion.div>

          {/* Links */}
          <motion.div variants={footerVariants}>
            <FooterLinkGroup
              title="Shop"
              links={shopLinks}
            />
          </motion.div>

          <motion.div variants={footerVariants}>
            <FooterLinkGroup
              title="Discover"
              links={discoverLinks}
            />
          </motion.div>

          <motion.div variants={footerVariants}>
            <FooterLinkGroup
              title="BeautyHub"
              links={beautyHubLinks}
            />
          </motion.div>

          <motion.div variants={footerVariants}>
            <FooterLinkGroup
              title="Support"
              links={supportLinks}
            />
          </motion.div>
        </motion.div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-[2rem] border border-neutral-800 bg-neutral-900/60 px-6 py-10 sm:px-10 sm:py-12"
        >
          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.035] blur-3xl"
          />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Start with what you need
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                Less guesswork. Better beauty decisions.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-400">
                Explore the catalogue or use guided discovery to narrow down
                products that fit your needs.
              </p>
            </div>

            <Link
              href="/discover"
              className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-950 transition-all duration-300 hover:bg-neutral-100"
            >
              Start discovering

              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 border-t border-neutral-800 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            © {currentYear} BeautyHub. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/privacy"
              className="text-xs text-neutral-500 transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-neutral-500 transition-colors hover:text-white"
            >
              Terms
            </Link>

            <Link
              href="/delivery"
              className="text-xs text-neutral-500 transition-colors hover:text-white"
            >
              Delivery
            </Link>

            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              aria-label="Back to top"
              className="group ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 text-neutral-500 transition-all duration-200 hover:border-neutral-600 hover:text-white"
            >
              <ChevronUp
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}