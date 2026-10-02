"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  ImagePlus,
  Loader2,
  GripVertical,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import {
  useActiveCategories,
  useProduct,
  useUpdateProduct,
} from "@/hooks/useProducts";

import {
  useDeleteProductImage,
  useProductImages,
  useReorderProductImages,
  useSetPrimaryProductImage,
  useUploadProductImage,
} from "@/hooks/useProductImage";

import type {
  Product,
  ProductConcern,
  SkinType,
  UpdateProductInput,
} from "@/types/products";
import Image from "next/image";

/* =========================================================
   OPTIONS
========================================================= */

const SKIN_TYPE_OPTIONS: {
  value: SkinType;
  label: string;
}[] = [
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "DRY",
    label: "Dry",
  },
  {
    value: "OILY",
    label: "Oily",
  },
  {
    value: "COMBINATION",
    label: "Combination",
  },
  {
    value: "SENSITIVE",
    label: "Sensitive",
  },
  {
    value: "ALL",
    label: "All skin types",
  },
  {
    value: "UNKNOWN",
    label: "Unknown",
  },
];

const CONCERN_OPTIONS: {
  value: ProductConcern;
  label: string;
}[] = [
  {
    value: "ACNE_PRONE",
    label: "Acne prone",
  },
  {
    value: "DARK_SPOTS",
    label: "Dark spots",
  },
  {
    value: "UNEVEN_SKIN_TONE",
    label: "Uneven skin tone",
  },
  {
    value: "DRYNESS",
    label: "Dryness",
  },
  {
    value: "OILY_SKIN",
    label: "Oily skin",
  },
  {
    value: "SENSITIVE_SKIN",
    label: "Sensitive skin",
  },
  {
    value: "ROUGH_SKIN",
    label: "Rough skin",
  },
  {
    value: "BUMPY_SKIN",
    label: "Bumpy skin",
  },
  {
    value: "BODY_ACNE",
    label: "Body acne",
  },
  {
    value: "ANTI_AGING",
    label: "Anti-aging",
  },
  {
    value: "GENERAL_SKINCARE",
    label: "General skincare",
  },
  {
    value: "GENERAL_BODY_CARE",
    label: "General body care",
  },
];

const MAX_NEW_IMAGES = 8;

const inputClass = `
  h-11
  w-full
  rounded-xl
  border
  border-neutral-200
  bg-white
  px-3
  text-sm
  text-neutral-900
  outline-none
  transition
  placeholder:text-neutral-400
  focus:border-neutral-400
  focus:ring-4
  focus:ring-neutral-100
`;

const textareaClass = `
  min-h-[110px]
  w-full
  resize-none
  rounded-xl
  border
  border-neutral-200
  bg-white
  px-3
  py-3
  text-sm
  leading-6
  text-neutral-900
  outline-none
  transition
  placeholder:text-neutral-400
  focus:border-neutral-400
  focus:ring-4
  focus:ring-neutral-100
`;

/* =========================================================
   TYPES
========================================================= */

interface UpdateProductDrawerProps {
  open: boolean;
  productId: string | null;
  onClose: () => void;
}

interface PendingImage {
  id: string;
  file: File;
  preview: string;
  altText: string;
  status: "pending" | "uploading" | "uploaded" | "error";
  error?: string;
}

/* =========================================================
   HELPERS
========================================================= */

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong.";
}

function getProductData(product: Product | undefined) {
  return product;
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-neutral-100 px-5 py-7 sm:px-7">
      <div className="mb-6 flex gap-4">
        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-neutral-100
            text-[10px]
            font-semibold
            text-neutral-500
          "
        >
          {number}
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-tight text-neutral-950">
            {title}
          </h2>

          {description && (
            <p className="mt-1 max-w-lg text-xs leading-5 text-neutral-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-medium text-neutral-700">
          {label}
          {required && (
            <span className="ml-1 text-neutral-400">*</span>
          )}
        </label>

        {hint && (
          <span className="text-[10px] text-neutral-400">
            {hint}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function UpdateProductDrawer({
  open,
  productId,
  onClose,
}: UpdateProductDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrlsRef = useRef<Set<string>>(new Set());

  const [form, setForm] =
    useState<UpdateProductInput | null>(null);

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [pendingImages, setPendingImages] =
    useState<PendingImage[]>([]);

  const [imageUploadError, setImageUploadError] =
    useState<string | null>(null);

  const [draggedImageId, setDraggedImageId] =
    useState<string | null>(null);

  const [deletingImageId, setDeletingImageId] =
    useState<string | null>(null);

  const [primaryImageId, setPrimaryImageId] =
    useState<string | null>(null);

  /* =========================================================
     DATA
  ========================================================== */

  const productQuery = useProduct(
    productId ?? "",
  );

  const imagesQuery = useProductImages(
    productId ?? "",
  );

  const categoriesQuery =
    useActiveCategories();

  const updateProduct = useUpdateProduct();

  const uploadProductImage =
    useUploadProductImage(productId ?? "");

  const deleteProductImage =
    useDeleteProductImage(productId ?? "");

  const setPrimaryProductImage =
    useSetPrimaryProductImage(productId ?? "");

  const reorderProductImages =
    useReorderProductImages(productId ?? "");

  const product = getProductData(
    productQuery.data?.data as unknown as Product | undefined,
  );

  const existingImages =
    imagesQuery.data ?? [];

  /* =========================================================
     CLEANUP
  ========================================================== */

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach(
        (url) => URL.revokeObjectURL(url),
      );

      previewUrlsRef.current.clear();
    };
  }, []);

  /* =========================================================
     LOAD PRODUCT INTO FORM
  ========================================================== */

  useEffect(() => {
    if (!open || !product) {
      return;
    }

    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand ?? "",
      categoryId: product.categoryId,

      price: Number(product.price),

      discountType: product.discountType,

      discountValue:
        product.discountValue !== null &&
        product.discountValue !== undefined
          ? Number(product.discountValue)
          : undefined,

      stockQuantity: product.stockQuantity,

      lowStockThreshold:
        product.lowStockThreshold,

      status: product.status,

      verificationStatus:
        product.verificationStatus,

      howToUse:
        product.howToUse ?? "",

      keyIngredients:
        product.keyIngredients ?? "",

      benefits:
        product.benefits ?? "",

      suitabilityNotes:
        product.suitabilityNotes ?? "",

      warnings:
        product.warnings ?? "",

      size:
        product.size ?? "",

      unit:
        product.unit ?? "",

      skinTypes:
        product.skinTypes ?? [],

      concerns:
        product.concerns ?? [],
    });

    setErrors({});
  }, [open, product]);

  /* =========================================================
     SET PRIMARY IMAGE
  ========================================================== */

  useEffect(() => {
    const primary = existingImages.find(
      (image) => image.isPrimary,
    );

    setPrimaryImageId(
      primary?.id ?? null,
    );
  }, [existingImages]);

  /* =========================================================
     CLOSE ON ESCAPE
  ========================================================== */

  const isBusy =
    updateProduct.isPending ||
    uploadProductImage.isPending ||
    deleteProductImage.isPending ||
    setPrimaryProductImage.isPending ||
    reorderProductImages.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        !isBusy
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, isBusy, onClose]);

  /* =========================================================
     FORM HELPERS
  ========================================================== */

  const updateField = <
    K extends keyof UpdateProductInput,
  >(
    field: K,
    value: UpdateProductInput[K],
  ) => {
    setForm((previous) =>
      previous
        ? {
            ...previous,
            [field]: value,
          }
        : previous,
    );

    setErrors((previous) => {
      if (!previous[field as string]) {
        return previous;
      }

      const next = {
        ...previous,
      };

      delete next[field as string];

      return next;
    });
  };

  /* =========================================================
     SALE PRICE
  ========================================================== */

  const calculatedSalePrice =
    useMemo(() => {
      if (!form) {
        return 0;
      }

      const price = Number(form.price);

      if (!price || price <= 0) {
        return 0;
      }

      if (
        form.discountType === "NONE"
      ) {
        return price;
      }

      const discount = Number(
        form.discountValue ?? 0,
      );

      if (discount <= 0) {
        return price;
      }

      if (
        form.discountType === "PERCENTAGE"
      ) {
        return Math.max(
          0,
          price - price * (discount / 100),
        );
      }

      if (
        form.discountType ===
        "FIXED_AMOUNT"
      ) {
        return Math.max(
          0,
          price - discount,
        );
      }

      return price;
    }, [form]);

  /* =========================================================
     VALIDATION
  ========================================================== */

  const validate = () => {
    if (!form) {
      return false;
    }

    const nextErrors: Record<
      string,
      string
    > = {};

    if (!form.name?.trim()) {
      nextErrors.name =
        "Product name is required.";
    }

    if (!form.slug?.trim()) {
      nextErrors.slug =
        "Product slug is required.";
    }

    if (!form.description?.trim()) {
      nextErrors.description =
        "Product description is required.";
    }

    if (!form.categoryId) {
      nextErrors.categoryId =
        "Select a category.";
    }

    if (
      !form.price ||
      Number(form.price) <= 0
    ) {
      nextErrors.price =
        "Enter a valid product price.";
    }

    if (
      form.discountType !== "NONE"
    ) {
      const discount = Number(
        form.discountValue ?? 0,
      );

      if (discount <= 0) {
        nextErrors.discountValue =
          "Enter a valid discount.";
      }

      if (
        form.discountType ===
          "PERCENTAGE" &&
        discount > 100
      ) {
        nextErrors.discountValue =
          "Percentage discount cannot exceed 100%.";
      }

      if (
        form.discountType ===
          "FIXED_AMOUNT" &&
        discount >= Number(form.price)
      ) {
        nextErrors.discountValue =
          "Fixed discount must be lower than the product price.";
      }
    }

    if (
      Number(form.stockQuantity) < 0
    ) {
      nextErrors.stockQuantity =
        "Stock cannot be negative.";
    }

    if (
      Number(form.lowStockThreshold) < 0
    ) {
      nextErrors.lowStockThreshold =
        "Threshold cannot be negative.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =========================================================
     IMAGE VALIDATION
  ========================================================== */

  const validateImage = (
    file: File,
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      return "Only JPEG, PNG, and WebP images are allowed.";
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      return "Image must be smaller than 5MB.";
    }

    return null;
  };

  /* =========================================================
     ADD NEW IMAGES
  ========================================================== */

  const addImages = (
    files: File[],
  ) => {
    setImageUploadError(null);

    const availableSlots =
      Math.max(
        0,
        MAX_NEW_IMAGES -
          pendingImages.length,
      );

    if (availableSlots === 0) {
      setImageUploadError(
        `You can add a maximum of ${MAX_NEW_IMAGES} new images at once.`,
      );

      return;
    }

    const selectedFiles =
      files.slice(
        0,
        availableSlots,
      );

    const newImages: PendingImage[] =
      [];

    for (const file of selectedFiles) {
      const validationError =
        validateImage(file);

      if (validationError) {
        setImageUploadError(
          `${file.name}: ${validationError}`,
        );

        continue;
      }

      const preview =
        URL.createObjectURL(file);

      previewUrlsRef.current.add(
        preview,
      );

      newImages.push({
        id: crypto.randomUUID(),
        file,
        preview,
        altText:
          product?.name ?? "",
        status: "pending",
      });
    }

    setPendingImages(
      (previous) => [
        ...previous,
        ...newImages,
      ],
    );
  };

  /* =========================================================
     FILE INPUT
  ========================================================== */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );

    addImages(files);

    event.target.value = "";
  };

  /* =========================================================
     REMOVE PENDING IMAGE
  ========================================================== */

  const removePendingImage = (
    imageId: string,
  ) => {
    setPendingImages(
      (previous) => {
        const image =
          previous.find(
            (item) =>
              item.id === imageId,
          );

        if (image) {
          URL.revokeObjectURL(
            image.preview,
          );

          previewUrlsRef.current.delete(
            image.preview,
          );
        }

        return previous.filter(
          (item) =>
            item.id !== imageId,
        );
      },
    );
  };

  /* =========================================================
     UPDATE PENDING IMAGE ALT
  ========================================================== */

  const updatePendingImageAlt = (
    imageId: string,
    altText: string,
  ) => {
    setPendingImages(
      (previous) =>
        previous.map((image) =>
          image.id === imageId
            ? {
                ...image,
                altText,
              }
            : image,
        ),
    );
  };

  /* =========================================================
     UPLOAD NEW IMAGES
  ========================================================== */

 const uploadPendingImages = async () => {
  if (
    !productId ||
    pendingImages.length === 0
  ) {
    return true;
  }

  let hasFailure = false;

  for (const image of pendingImages) {
    if (image.status === "uploaded") {
      continue;
    }

    setPendingImages((previous) =>
      previous.map((item) =>
        item.id === image.id
          ? {
              ...item,
              status: "uploading",
              error: undefined,
            }
          : item,
      ),
    );

    try {
      await uploadProductImage.mutateAsync({
        file: image.file,
        altText: image.altText,
      });

      setPendingImages((previous) =>
        previous.map((item) =>
          item.id === image.id
            ? {
                ...item,
                status: "uploaded",
              }
            : item,
        ),
      );
    } catch (error) {
      hasFailure = true;

      const message =
        getErrorMessage(error);

      setPendingImages((previous) =>
        previous.map((item) =>
          item.id === image.id
            ? {
                ...item,
                status: "error",
                error: message,
              }
            : item,
        ),
      );
    }
  }

  return !hasFailure;
};
  /* =========================================================
     DELETE EXISTING IMAGE
  ========================================================== */

  const handleDeleteImage =
    async (
      imageId: string,
    ) => {
      if (
        !productId ||
        deletingImageId
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Delete this product image? This action cannot be undone.",
        );

      if (!confirmed) {
        return;
      }

      setDeletingImageId(
        imageId,
      );

      try {
        await deleteProductImage.mutateAsync(
          imageId,
        );
      } catch (error) {
        setImageUploadError(
          getErrorMessage(error),
        );
      } finally {
        setDeletingImageId(
          null,
        );
      }
    };

  /* =========================================================
     SET PRIMARY
  ========================================================== */

  const handleSetPrimary =
    async (
      imageId: string,
    ) => {
      if (
        !productId ||
        imageId === primaryImageId
      ) {
        return;
      }

      try {
        await setPrimaryProductImage.mutateAsync(
          imageId,
        );

        setPrimaryImageId(
          imageId,
        );
      } catch (error) {
        setImageUploadError(
          getErrorMessage(error),
        );
      }
    };

  /* =========================================================
     IMAGE REORDER
  ========================================================== */

  const handleDropImage =
    async (
      targetImageId: string,
    ) => {
      if (
        !draggedImageId ||
        draggedImageId ===
          targetImageId ||
        reorderProductImages.isPending
      ) {
        return;
      }

      const currentIds =
        existingImages.map(
          (image: any) => image.id,
        );

      const fromIndex =
        currentIds.indexOf(
          draggedImageId,
        );

      const toIndex =
        currentIds.indexOf(
          targetImageId,
        );

      if (
        fromIndex === -1 ||
        toIndex === -1
      ) {
        setDraggedImageId(null);
        return;
      }

      const nextIds = [
        ...currentIds,
      ];

      const [
        movedId,
      ] = nextIds.splice(
        fromIndex,
        1,
      );

      nextIds.splice(
        toIndex,
        0,
        movedId,
      );

      setDraggedImageId(null);

      try {
        await reorderProductImages.mutateAsync(
          nextIds,
        );
      } catch (error) {
        setImageUploadError(
          getErrorMessage(error),
        );
      }
    };

  /* =========================================================
     SUBMIT
  ========================================================== */

 const handleSubmit = async (
  event: React.FormEvent,
) => {
  event.preventDefault();

  if (
    !form ||
    !productId ||
    isBusy
  ) {
    return;
  }

  if (!validate()) {
    return;
  }

  try {
    await updateProduct.mutateAsync({
      productId,
      data: form,
    });

    const imagesUploaded =
      await uploadPendingImages();

    if (!imagesUploaded) {
      setImageUploadError(
        "Product changes were saved, but one or more images could not be uploaded.",
      );

      return;
    }

    onClose();
  } catch (error) {
    setErrors({
      form: getErrorMessage(error),
    });
  }
};

  /* =========================================================
     RESET
  ========================================================== */

  const handleClose = () => {
    if (isBusy) {
      return;
    }

    pendingImages.forEach(
      (image) => {
        URL.revokeObjectURL(
          image.preview,
        );

        previewUrlsRef.current.delete(
          image.preview,
        );
      },
    );

    setPendingImages([]);
    setImageUploadError(null);
    setErrors({});
    setForm(null);

    onClose();
  };

  /* =========================================================
     LOADING
  ========================================================== */

  if (!open) {
    return null;
  }

  const productLoading =
    productQuery.isLoading;

  /* =========================================================
     RENDER
  ========================================================== */

  return (
    <AnimatePresence>
      <motion.div
        key="update-product-drawer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        {/* Backdrop */}
        <motion.button
          type="button"
          aria-label="Close update product drawer"
          onClick={handleClose}
          disabled={isBusy}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            absolute
            inset-0
            cursor-default
            bg-neutral-950/25
            backdrop-blur-[3px]
          "
        />

        {/* Drawer */}
        <motion.aside
          initial={{
            x: "100%",
          }}
          animate={{
            x: 0,
          }}
          exit={{
            x: "100%",
          }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 34,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="update-product-title"
          className="
            absolute
            inset-y-0
            right-0
            flex
            w-full
            flex-col
            bg-white
            shadow-2xl
            sm:max-w-xl
          "
        >
          {/* =====================================================
              HEADER
          ====================================================== */}

          <header
            className="
              flex
              h-[76px]
              shrink-0
              items-center
              justify-between
              border-b
              border-neutral-100
              px-5
              sm:px-7
            "
          >
            <div className="min-w-0">
              <p
                className="
                  mb-1
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-neutral-400
                "
              >
                Catalogue / Edit product
              </p>

              <h1
                id="update-product-title"
                className="
                  truncate
                  text-base
                  font-semibold
                  tracking-tight
                  text-neutral-950
                "
              >
                {product?.name ??
                  "Update product"}
              </h1>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              aria-label="Close"
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-neutral-200
                text-neutral-400
                transition
                hover:bg-neutral-50
                hover:text-neutral-900
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* =====================================================
              CONTENT
          ====================================================== */}

          {productLoading || !form ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />

                <p className="mt-3 text-xs text-neutral-400">
                  Loading product...
                </p>
              </div>
            </div>
          ) : productQuery.isError ? (
            <div className="flex flex-1 items-center justify-center px-6">
              <div className="max-w-sm text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50
                    text-red-500
                  "
                >
                  <X className="h-4 w-4" />
                </div>

                <h2 className="mt-4 text-sm font-semibold text-neutral-900">
                  Unable to load product
                </h2>

                <p className="mt-1 text-xs leading-5 text-neutral-400">
                  {getErrorMessage(
                    productQuery.error,
                  )}
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 overflow-y-auto">
                {/* =================================================
                    01 BASIC INFORMATION
                ================================================== */}

                <FormSection
                  number="01"
                  title="Basic information"
                  description="Core catalogue information customers will see first."
                >
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Product name"
                        required
                      >
                        <input
                          value={form.name}
                          onChange={(event) =>
                            updateField(
                              "name",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                          placeholder="e.g. Hydrating Cleanser"
                        />

                        {errors.name && (
                          <p className="text-[11px] text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </Field>

                      <Field label="Brand">
                        <input
                          value={
                            form.brand ?? ""
                          }
                          onChange={(event) =>
                            updateField(
                              "brand",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                          placeholder="e.g. CeraVe"
                        />
                      </Field>
                    </div>

                    <Field
                      label="Product slug"
                      required
                      hint="Used in product URLs"
                    >
                      <input
                        value={form.slug}
                        onChange={(event) =>
                          updateField(
                            "slug",
                            event.target.value
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-",
                              ),
                          )
                        }
                        className={inputClass}
                        placeholder="hydrating-cleanser"
                      />

                      {errors.slug && (
                        <p className="text-[11px] text-red-500">
                          {errors.slug}
                        </p>
                      )}
                    </Field>

                    <Field
                      label="Category"
                      required
                    >
                      <div className="relative">
                        <select
                          value={
                            form.categoryId
                          }
                          onChange={(event) =>
                            updateField(
                              "categoryId",
                              event.target.value,
                            )
                          }
                          className={`${inputClass} appearance-none pr-10`}
                          disabled={
                            categoriesQuery.isLoading
                          }
                        >
                          <option value="">
                            {categoriesQuery.isLoading
                              ? "Loading categories..."
                              : "Select category"}
                          </option>

                          {categoriesQuery.data?.map(
                            (category) => (
                              <option
                                key={
                                  category.id
                                }
                                value={
                                  category.id
                                }
                              >
                                {category.name}
                              </option>
                            ),
                          )}
                        </select>

                        <ChevronDown
                          className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            h-4
                            w-4
                            -translate-y-1/2
                            text-neutral-400
                          "
                        />
                      </div>

                      {errors.categoryId && (
                        <p className="text-[11px] text-red-500">
                          {
                            errors.categoryId
                          }
                        </p>
                      )}
                    </Field>

                    <Field
                      label="Description"
                      required
                    >
                      <textarea
                        value={
                          form.description
                        }
                        onChange={(event) =>
                          updateField(
                            "description",
                            event.target.value,
                          )
                        }
                        className={textareaClass}
                        placeholder="Describe the product, what it is designed for, and what makes it useful."
                      />

                      {errors.description && (
                        <p className="text-[11px] text-red-500">
                          {
                            errors.description
                          }
                        </p>
                      )}
                    </Field>
                  </div>
                </FormSection>

                {/* =================================================
                    02 PRODUCT MEDIA
                ================================================== */}

                <FormSection
                  number="02"
                  title="Product media"
                  description="Manage the product gallery, primary image, image order, and accessibility text."
                >
                  <div className="space-y-5">
                    {/* Existing images */}

                    {imagesQuery.isLoading ? (
                      <div
                        className="
                          flex
                          h-32
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-dashed
                          border-neutral-200
                          bg-neutral-50
                        "
                      >
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading product images...
                        </div>
                      </div>
                    ) : existingImages.length >
                      0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-neutral-700">
                            Current gallery
                          </p>

                          <span className="text-[10px] text-neutral-400">
                            Drag to reorder
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {existingImages.map(
                            (image: any) => (
                              <motion.div
                                key={image.id}
                                layout
                                draggable
                                onDragStart={() =>
                                  setDraggedImageId(
                                    image.id,
                                  )
                                }
                                onDragOver={(event) =>
                                  event.preventDefault()
                                }
                                onDrop={() =>
                                  handleDropImage(
                                    image.id,
                                  )
                                }
                                className="
                                  group
                                  relative
                                  overflow-hidden
                                  rounded-2xl
                                  border
                                  border-neutral-200
                                  bg-neutral-50
                                "
                              >
                                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                                  <Image
                                    src={
                                      image.url
                                    }
                                    alt={
                                      image.altText ??
                                      product?.name
                                    }
                                    fill
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                      transition
                                      duration-500
                                      group-hover:scale-[1.03]
                                    "
                                  />

                                  <div
                                    className="
                                      absolute
                                      left-2
                                      top-2
                                      flex
                                      items-center
                                      gap-1
                                      rounded-lg
                                      bg-white/90
                                      px-2
                                      py-1
                                      text-[9px]
                                      font-semibold
                                      text-neutral-700
                                      shadow-sm
                                      backdrop-blur
                                    "
                                  >
                                    <GripVertical className="h-3 w-3 text-neutral-400" />
                                    Drag
                                  </div>

                                  {image.isPrimary && (
                                    <div
                                      className="
                                        absolute
                                        bottom-2
                                        left-2
                                        flex
                                        items-center
                                        gap-1
                                        rounded-lg
                                        bg-neutral-950
                                        px-2
                                        py-1
                                        text-[9px]
                                        font-semibold
                                        text-white
                                        shadow-sm
                                      "
                                    >
                                      <Star className="h-3 w-3 fill-current" />
                                      Primary
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteImage(
                                        image.id,
                                      )
                                    }
                                    disabled={
                                      deletingImageId ===
                                      image.id
                                    }
                                    className="
                                      absolute
                                      right-2
                                      top-2
                                      flex
                                      h-8
                                      w-8
                                      items-center
                                      justify-center
                                      rounded-lg
                                      bg-white/90
                                      text-neutral-500
                                      opacity-0
                                      shadow-sm
                                      backdrop-blur
                                      transition
                                      group-hover:opacity-100
                                      hover:bg-red-50
                                      hover:text-red-500
                                      disabled:opacity-70
                                    "
                                    aria-label="Delete image"
                                  >
                                    {deletingImageId ===
                                    image.id ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-3.5 w-3.5" />
                                    )}
                                  </button>
                                </div>

                                <div className="border-t border-neutral-200 bg-white p-2">
                                  {!image.isPrimary && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSetPrimary(
                                          image.id,
                                        )
                                      }
                                      disabled={
                                        setPrimaryProductImage.isPending
                                      }
                                      className="
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-1.5
                                        rounded-lg
                                        px-2
                                        py-2
                                        text-[10px]
                                        font-medium
                                        text-neutral-500
                                        transition
                                        hover:bg-neutral-50
                                        hover:text-neutral-900
                                      "
                                    >
                                      <Star className="h-3 w-3" />
                                      Set as primary
                                    </button>
                                  )}

                                  {image.isPrimary && (
                                    <div className="flex items-center justify-center gap-1.5 py-2 text-[10px] font-medium text-neutral-400">
                                      <Check className="h-3 w-3" />
                                      Primary image
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ),
                          )}
                        </div>
                      </div>
                    ) : (
                      <div
                        className="
                          rounded-2xl
                          border
                          border-dashed
                          border-neutral-200
                          bg-neutral-50/70
                          px-5
                          py-8
                          text-center
                        "
                      >
                        <div
                          className="
                            mx-auto
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            text-neutral-400
                            shadow-sm
                            ring-1
                            ring-neutral-200
                          "
                        >
                          <ImagePlus className="h-4 w-4" />
                        </div>

                        <p className="mt-3 text-xs font-medium text-neutral-700">
                          No product images
                        </p>

                        <p className="mt-1 text-[10px] text-neutral-400">
                          Add images below to complete the catalogue entry.
                        </p>
                      </div>
                    )}

                    {/* Add new images */}

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={
                          handleFileChange
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-dashed
                          border-neutral-300
                          bg-neutral-50/60
                          px-4
                          py-4
                          text-xs
                          font-medium
                          text-neutral-600
                          transition
                          hover:border-neutral-400
                          hover:bg-neutral-50
                          hover:text-neutral-900
                        "
                      >
                        <UploadCloud className="h-4 w-4" />
                        Add product images
                      </button>

                      <p className="mt-2 text-[10px] leading-4 text-neutral-400">
                        JPEG, PNG or WebP · Maximum 5MB per image.
                      </p>
                    </div>

                    {/* Pending uploads */}

                    <AnimatePresence>
                      {pendingImages.length >
                        0 && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="space-y-3"
                        >
                          <p className="text-xs font-medium text-neutral-700">
                            New images
                          </p>

                          {pendingImages.map(
                            (image) => (
                              <motion.div
                                key={image.id}
                                layout
                                className="
                                  overflow-hidden
                                  rounded-2xl
                                  border
                                  border-neutral-200
                                  bg-white
                                "
                              >
                                <div className="flex gap-3 p-3">
                                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                                    <Image
                                      src={
                                        image.preview
                                      }
                                      alt={
                                        image.altText ||
                                        image.file.name
                                      }
                                      fill
                                      className="h-full w-full object-cover"
                                    />

                                    {image.status ===
                                      "uploading" && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/40">
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <p className="truncate text-xs font-medium text-neutral-800">
                                          {
                                            image.file
                                              .name
                                          }
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-neutral-400">
                                          {(
                                            image.file
                                              .size /
                                            1024
                                          ).toFixed(
                                            0,
                                          )}{" "}
                                          KB
                                        </p>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          removePendingImage(
                                            image.id,
                                          )
                                        }
                                        disabled={
                                          image.status ===
                                          "uploading"
                                        }
                                        className="
                                          shrink-0
                                          rounded-lg
                                          p-1.5
                                          text-neutral-400
                                          transition
                                          hover:bg-red-50
                                          hover:text-red-500
                                        "
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>

                                    <input
                                      value={
                                        image.altText
                                      }
                                      onChange={(
                                        event,
                                      ) =>
                                        updatePendingImageAlt(
                                          image.id,
                                          event.target
                                            .value,
                                        )
                                      }
                                      disabled={
                                        image.status ===
                                        "uploading"
                                      }
                                      className="
                                        mt-2
                                        h-8
                                        w-full
                                        rounded-lg
                                        border
                                        border-neutral-200
                                        px-2.5
                                        text-[10px]
                                        outline-none
                                        placeholder:text-neutral-400
                                        focus:border-neutral-400
                                      "
                                      placeholder="Image alt text"
                                    />
                                  </div>
                                </div>

                                {image.error && (
                                  <div className="border-t border-red-100 bg-red-50 px-3 py-2 text-[10px] text-red-600">
                                    {image.error}
                                  </div>
                                )}
                              </motion.div>
                            ),
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {imageUploadError && (
                      <div
                        className="
                          rounded-xl
                          border
                          border-red-100
                          bg-red-50
                          px-3
                          py-2.5
                          text-xs
                          text-red-600
                        "
                      >
                        {imageUploadError}
                      </div>
                    )}
                  </div>
                </FormSection>

                {/* =================================================
                    03 PRICING & INVENTORY
                ================================================== */}

                <FormSection
                  number="03"
                  title="Pricing & inventory"
                  description="Control customer pricing, discounts, and stock visibility."
                >
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Original price"
                        required
                      >
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={(event) =>
                            updateField(
                              "price",
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          className={inputClass}
                        />

                        {errors.price && (
                          <p className="text-[11px] text-red-500">
                            {errors.price}
                          </p>
                        )}
                      </Field>

                      <Field label="Discount type">
                        <div className="relative">
                          <select
                            value={
                              form.discountType
                            }
                            onChange={(
                              event,
                            ) =>
                              updateField(
                                "discountType",
                                event.target
                                  .value as UpdateProductInput["discountType"],
                              )
                            }
                            className={`${inputClass} appearance-none pr-10`}
                          >
                            <option value="NONE">
                              No discount
                            </option>

                            <option value="PERCENTAGE">
                              Percentage
                            </option>

                            <option value="FIXED_AMOUNT">
                              Fixed amount
                            </option>
                          </select>

                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                        </div>
                      </Field>
                    </div>

                    {form.discountType !==
                      "NONE" && (
                      <Field
                        label="Discount value"
                        hint={
                          form.discountType ===
                          "PERCENTAGE"
                            ? "%"
                            : "₦"
                        }
                      >
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            form.discountValue ??
                            ""
                          }
                          onChange={(event) =>
                            updateField(
                              "discountValue",
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          className={inputClass}
                        />

                        {errors.discountValue && (
                          <p className="text-[11px] text-red-500">
                            {
                              errors.discountValue
                            }
                          </p>
                        )}
                      </Field>
                    )}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-neutral-50/70
                        p-4
                      "
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                            Customer price
                          </p>

                          <p className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
                            ₦
                            {calculatedSalePrice.toLocaleString(
                              "en-NG",
                              {
                                minimumFractionDigits: 2,
                              },
                            )}
                          </p>
                        </div>

                        {form.discountType !==
                          "NONE" &&
                          calculatedSalePrice <
                            Number(
                              form.price,
                            ) && (
                            <span className="rounded-lg bg-neutral-950 px-2.5 py-1 text-[10px] font-semibold text-white">
                              Sale
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Stock quantity"
                        required
                      >
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={
                            form.stockQuantity
                          }
                          onChange={(event) =>
                            updateField(
                              "stockQuantity",
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          className={inputClass}
                        />

                        {errors.stockQuantity && (
                          <p className="text-[11px] text-red-500">
                            {
                              errors.stockQuantity
                            }
                          </p>
                        )}
                      </Field>

                      <Field label="Low-stock threshold">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={
                            form.lowStockThreshold
                          }
                          onChange={(event) =>
                            updateField(
                              "lowStockThreshold",
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                </FormSection>

                {/* =================================================
                    04 SUITABILITY
                ================================================== */}

                <FormSection
                  number="04"
                  title="Suitability & discovery"
                  description="Define which customers and concerns this product is intended to serve."
                >
                  <div className="space-y-7">
                    <div>
                      <div className="mb-3">
                        <p className="text-xs font-medium text-neutral-700">
                          Skin types
                        </p>

                        <p className="mt-1 text-[10px] text-neutral-400">
                          Select all that apply.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {SKIN_TYPE_OPTIONS.map(
                          (option) => {
                            const selected =
                              form.skinTypes?.includes(
                                option.value,
                              );

                            return (
                              <button
                                key={
                                  option.value
                                }
                                type="button"
                                onClick={() => {
                                  const current =
                                    form.skinTypes ??
                                    [];

                                  if (
                                    option.value ===
                                    "ALL"
                                  ) {
                                    updateField(
                                      "skinTypes",
                                      selected
                                        ? []
                                        : ["ALL"],
                                    );

                                    return;
                                  }

                                  const next =
                                    current.filter(
                                      (
                                        value,
                                      ) =>
                                        value !==
                                        "ALL",
                                    );

                                  updateField(
                                    "skinTypes",
                                    selected
                                      ? next.filter(
                                          (
                                            value,
                                          ) =>
                                            value !==
                                            option.value,
                                        )
                                      : [
                                          ...next,
                                          option.value,
                                        ],
                                  );
                                }}
                                className={`
                                  rounded-xl
                                  border
                                  px-3
                                  py-2
                                  text-[11px]
                                  font-medium
                                  transition
                                  ${
                                    selected
                                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
                                  }
                                `}
                              >
                                {selected && (
                                  <Check className="mr-1.5 inline h-3 w-3" />
                                )}

                                {
                                  option.label
                                }
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3">
                        <p className="text-xs font-medium text-neutral-700">
                          Product concerns
                        </p>

                        <p className="mt-1 text-[10px] text-neutral-400">
                          Select the concerns this product helps address.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {CONCERN_OPTIONS.map(
                          (option) => {
                            const selected =
                              form.concerns?.includes(
                                option.value,
                              );

                            return (
                              <button
                                key={
                                  option.value
                                }
                                type="button"
                                onClick={() => {
                                  const current =
                                    form.concerns ??
                                    [];

                                  updateField(
                                    "concerns",
                                    selected
                                      ? current.filter(
                                          (
                                            value,
                                          ) =>
                                            value !==
                                            option.value,
                                        )
                                      : [
                                          ...current,
                                          option.value,
                                        ],
                                  );
                                }}
                                className={`
                                  rounded-xl
                                  border
                                  px-3
                                  py-2
                                  text-[11px]
                                  font-medium
                                  transition
                                  ${
                                    selected
                                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
                                  }
                                `}
                              >
                                {selected && (
                                  <Check className="mr-1.5 inline h-3 w-3" />
                                )}

                                {
                                  option.label
                                }
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </FormSection>

                {/* =================================================
                    05 PRODUCT EDUCATION
                ================================================== */}

                <FormSection
                  number="05"
                  title="Product education"
                  description="Help customers understand how to use the product and what to expect."
                >
                  <div className="space-y-5">
                    <Field label="How to use">
                      <textarea
                        value={
                          form.howToUse ?? ""
                        }
                        onChange={(event) =>
                          updateField(
                            "howToUse",
                            event.target.value,
                          )
                        }
                        className={textareaClass}
                        placeholder="Explain how customers should use the product."
                      />
                    </Field>

                    <Field label="Key ingredients">
                      <textarea
                        value={
                          form.keyIngredients ??
                          ""
                        }
                        onChange={(event) =>
                          updateField(
                            "keyIngredients",
                            event.target.value,
                          )
                        }
                        className={textareaClass}
                        placeholder="List notable ingredients and their purpose."
                      />
                    </Field>

                    <Field label="Benefits">
                      <textarea
                        value={
                          form.benefits ?? ""
                        }
                        onChange={(event) =>
                          updateField(
                            "benefits",
                            event.target.value,
                          )
                        }
                        className={textareaClass}
                        placeholder="Describe the main benefits."
                      />
                    </Field>

                    <Field label="Suitability notes">
                      <textarea
                        value={
                          form.suitabilityNotes ??
                          ""
                        }
                        onChange={(event) =>
                          updateField(
                            "suitabilityNotes",
                            event.target.value,
                          )
                        }
                        className={textareaClass}
                        placeholder="Add additional suitability information."
                      />
                    </Field>

                    <Field label="Warnings">
                      <textarea
                        value={
                          form.warnings ?? ""
                        }
                        onChange={(event) =>
                          updateField(
                            "warnings",
                            event.target.value,
                          )
                        }
                        className={textareaClass}
                        placeholder="Add warnings, precautions, or usage limitations."
                      />
                    </Field>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Size">
                        <input
                          value={
                            form.size ?? ""
                          }
                          onChange={(event) =>
                            updateField(
                              "size",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                          placeholder="e.g. 250"
                        />
                      </Field>

                      <Field label="Unit">
                        <input
                          value={
                            form.unit ?? ""
                          }
                          onChange={(event) =>
                            updateField(
                              "unit",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                          placeholder="e.g. ml"
                        />
                      </Field>
                    </div>
                  </div>
                </FormSection>

                {/* =================================================
                    06 PUBLISHING
                ================================================== */}

                <FormSection
                  number="06"
                  title="Publishing"
                  description="Control catalogue visibility and product verification."
                >
                  <div className="space-y-5">
                    <Field label="Product status">
                      <div className="relative">
                        <select
                          value={
                            form.status
                          }
                          onChange={(event) =>
                            updateField(
                              "status",
                              event.target
                                .value as UpdateProductInput["status"],
                            )
                          }
                          className={`${inputClass} appearance-none pr-10`}
                        >
                          <option value="ACTIVE">
                            Active
                          </option>

                          <option value="INACTIVE">
                            Inactive
                          </option>

                          <option value="OUT_OF_STOCK">
                            Out of stock
                          </option>
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      </div>
                    </Field>

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-neutral-50/70
                        p-4
                      "
                    >
                      <div>
                        <p className="text-xs font-medium text-neutral-800">
                          Product verification
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-neutral-400">
                          Verified products can display the BeautyHub verification indicator.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            "verificationStatus",
                            form.verificationStatus ===
                              "VERIFIED"
                              ? "NOT_VERIFIED"
                              : "VERIFIED",
                          )
                        }
                        className={`
                          relative
                          h-6
                          w-11
                          shrink-0
                          rounded-full
                          transition
                          ${
                            form.verificationStatus ===
                            "VERIFIED"
                              ? "bg-neutral-950"
                              : "bg-neutral-200"
                          }
                        `}
                        aria-label="Toggle product verification"
                      >
                        <motion.span
                          animate={{
                            x:
                              form.verificationStatus ===
                              "VERIFIED"
                                ? 20
                                : 2,
                          }}
                          className="
                            absolute
                            left-0
                            top-1
                            h-4
                            w-4
                            rounded-full
                            bg-white
                            shadow-sm
                          "
                        />
                      </button>
                    </div>
                  </div>
                </FormSection>

                {errors.form && (
                  <div className="mx-5 my-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600 sm:mx-7">
                    {errors.form}
                  </div>
                )}
              </div>

              {/* =====================================================
                  FOOTER
              ====================================================== */}

              <footer
                className="
                  shrink-0
                  border-t
                  border-neutral-100
                  bg-white/95
                  px-5
                  py-4
                  backdrop-blur-xl
                  sm:px-7
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    {isBusy ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-500" />

                        <p className="truncate text-[11px] text-neutral-500">
                          {uploadProductImage.isPending
                            ? "Uploading image..."
                            : deleteProductImage.isPending
                              ? "Removing image..."
                              : setPrimaryProductImage.isPending
                                ? "Updating primary image..."
                                : reorderProductImages.isPending
                                  ? "Saving image order..."
                                  : "Saving changes..."}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] leading-4 text-neutral-400">
                        Changes are saved to the BeautyHub catalogue.
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isBusy}
                      className="
                        h-10
                        rounded-xl
                        border
                        border-neutral-200
                        px-4
                        text-xs
                        font-medium
                        text-neutral-600
                        transition
                        hover:bg-neutral-50
                        hover:text-neutral-900
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isBusy}
                      className="
                        flex
                        h-10
                        items-center
                        gap-2
                        rounded-xl
                        bg-neutral-950
                        px-4
                        text-xs
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-neutral-800
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {updateProduct.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : uploadProductImage.isPending ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Save changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </footer>
            </form>
          )}
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}