"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Sparkles } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 4, scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white"
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>

          <div className="leading-none">
            <span className="block text-[17px] font-semibold tracking-[-0.03em] text-neutral-950">
              BeautyHub
            </span>

            <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.24em] text-neutral-400">
              Beauty, made simpler
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="#discover"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
          >
            Discover
          </Link>

          <Link
            href="#categories"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
          >
            Categories
          </Link>

          <Link
            href="#how-it-works"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
          >
            How it works
          </Link>

          <Link
            href="#about"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 sm:flex"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
          </Link>

          {/* Clerk Authentication */}
          {isLoaded && (
            <>
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="hidden px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950 sm:block"
                    >
                      Sign in
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md"
                    >
                      Get started
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}