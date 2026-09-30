"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface AdminNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export default function AdminNavItem({
  href,
  label,
  icon: Icon,
  exact = false,
}: AdminNavItemProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname === href ||
      pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className="relative block"
    >
      <div
        className={`
          group relative flex items-center gap-3
          rounded-xl px-3 py-2.5
          text-sm font-medium
          transition-colors duration-200
          ${
            isActive
              ? "text-neutral-950"
              : "text-neutral-500 hover:text-neutral-900"
          }
        `}
      >
        {isActive && (
          <motion.div
            layoutId="admin-sidebar-active"
            className="absolute inset-0 rounded-xl bg-neutral-100"
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
          />
        )}

        <span
          className={`
            relative z-10 flex h-8 w-8
            items-center justify-center
            rounded-lg
            transition-colors duration-200
            ${
              isActive
                ? "bg-white text-neutral-950 shadow-sm ring-1 ring-neutral-200"
                : "text-neutral-400 group-hover:text-neutral-800"
            }
          `}
        >
          <Icon className="h-[17px] w-[17px]" />
        </span>

        <span className="relative z-10 truncate">
          {label}
        </span>

        {isActive && (
          <motion.span
            layoutId="admin-sidebar-indicator"
            className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-neutral-950"
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
          />
        )}
      </div>
    </Link>
  );
}