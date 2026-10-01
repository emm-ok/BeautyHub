"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  LayoutDashboard,
  Menu,
  Package,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion, Variants } from "framer-motion";
import AdminNavItem from "./AdminNavItem";

const primaryNavigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/dashboard/orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    href: "/dashboard/users",
    label: "Users",
    icon: Users,
  },
];

const drawerVariants: Variants = {
  hidden: {
    x: "-100%",
  },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 320,
      damping: 32,
    },
  },
  exit: {
    x: "-100%",
    transition: {
      duration: 0.22,
      ease: "easeInOut",
    },
  },
};

const backdropVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.18,
    },
  },
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((previous) => !previous);
  };

  /*
   * Close the mobile drawer whenever
   * the route changes.
   */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /*
   * Close drawer with Escape.
   */
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  /*
   * Prevent background scrolling while
   * the mobile navigation is open.
   */
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================== */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-[264px]
          border-r
          border-neutral-200/80
          bg-white
          lg:flex
          lg:flex-col
        "
      >
        {/* Brand */}
        <div
          className="
            flex
            h-[76px]
            shrink-0
            items-center
            border-b
            border-neutral-100
            px-5
          "
        >
          <Link
            href="/dashboard"
            className="group flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                scale: 1.04,
                rotate: 2,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-neutral-950
                text-white
                shadow-sm
              "
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  tracking-tight
                  text-neutral-950
                "
              >
                BeautyHub
              </p>

              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-neutral-400
                "
              >
                Admin Console
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <div>
            <p
              className="
                mb-2
                px-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-neutral-400
              "
            >
              Workspace
            </p>

            <nav
              aria-label="Admin navigation"
              className="space-y-1"
            >
              {primaryNavigation.map((item) => (
                <AdminNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  exact={item.exact}
                />
              ))}
            </nav>
          </div>

          <div className="my-6 h-px bg-neutral-100" />

          <div
            className="
              rounded-2xl
              border
              border-neutral-100
              bg-neutral-50/70
              p-3
            "
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    ring-1
                    ring-neutral-200
                  "
                >
                  <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-neutral-800">
                  Store workspace
                </p>

                <p className="mt-0.5 text-[10px] leading-4 text-neutral-400">
                  Manage your BeautyHub catalogue and operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="shrink-0 border-t border-neutral-100 p-3">
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-neutral-200
              bg-neutral-50/70
              px-3
              py-3
            "
          >
            <div className="shrink-0">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-9 w-9 ring-1 ring-neutral-200",
                  },
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-neutral-900">
                Admin account
              </p>

              <p className="truncate text-[11px] text-neutral-400">
                Manage account
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
          </div>

          <p className="mt-3 px-2 text-[10px] leading-4 text-neutral-400">
            BeautyHub Administration
          </p>
        </div>
      </aside>

      {/* =========================================================
          MOBILE HEADER
      ========================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-40
          flex
          h-[68px]
          items-center
          justify-between
          border-b
          border-neutral-200/80
          bg-white/90
          px-4
          backdrop-blur-xl
          lg:hidden
        "
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <motion.div
            whileTap={{ scale: 0.94 }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-neutral-950
              text-white
              shadow-sm
            "
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>

          <div>
            <p className="text-sm font-semibold tracking-tight text-neutral-950">
              BeautyHub
            </p>

            <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-neutral-400">
              Admin Console
            </p>
          </div>
        </Link>

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={toggleMobileMenu}
          aria-label={
            mobileOpen
              ? "Close admin navigation"
              : "Open admin navigation"
          }
          aria-expanded={mobileOpen}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-neutral-200
            bg-white
            text-neutral-700
            shadow-sm
            transition
            hover:bg-neutral-50
            focus:outline-none
            focus:ring-4
            focus:ring-neutral-100
          "
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.16 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                transition={{ duration: 0.16 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </header>

      {/* =========================================================
          MOBILE DRAWER
      ========================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close navigation"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeMobileMenu}
              className="
                fixed
                inset-0
                z-50
                cursor-default
                bg-neutral-950/30
                backdrop-blur-[3px]
                lg:hidden
              "
            />

            {/* Drawer */}
            <motion.aside
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation"
              className="
                fixed
                inset-y-0
                left-0
                z-[60]
                flex
                w-[min(86vw,320px)]
                flex-col
                overflow-hidden
                border-r
                border-neutral-200
                bg-white
                shadow-2xl
                lg:hidden
              "
            >
              {/* Drawer Header */}
              <div
                className="
                  flex
                  h-[76px]
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-neutral-100
                  px-5
                "
              >
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3"
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-xl
                      bg-neutral-950
                      text-white
                    "
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold tracking-tight text-neutral-950">
                      BeautyHub
                    </p>

                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                      Admin Console
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close admin navigation"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    text-neutral-400
                    transition
                    hover:bg-neutral-100
                    hover:text-neutral-900
                  "
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Navigation */}
              <div className="flex-1 overflow-y-auto px-3 py-6">
                <p
                  className="
                    mb-2
                    px-3
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-neutral-400
                  "
                >
                  Workspace
                </p>

                <nav
                  aria-label="Admin navigation"
                  className="space-y-1"
                >
                  {primaryNavigation.map((item) => (
                    <div
                      key={item.href}
                      onClick={closeMobileMenu}
                    >
                      <AdminNavItem
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        exact={item.exact}
                      />
                    </div>
                  ))}
                </nav>

                <div className="my-6 h-px bg-neutral-100" />

                <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-white
                        ring-1
                        ring-neutral-200
                      "
                    >
                      <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-neutral-800">
                        Store workspace
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-neutral-400">
                        Manage your catalogue and store operations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Account */}
              <div className="shrink-0 border-t border-neutral-100 p-3">
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-neutral-200
                    bg-neutral-50/70
                    px-3
                    py-3
                  "
                >
                  <div className="shrink-0">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox:
                            "h-9 w-9 ring-1 ring-neutral-200",
                        },
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-neutral-900">
                      Admin account
                    </p>

                    <p className="truncate text-[11px] text-neutral-400">
                      Manage account
                    </p>
                  </div>
                </div>

                <p className="mt-3 px-2 text-[10px] leading-4 text-neutral-400">
                  BeautyHub Administration
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}