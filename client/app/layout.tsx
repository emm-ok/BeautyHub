import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "@/config/clerk";
import Providers from "./providers";
import Navbar from "@/components/landing/Navbar";
import { CartProvider } from "@/components/layout/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeautyHub",
  description: "BeautyHub Store - Purchase authentic and verified beauty and skin care products",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <Providers>
            <CartProvider>
              <Navbar />

              {children}

              <CartDrawer />
            </CartProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
