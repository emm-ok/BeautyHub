"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AnimatePresence,
  motion,
  type Variants,
} from "framer-motion";

import {
  Menu,
  Search,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { useCart } from "@/hooks/useCart";

import {
  useCartDrawer,
} from "@/components/layout/CartProvider";
import { toast } from "sonner";

const navigation = [
  {
    label: "Featured",
    href: "#featured-products",
  },
  {
    label: "Categories",
    href: "#categories",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Find What I Need",
    href: "/discover",
  },
];

const mobileMenuVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },

  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const mobileContentVariants = {
  closed: {
    opacity: 0,
    y: -8,
  },

  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      delay: 0.05,
    },
  },
};

export default function Navbar() {
  const {
    isSignedIn,
    isLoaded,
  } = useUser();

  const {
    openCart,
  } = useCartDrawer();

  const {
    data: cart,
  } = useCart();

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const cartCount = isSignedIn
    ? cart?.summary.totalItems ?? 0
    : 0;

  const handleCartClick = () => {
    closeMobileMenu();

    if (!isSignedIn) {
      toast("Please sign in to view cart")
      return;
    }

    openCart();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            onClick={
              closeMobileMenu
            }
            className="group flex items-center gap-2.5"
          >
            <motion.div
              whileHover={{
                rotate: 4,
                scale: 1.04,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-sm"
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
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {navigation.map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
                >
                  {item.label}

                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-neutral-950 transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              )
            )}
          </nav>

          {/* Global Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search */}
            <Link
              href="/products"
              aria-label="Search products"
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-950"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>

            {/* Cart */}
            <motion.button
              type="button"
              onClick={handleCartClick}
              aria-label={
                cartCount > 0
                  ? `Shopping cart with ${cartCount} items`
                  : "Shopping cart"
              }
              whileTap={{
                scale: 0.94,
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-950"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />

              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{
                      opacity: 0,
                      scale: 0.5,
                      y: -4,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 25,
                    }}
                    className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-neutral-950 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white"
                  >
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Desktop Authentication */}
            {isLoaded && (
              <div className="hidden items-center gap-1 sm:flex">
                {!isSignedIn ? (
                  <>
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
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
                        avatarBox:
                          "h-9 w-9",
                      },
                    }}
                  />
                )}
              </div>
            )}

            {/* Mobile Menu */}
            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={
                mobileMenuOpen
              }
              aria-controls="mobile-navigation"
              onClick={() =>
                setMobileMenuOpen(
                  (current) =>
                    !current
                )
              }
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-950 lg:hidden"
            >
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{
                      opacity: 0,
                      rotate: -45,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: 45,
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{
                      opacity: 0,
                      rotate: 45,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: -45,
                      scale: 0.8,
                    }}
                    transition={{
                      duration: 0.18,
                    }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial="closed"
              animate="open"
              exit="closed"
              variants={
                mobileMenuVariants
              }
              className="overflow-hidden lg:hidden"
            >
              <motion.div
                variants={
                  mobileContentVariants
                }
                className="border-t border-neutral-100 py-5"
              >
                <nav
                  aria-label="Mobile navigation"
                  className="space-y-1"
                >
                  {navigation.map(
                    (
                      item,
                      index
                    ) => (
                      <motion.div
                        key={
                          item.href
                        }
                        initial={{
                          opacity: 0,
                          x: -8,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 0.2,
                          delay:
                            0.04 *
                            index,
                        }}
                      >
                        <Link
                          href={
                            item.href
                          }
                          onClick={
                            closeMobileMenu
                          }
                          className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
                        >
                          <span>
                            {
                              item.label
                            }
                          </span>

                          <span className="text-neutral-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-neutral-600">
                            →
                          </span>
                        </Link>
                      </motion.div>
                    )
                  )}
                </nav>

                <div className="my-5 h-px bg-neutral-100" />

                {/* Mobile cart */}
                <motion.button
                  type="button"
                  onClick={
                    handleCartClick
                  }
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.25,
                    delay: 0.15,
                  }}
                  className="mb-4 flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
                >
                  <span className="flex items-center gap-3">
                    <ShoppingCart className="h-4 w-4 text-neutral-500" />
                    Shopping cart
                  </span>

                  {cartCount > 0 && (
                    <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-semibold text-white">
                      {cartCount}
                    </span>
                  )}
                </motion.button>

                {/* Mobile authentication */}
                {isLoaded && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.25,
                      delay: 0.2,
                    }}
                  >
                    {!isSignedIn ? (
                      <div className="grid grid-cols-2 gap-3">
                        <SignInButton mode="modal">
                          <button
                            type="button"
                            onClick={
                              closeMobileMenu
                            }
                            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
                          >
                            Sign in
                          </button>
                        </SignInButton>

                        <SignUpButton mode="modal">
                          <button
                            type="button"
                            onClick={
                              closeMobileMenu
                            }
                            className="rounded-xl bg-neutral-950 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800"
                          >
                            Get started
                          </button>
                        </SignUpButton>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-950">
                            Your account
                          </p>

                          <p className="mt-0.5 text-xs text-neutral-500">
                            Manage your BeautyHub account
                          </p>
                        </div>

                        <UserButton
                          appearance={{
                            elements: {
                              avatarBox:
                                "h-9 w-9",
                            },
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}