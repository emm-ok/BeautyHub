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

      <main
        className="min-h-screen pt-[68px] lg:pl-[264px] lg:pt-0 "
      >
        <div
          className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 "
        >
          {children}
        </div>
      </main>
    </div>
  );
}