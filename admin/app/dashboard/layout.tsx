import type { Metadata } from "next";

import AdminSidebar from "@/components/dashboard/AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin | BeautyHub",
    template: "%s | BeautyHub Admin",
  },
  description:
    "BeautyHub administration and store management.",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminSidebar />

      <main className="min-h-screen lg:pl-[264px]">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}