"use client";

import {
  ImagePlus,
  UploadCloud,
  X,
  AlertCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

interface PendingImage {
  id: string;
  file: File;
  preview: string;
  altText: string;
}

interface ProductImageUploadZoneProps {
  images: PendingImage[];
  onChange: (images: PendingImage[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function ProductImageUploadZone({
  images,
  onChange,
  disabled = false,
  maxImages = 8,
}: ProductImageUploadZoneProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const addFiles = useCallback(
    (files: File[]) => {
      setError(null);

      const availableSlots =
        maxImages - images.length;

      if (availableSlots <= 0) {
        setError(
          `You can upload up to ${maxImages} images.`,
        );
        return;
      }

      const selectedFiles = files.slice(
        0,
        availableSlots,
      );

      const invalidType = selectedFiles.find(
        (file) =>
          !ACCEPTED_TYPES.includes(file.type),
      );

      if (invalidType) {
        setError(
          "Only JPG, PNG, and WebP images are supported.",
        );
        return;
      }

      const oversized = selectedFiles.find(
        (file) => file.size > MAX_FILE_SIZE,
      );

      if (oversized) {
        setError(
          "Each image must be smaller than 5MB.",
        );
        return;
      }

      const newImages: PendingImage[] =
        selectedFiles.map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          altText: "",
        }));

      onChange([...images, ...newImages]);
    },
    [images, maxImages, onChange],
  );

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(
      event.target.files ?? [],
    );

    addFiles(files);

    event.target.value = "";
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    setIsDragging(false);

    if (disabled) {
      return;
    }

    addFiles(
      Array.from(event.dataTransfer.files),
    );
  }

  function removeImage(id: string) {
    const image = images.find(
      (item) => item.id === id,
    );

    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    onChange(
      images.filter((item) => item.id !== id),
    );
  }

  function updateAltText(
    id: string,
    altText: string,
  ) {
    onChange(
      images.map((image) =>
        image.id === id
          ? {
              ...image,
              altText,
            }
          : image,
      ),
    );
  }

  return (
    <div className="space-y-5">
      <div
        onDragOver={(event) => {
          event.preventDefault();

          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() =>
          setIsDragging(false)
        }
        onDrop={handleDrop}
        onClick={() =>
          !disabled && inputRef.current?.click()
        }
        className={[
          "group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
          isDragging
            ? "border-neutral-950 bg-neutral-100"
            : "border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100/70",
          disabled
            ? "cursor-not-allowed opacity-60"
            : "",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          disabled={disabled}
          onChange={handleInputChange}
        />

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200">
          {isDragging ? (
            <UploadCloud className="h-5 w-5 text-neutral-900" />
          ) : (
            <ImagePlus className="h-5 w-5 text-neutral-700" />
          )}
        </div>

        <h3 className="mt-4 text-sm font-semibold text-neutral-950">
          {isDragging
            ? "Drop images here"
            : "Upload product images"}
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-neutral-500">
          Drag and drop images here or click to
          browse. Use clear product photography with
          a maximum file size of 5MB per image.
        </p>

        <div className="mt-4 flex justify-center gap-2 text-xs font-medium text-neutral-400">
          <span>JPG</span>
          <span>•</span>
          <span>PNG</span>
          <span>•</span>
          <span>WebP</span>
          <span>•</span>
          <span>
            {images.length}/{maxImages}
          </span>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <img
                  src={image.preview}
                  alt={
                    image.altText ||
                    `Product image ${index + 1}`
                  }
                  className="h-full w-full object-cover"
                />

                {index === 0 && (
                  <div className="absolute left-2 top-2 rounded-full bg-neutral-950 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Primary
                  </div>
                )}

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeImage(image.id);
                  }}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-100 shadow-sm transition hover:bg-white hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3">
                <label className="text-xs font-medium text-neutral-500">
                  Alt text
                </label>

                <input
                  value={image.altText}
                  onChange={(event) =>
                    updateAltText(
                      image.id,
                      event.target.value,
                    )
                  }
                  placeholder="Describe this image"
                  className="mt-1.5 h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 text-xs outline-none transition focus:border-neutral-400 focus:bg-white"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}