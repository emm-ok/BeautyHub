"use client";

import Link from "next/link";
import {
  ChevronRight,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

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

export default function AdminSidebar() {
  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        w-[264px]
        border-r
        border-neutral-200
        bg-white
        lg:flex
        lg:flex-col
      "
    >
      {/* Brand */}
      <div className="flex h-[76px] items-center border-b border-neutral-100 px-5">
        <Link
          href="/dashboard"
          className="group flex items-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
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

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-neutral-950">
              BeautyHub
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              Admin Console
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
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
      </div>

      {/* Bottom section */}
      <div className="border-t border-neutral-100 p-3">
        {/* Admin account */}
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 px-3 py-3">
          <div className="shrink-0">
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "h-9 w-9 ring-1 ring-neutral-200",
                },
              }}
              // afterSignOutUrl="/"
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
  );
}