"use client";

import {
  GripVertical,
  ImageIcon,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDeleteProductImage, useProductImages, useReorderProductImages, useSetPrimaryProductImage } from "@/hooks/useProductImage";

interface ProductImageManagerProps {
  productId: string;
}

export function ProductImageManager({
  productId,
}: ProductImageManagerProps) {
  const {
    data: images = [],
    isLoading,
    isError,
  } = useProductImages(productId);

  const deleteMutation =
    useDeleteProductImage(productId);

  const primaryMutation =
    useSetPrimaryProductImage(productId);

  const reorderMutation =
    useReorderProductImages(productId);

  const [draggedId, setDraggedId] =
    useState<string | null>(null);

  function handleDrop(targetId: string) {
    if (
      !draggedId ||
      draggedId === targetId
    ) {
      return;
    }

    const currentIds = images.map(
      (image) => image.id,
    );

    const fromIndex =
      currentIds.indexOf(draggedId);

    const toIndex =
      currentIds.indexOf(targetId);

    if (
      fromIndex === -1 ||
      toIndex === -1
    ) {
      return;
    }

    const nextIds = [...currentIds];

    const [moved] = nextIds.splice(
      fromIndex,
      1,
    );

    nextIds.splice(toIndex, 0, moved);

    reorderMutation.mutate(nextIds);

    setDraggedId(null);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-2xl bg-neutral-100"
            />
          ),
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Unable to load product images.
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center">
        <ImageIcon className="mx-auto h-8 w-8 text-neutral-400" />

        <p className="mt-3 text-sm font-medium text-neutral-800">
          No product images yet
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          Upload at least one clear image for
          this product.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <motion.div
          key={image.id}
          layout
          draggable
          onDragStart={() =>
            setDraggedId(image.id)
          }
          onDragOver={(event) =>
            event.preventDefault()
          }
          onDrop={() =>
            handleDrop(image.id)
          }
          className={[
            "group overflow-hidden rounded-2xl border bg-white shadow-sm transition",
            draggedId === image.id
              ? "border-neutral-950 opacity-50"
              : "border-neutral-200",
          ].join(" ")}
        >
          <div className="relative aspect-square overflow-hidden bg-neutral-100">
            <img
              src={image.url}
              alt={
                image.altText ||
                "Product image"
              }
              className="h-full w-full object-cover"
            />

            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-neutral-700 shadow-sm">
              <GripVertical className="h-3 w-3" />
              Drag
            </div>

            {image.isPrimary && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                <Star className="h-3 w-3 fill-current" />
                Primary
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 p-3">
            {!image.isPrimary && (
              <button
                type="button"
                disabled={
                  primaryMutation.isPending
                }
                onClick={() =>
                  primaryMutation.mutate(
                    image.id,
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 disabled:opacity-50"
              >
                {primaryMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Star className="h-3.5 w-3.5" />
                )}

                Make primary
              </button>
            )}

            <button
              type="button"
              disabled={
                deleteMutation.isPending
              }
              onClick={() =>
                deleteMutation.mutate(
                  image.id,
                )
              }
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="Delete image"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}