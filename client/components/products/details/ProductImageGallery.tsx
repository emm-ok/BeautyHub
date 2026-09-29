"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { ProductImage } from "@/types/products";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const activeImage =
    images[activeIndex];

  return (
    <div className="grid gap-4 lg:grid-cols-[88px_minmax(0,1fr)]">
      {/* Thumbnails */}
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
        {images.length > 0 ? (
          images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() =>
                setActiveIndex(index)
              }
              className={[
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-neutral-50 transition",
                activeIndex === index
                  ? "border-neutral-950 ring-1 ring-neutral-950"
                  : "border-neutral-200 hover:border-neutral-400",
              ].join(" ")}
              aria-label={`View image ${
                index + 1
              }`}
            >
              <Image
                src={image.url}
                alt={
                  image.altText ||
                  `${productName} image ${
                    index + 1
                  }`
                }
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
            <ImageIcon className="h-5 w-5 text-neutral-300" />
          </div>
        )}
      </div>

      {/* Main image */}
      <div className="order-1 relative aspect-square overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-50 lg:order-2">
        <AnimatePresence mode="wait">
          {activeImage ? (
            <motion.div
              key={activeImage.id}
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.01,
              }}
              transition={{
                duration: 0.25,
              }}
              className="absolute inset-0"
            >
              <Image
                src={activeImage.url}
                alt={
                  activeImage.altText ||
                  productName
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <ImageIcon className="mx-auto h-10 w-10 text-neutral-300" />

                <p className="mt-3 text-sm text-neutral-400">
                  Product image unavailable
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}