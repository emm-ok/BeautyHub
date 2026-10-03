"use client";

import {
  Check,
  ImagePlus,
  Loader2,
  Star,
  UploadCloud,
  X,
  AlertCircle,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useCreateProduct,
  useActiveCategories,
} from "@/hooks/useProducts";

import type {
  CreateProductInput,
  DiscountType,
  ProductConcern,
  ProductStatus,
  ProductVerificationStatus,
  SkinType,
} from "@/types/products";
import { uploadProductImage } from "@/services/product-image";
import Image from "next/image";

/* Types                                                                      */

interface AddProductDrawerProps {
  open: boolean;
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

/* Options                                                                    */

const SKIN_TYPE_OPTIONS: {
  value: SkinType;
  label: string;
  description: string;
}[] = [
    {
      value: "NORMAL",
      label: "Normal",
      description:
        "Balanced skin with minimal concerns",
    },
    {
      value: "DRY",
      label: "Dry",
      description:
        "Skin that lacks moisture",
    },
    {
      value: "OILY",
      label: "Oily",
      description:
        "Skin with excess oil production",
    },
    {
      value: "COMBINATION",
      label: "Combination",
      description:
        "Combination of oily and dry areas",
    },
    {
      value: "SENSITIVE",
      label: "Sensitive",
      description:
        "Skin prone to irritation",
    },
    {
      value: "ALL",
      label: "All skin types",
      description:
        "Suitable across skin types",
    },
    {
      value: "UNKNOWN",
      label: "Not specified",
      description:
        "Skin type has not been specified",
    },
  ];

const CONCERN_OPTIONS: {
  value: ProductConcern;
  label: string;
}[] = [
    {
      value: "ACNE_PRONE",
      label: "Acne-prone skin",
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

/* Constants                                                                  */

const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* Initial state                                                              */

const initialForm: CreateProductInput = {
  name: "",
  slug: "",
  description: "",
  brand: "",
  categoryId: "",

  price: 0,
  discountType: "NONE",
  discountValue: undefined,

  stockQuantity: 0,
  lowStockThreshold: 5,

  status: "ACTIVE",
  verificationStatus: "NOT_VERIFIED",

  howToUse: "",
  keyIngredients: "",
  benefits: "",
  suitabilityNotes: "",
  warnings: "",

  skinTypes: [],
  concerns: [],

  size: "",
  unit: "",
};

/* Helpers                                                                    */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatCurrency(
  value: number,
) {
  if (!value || value <= 0) {
    return "₦0";
  }

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function calculatePreviewPrice(
  price: number,
  discountType: DiscountType,
  discountValue?: number,
) {
  if (
    !price ||
    discountType === "NONE" ||
    !discountValue
  ) {
    return price;
  }

  if (
    discountType === "PERCENTAGE"
  ) {
    return Math.max(
      0,
      price -
      price *
      (discountValue / 100),
    );
  }

  return Math.max(
    0,
    price - discountValue,
  );
}

/* Component                                                                  */

export default function AddProductDrawer({
  open,
  onClose,
}: AddProductDrawerProps) {
  const [form, setForm] =
    useState<CreateProductInput>(
      initialForm,
    );

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [pendingImages, setPendingImages] =
    useState<PendingImage[]>([]);

  const [isDragging, setIsDragging] =
    useState(false);

  const [uploadingImages, setUploadingImages] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [imageUploadError, setImageUploadError] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useActiveCategories();

  const createProduct =
    useCreateProduct();

  /* Reset                                                                    */

  useEffect(() => {
    if (!open) {
      pendingImages.forEach((image) => {
        URL.revokeObjectURL(
          image.preview,
        );
      });

      setForm(initialForm);
      setErrors({});
      setPendingImages([]);
      setImageUploadError(null);
      setUploadingImages(false);
      setUploadProgress(0);

      createProduct.reset();
    }
  }, [open]);

  /* Field update                                                             */

  const updateField = <
    K extends keyof CreateProductInput,
  >(
    field: K,
    value: CreateProductInput[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  /* Name / slug                                                              */

  const handleNameChange = (
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      name: value,
      slug:
        previous.slug ===
          slugify(previous.name)
          ? slugify(value)
          : previous.slug,
    }));

    setErrors((previous) => ({
      ...previous,
      name: "",
    }));
  };

  /* Multi select                                                             */

  const toggleSkinType = (
    value: SkinType,
  ) => {
    setForm((previous) => {
      const exists =
        previous.skinTypes.includes(
          value,
        );

      let next = exists
        ? previous.skinTypes.filter(
          (item) => item !== value,
        )
        : [
          ...previous.skinTypes,
          value,
        ];

      /*
       * "ALL" represents every skin type.
       * Keeping it exclusive avoids ambiguous
       * combinations such as ALL + OILY.
       */
      if (value === "ALL") {
        next = exists ? [] : ["ALL"];
      } else {
        next = next.filter(
          (item) => item !== "ALL",
        );
      }

      return {
        ...previous,
        skinTypes: next,
      };
    });

    setErrors((previous) => ({
      ...previous,
      skinTypes: "",
    }));
  };

  const toggleConcern = (
    value: ProductConcern,
  ) => {
    setForm((previous) => {
      const exists =
        previous.concerns.includes(
          value,
        );

      return {
        ...previous,
        concerns: exists
          ? previous.concerns.filter(
            (item) => item !== value,
          )
          : [
            ...previous.concerns,
            value,
          ],
      };
    });

    setErrors((previous) => ({
      ...previous,
      concerns: "",
    }));
  };

  /* Image validation                                                         */

  const validateImage = (
    file: File,
  ) => {
    if (
      !ACCEPTED_IMAGE_TYPES.includes(
        file.type,
      )
    ) {
      return "Only JPG, PNG and WebP images are supported.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Each image must be smaller than 5MB.";
    }

    return null;
  };

  /* Add images                                                               */

  const addImages = (
    files: File[],
  ) => {
    setImageUploadError(null);

    const remainingSlots =
      MAX_IMAGES -
      pendingImages.length;

    if (remainingSlots <= 0) {
      setImageUploadError(
        `You can upload a maximum of ${MAX_IMAGES} images.`,
      );

      return;
    }

    const selectedFiles = files.slice(
      0,
      remainingSlots,
    );

    const invalidFile =
      selectedFiles
        .map((file) => ({
          file,
          error: validateImage(file),
        }))
        .find((item) => item.error);

    if (invalidFile?.error) {
      setImageUploadError(
        `${invalidFile.file.name}: ${invalidFile.error}`,
      );

      return;
    }

    const newImages: PendingImage[] =
      selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview:
          URL.createObjectURL(file),
        altText: "",
        status: "pending",
      }));

    setPendingImages(
      (previous) => [
        ...previous,
        ...newImages,
      ],
    );
  };

  /* File input                                                               */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );

    addImages(files);

    event.target.value = "";
  };

  /* Drop                                                                     */

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setIsDragging(false);

    addImages(
      Array.from(
        event.dataTransfer.files,
      ),
    );
  };

  /* Remove pending image                                                     */

  const removePendingImage = (
    id: string,
  ) => {
    const image =
      pendingImages.find(
        (item) => item.id === id,
      );

    if (image) {
      URL.revokeObjectURL(
        image.preview,
      );
    }

    setPendingImages(
      (previous) =>
        previous.filter(
          (item) => item.id !== id,
        ),
    );
  };

  /* Alt text                                                                 */

  const updateImageAltText = (
    id: string,
    altText: string,
  ) => {
    setPendingImages(
      (previous) =>
        previous.map((image) =>
          image.id === id
            ? {
              ...image,
              altText,
            }
            : image,
        ),
    );
  };

  /* Validation                                                               */

  const validate = () => {
    const nextErrors: Record<
      string,
      string
    > = {};

    if (!form.name.trim()) {
      nextErrors.name =
        "Product name is required.";
    }

    if (!form.slug.trim()) {
      nextErrors.slug =
        "Product slug is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description =
        "Product description is required.";
    }

    if (!form.categoryId) {
      nextErrors.categoryId =
        "Select a category.";
    }

    if (form.price <= 0) {
      nextErrors.price =
        "Price must be greater than zero.";
    }

    if (
      form.discountType !== "NONE" &&
      (!form.discountValue ||
        form.discountValue <= 0)
    ) {
      nextErrors.discountValue =
        "Enter a valid discount.";
    }

    if (
      form.discountType ===
      "PERCENTAGE" &&
      Number(form.discountValue) > 100
    ) {
      nextErrors.discountValue =
        "Percentage cannot exceed 100.";
    }

    if (
      form.discountType ===
      "FIXED_AMOUNT" &&
      form.discountValue != null &&
      form.discountValue >= form.price
    ) {
      nextErrors.discountValue =
        "Fixed discount must be less than the product price.";
    }

    if (form.stockQuantity < 0) {
      nextErrors.stockQuantity =
        "Stock cannot be negative.";
    }

    if (form.skinTypes.length === 0) {
      nextErrors.skinTypes =
        "Select at least one skin type.";
    }

    if (form.concerns.length === 0) {
      nextErrors.concerns =
        "Select at least one product concern.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length ===
      0
    );
  };

  /* Upload images                                                            */

  const uploadImages = async (
    productId: string,
  ) => {
    if (
      pendingImages.length === 0
    ) {
      return {
        failed: [],
      };
    }

    setUploadingImages(true);
    setImageUploadError(null);
    setUploadProgress(0);

    const failed: string[] = [];

    for (
      let index = 0;
      index < pendingImages.length;
      index++
    ) {
      const image =
        pendingImages[index];

      setPendingImages(
        (previous) =>
          previous.map(
            (item) =>
              item.id === image.id
                ? {
                  ...item,
                  status:
                    "uploading",
                  error: undefined,
                }
                : item,
          ),
      );

      try {
        await uploadProductImage(
          productId,
          image.file,
          image.altText,
        );

        setPendingImages(
          (previous) =>
            previous.map(
              (item) =>
                item.id === image.id
                  ? {
                    ...item,
                    status:
                      "uploaded",
                  }
                  : item,
            ),
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to upload image.";

        failed.push(image.file.name);

        setPendingImages(
          (previous) =>
            previous.map(
              (item) =>
                item.id === image.id
                  ? {
                    ...item,
                    status:
                      "error",
                    error: message,
                  }
                  : item,
            ),
        );
      }

      setUploadProgress(
        Math.round(
          ((index + 1) /
            pendingImages.length) *
          100,
        ),
      );
    }

    setUploadingImages(false);

    if (failed.length > 0) {
      setImageUploadError(
        `${failed.length} image${failed.length > 1
          ? "s"
          : ""
        } could not be uploaded.`,
      );
    }

    return {
      failed,
    };
  };

  /* Submit                                                                   */

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (
      createProduct.isPending ||
      uploadingImages
    ) {
      return;
    }

    if (!validate()) {
      return;
    }

    try {
      /*
       * First create the product.
       * Images require productId, so they cannot
       * be uploaded before this succeeds.
       */
      const response =
        await createProduct.mutateAsync(
          form,
        );

      /*
       * Depending on your useCreateProduct hook,
       * response may already be the created product
       * or the API response object.
       */
      const product =
        "data" in response
          ? response.data
          : response;

      const result =
        await uploadImages(
          product.id,
        );

      /*
       * Product was successfully created.
       *
       * We intentionally do not close the drawer
       * when some images failed. This allows the
       * admin to see exactly what happened.
       */
      if (result.failed.length > 0) {
        return;
      }

      onClose();
    } catch {
      console.log("Submit Error", createProduct);
      /*
       * Product creation error is already exposed
       * through createProduct.isError.
       */
    }
  };
  type ApiErrorWithResponse = {
    response?: {
      data?: {
        errors?: unknown;
      };
    };
  };

  const errorMessages =
    createProduct?.error &&
      typeof createProduct.error === "object" &&
      "response" in createProduct.error
      ? (createProduct.error as ApiErrorWithResponse)
        .response?.data?.errors
      : undefined;

  console.log("Error messages:", errorMessages);


  /* Render                                                                   */

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => {
              if (
                createProduct.isPending ||
                uploadingImages
              ) {
                return;
              }

              onClose();
            }}
            className="fixed inset-0 z-50 bg-neutral-950/30 backdrop-blur-[2px]"
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
              damping: 32,
            }}
            className="
              fixed
              inset-y-0
              right-0
              z-50
              flex
              w-full
              flex-col
              bg-white
              shadow-2xl
              sm:max-w-xl
            "
            aria-label="Add product"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                  Catalogue
                </p>

                <h2 className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
                  Add product
                </h2>
              </div>

              <button
                type="button"
                disabled={
                  createProduct.isPending ||
                  uploadingImages
                }
                onClick={onClose}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-neutral-400
                  transition
                  hover:bg-neutral-100
                  hover:text-neutral-900
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                {/* Basic */}
                <FormSection
                  number="01"
                  title="Basic information"
                  description="The core information customers see first."
                >
                  <Field
                    label="Product name"
                    required
                    error={errors.name}
                  >
                    <input
                      value={form.name}
                      onChange={(event) =>
                        handleNameChange(
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Hydrating Face Cleanser"
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="Slug"
                    required
                    error={errors.slug}
                  >
                    <input
                      value={form.slug}
                      onChange={(event) =>
                        updateField(
                          "slug",
                          slugify(
                            event.target.value,
                          ),
                        )
                      }
                      placeholder="hydrating-face-cleanser"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                        placeholder="Brand name"
                        className={inputClass}
                      />
                    </Field>

                    <Field
                      label="Category"
                      required
                      error={
                        errors.categoryId
                      }
                    >
                      <select
                        value={
                          form.categoryId
                        }
                        disabled={
                          categoriesLoading
                        }
                        onChange={(event) =>
                          updateField(
                            "categoryId",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      >
                        <option value="">
                          {categoriesLoading
                            ? "Loading categories..."
                            : "Select category"}
                        </option>

                        {categories.map(
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
                    </Field>
                  </div>

                  <Field
                    label="Description"
                    required
                    error={
                      errors.description
                    }
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
                      rows={4}
                      placeholder="Describe what this product is and what it is designed for."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </FormSection>

                {/* Images */}
                <FormSection
                  number="02"
                  title="Product images"
                  description="Upload clear product photography. The first uploaded image becomes the primary image."
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    hidden
                    onChange={
                      handleFileChange
                    }
                  />

                  {/* Upload zone */}
                  <motion.div
                    animate={{
                      borderColor:
                        isDragging
                          ? "rgb(23 23 23)"
                          : "rgb(229 229 229)",
                      backgroundColor:
                        isDragging
                          ? "rgb(250 250 250)"
                          : "rgb(250 250 250)",
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() =>
                      setIsDragging(false)
                    }
                    onDrop={handleDrop}
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      cursor-pointer
                      rounded-2xl
                      border-2
                      border-dashed
                      p-6
                      text-center
                      transition
                      hover:border-neutral-400
                    "
                  >
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-neutral-200">
                      {isDragging ? (
                        <UploadCloud className="h-5 w-5 text-neutral-950" />
                      ) : (
                        <ImagePlus className="h-5 w-5 text-neutral-500" />
                      )}
                    </div>

                    <p className="mt-3 text-sm font-semibold text-neutral-900">
                      {isDragging
                        ? "Drop images here"
                        : "Upload product images"}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-400">
                      Drag and drop or click to
                      browse
                    </p>

                    <div className="mt-3 flex justify-center gap-2 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      <span>JPG</span>
                      <span>•</span>
                      <span>PNG</span>
                      <span>•</span>
                      <span>WEBP</span>
                      <span>•</span>
                      <span>
                        {pendingImages.length}/
                        {MAX_IMAGES}
                      </span>
                    </div>
                  </motion.div>

                  {/* Image upload error */}
                  {imageUploadError && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                      <span>
                        {
                          imageUploadError
                        }
                      </span>
                    </motion.div>
                  )}

                  {/* Upload progress */}
                  {uploadingImages && (
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-600">
                          Uploading images...
                        </span>

                        <span className="text-xs font-semibold text-neutral-950">
                          {
                            uploadProgress
                          }
                          %
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${uploadProgress}%`,
                          }}
                          className="h-full rounded-full bg-neutral-950"
                        />
                      </div>
                    </div>
                  )}

                  {/* Image previews */}
                  {pendingImages.length >
                    0 && (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {pendingImages.map(
                          (
                            image,
                            index,
                          ) => (
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
                              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white"
                            >
                              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                                <Image
                                  src={
                                    image.preview
                                  }
                                  alt={
                                    image.altText ||
                                    `Product image ${index +
                                    1
                                    }`
                                  }
                                  fill
                                  className="h-full w-full object-cover"
                                />

                                {/* Primary badge */}
                                {index ===
                                  0 && (
                                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-neutral-950 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white">
                                      <Star className="h-2.5 w-2.5 fill-current" />
                                      Primary
                                    </div>
                                  )}

                                {/* Status */}
                                {image.status ===
                                  "uploading" && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/40">
                                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                                        <Loader2 className="h-4 w-4 animate-spin text-neutral-900" />
                                      </div>
                                    </div>
                                  )}

                                {image.status ===
                                  "uploaded" && (
                                    <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                                      <Check className="h-3.5 w-3.5" />
                                    </div>
                                  )}

                                {image.status ===
                                  "error" && (
                                    <div className="absolute bottom-2 left-2 rounded-full bg-red-600 px-2 py-1 text-[9px] font-semibold text-white">
                                      Upload failed
                                    </div>
                                  )}

                                {/* Remove */}
                                <button
                                  type="button"
                                  disabled={
                                    uploadingImages
                                  }
                                  onClick={() =>
                                    removePendingImage(
                                      image.id,
                                    )
                                  }
                                  className="
                                  absolute
                                  right-2
                                  top-2
                                  flex
                                  h-7
                                  w-7
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-white/95
                                  text-neutral-500
                                  shadow-sm
                                  transition
                                  hover:text-red-600
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                  sm:opacity-0
                                  sm:group-hover:opacity-100
                                "
                                  aria-label="Remove image"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* Alt text */}
                              <div className="p-2.5">
                                <input
                                  value={
                                    image.altText
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateImageAltText(
                                      image.id,
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  disabled={
                                    uploadingImages
                                  }
                                  placeholder="Alt text"
                                  className="
                                  h-8
                                  w-full
                                  rounded-lg
                                  border
                                  border-neutral-200
                                  bg-neutral-50
                                  px-2
                                  text-[11px]
                                  outline-none
                                  transition
                                  focus:border-neutral-400
                                  focus:bg-white
                                  disabled:opacity-50
                                "
                                />
                              </div>

                              {image.error && (
                                <p className="px-2.5 pb-2.5 text-[10px] text-red-600">
                                  {
                                    image.error
                                  }
                                </p>
                              )}
                            </motion.div>
                          ),
                        )}
                      </div>
                    )}

                  <p className="text-[11px] leading-5 text-neutral-400">
                    Maximum {MAX_IMAGES} images.
                    Each image must be under 5MB.
                    The first image becomes the
                    primary catalogue image.
                  </p>
                </FormSection>

                {/* Pricing */}
                <FormSection
                  number="03"
                  title="Pricing & inventory"
                  description="Set the commercial and stock information."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Original price"
                      required
                      error={errors.price}
                    >
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
                          ₦
                        </span>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            form.price || ""
                          }
                          onChange={(event) =>
                            updateField(
                              "price",
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          className={`${inputClass} pl-8`}
                        />
                      </div>
                    </Field>

                    <Field label="Discount">
                      <select
                        value={
                          form.discountType
                        }
                        onChange={(event) => {
                          const discountType =
                            event.target.value as DiscountType;

                          updateField("discountType", discountType);

                          if (discountType === "NONE") {
                            updateField("discountValue", null);
                          }
                        }}
                        className={inputClass}
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
                    </Field>
                  </div>

                  {form.discountType !==
                    "NONE" && (
                      <Field
                        label={
                          form.discountType ===
                            "PERCENTAGE"
                            ? "Discount percentage"
                            : "Discount amount"
                        }
                        error={
                          errors.discountValue
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
                      </Field>
                    )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Stock quantity"
                      required
                      error={
                        errors.stockQuantity
                      }
                    >
                      <input
                        type="number"
                        min="0"
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
                    </Field>

                    <Field label="Low stock threshold">
                      <input
                        type="number"
                        min="0"
                        value={
                          form.lowStockThreshold ??
                          5
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

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-neutral-500">
                          Customer price
                        </p>

                        <p className="mt-1 text-lg font-semibold text-neutral-950">
                          {formatCurrency(
                            calculatePreviewPrice(
                              form.price,
                              form.discountType,
                              form.discountValue ?? undefined,
                            ),
                          )}
                        </p>
                      </div>

                      {form.discountType !==
                        "NONE" &&
                        form.discountValue &&
                        form.price >
                        0 && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                            Discount applied
                          </span>
                        )}
                    </div>

                    <p className="mt-2 text-xs leading-5 text-neutral-400">
                      This is only a preview. The
                      final sale price is calculated
                      by the backend.
                    </p>
                  </div>
                </FormSection>

                {/* Suitability */}
                <FormSection
                  number="04"
                  title="Suitability"
                  description="Define which customers and skin concerns this product is intended for."
                >
                  <Field
                    label="Skin types"
                    required
                    error={errors.skinTypes}
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {SKIN_TYPE_OPTIONS.map(
                        (option) => {
                          const selected =
                            form.skinTypes.includes(
                              option.value,
                            );

                          return (
                            <button
                              key={
                                option.value
                              }
                              type="button"
                              onClick={() =>
                                toggleSkinType(
                                  option.value,
                                )
                              }
                              className={[
                                "group rounded-xl border p-3 text-left transition-all",
                                selected
                                  ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50",
                              ].join(
                                " ",
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={[
                                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
                                    selected
                                      ? "border-white bg-white text-neutral-950"
                                      : "border-neutral-300",
                                  ].join(
                                    " ",
                                  )}
                                >
                                  {selected && (
                                    <Check className="h-2.5 w-2.5" />
                                  )}
                                </div>

                                <div>
                                  <p className="text-xs font-semibold">
                                    {
                                      option.label
                                    }
                                  </p>

                                  <p
                                    className={[
                                      "mt-0.5 text-[10px] leading-4",
                                      selected
                                        ? "text-neutral-300"
                                        : "text-neutral-400",
                                    ].join(
                                      " ",
                                    )}
                                  >
                                    {
                                      option.description
                                    }
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </Field>

                  <Field
                    label="Product concerns"
                    required
                    error={errors.concerns}
                  >
                    <div className="flex flex-wrap gap-2">
                      {CONCERN_OPTIONS.map(
                        (option) => {
                          const selected =
                            form.concerns.includes(
                              option.value,
                            );

                          return (
                            <button
                              key={
                                option.value
                              }
                              type="button"
                              onClick={() =>
                                toggleConcern(
                                  option.value,
                                )
                              }
                              className={[
                                "rounded-full border px-3 py-2 text-xs font-medium transition-all",
                                selected
                                  ? "border-neutral-950 bg-neutral-950 text-white"
                                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950",
                              ].join(
                                " ",
                              )}
                            >
                              {selected && (
                                <Check className="mr-1 inline-block h-3 w-3" />
                              )}

                              {
                                option.label
                              }
                            </button>
                          );
                        },
                      )}
                    </div>
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
                      rows={3}
                      placeholder="Add any additional suitability guidance."
                      className={`${inputClass} resize-none`}
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
                      rows={3}
                      placeholder="Important precautions or warnings."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </FormSection>

                {/* Education */}
                <FormSection
                  number="05"
                  title="Product education"
                  description="Help customers understand how to use the product."
                  optional
                >
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
                      rows={3}
                      placeholder="Explain how and when customers should use it."
                      className={`${inputClass} resize-none`}
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
                      rows={3}
                      placeholder="e.g. Niacinamide, Hyaluronic Acid..."
                      className={`${inputClass} resize-none`}
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
                      rows={3}
                      placeholder="Describe the main product benefits."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </FormSection>

                {/* Publishing */}
                <FormSection
                  number="06"
                  title="Publishing"
                  description="Control how the product enters the catalogue."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Status">
                      <select
                        value={form.status}
                        onChange={(event) =>
                          updateField(
                            "status",
                            event.target
                              .value as ProductStatus,
                          )
                        }
                        className={inputClass}
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
                    </Field>

                    <Field label="Verification">
                      {/* <select
                        value={
                          form.verificationStatus
                        }
                        onChange={(event) =>
                          updateField(
                            "verificationStatus",
                            event.target
                              .value as ProductVerificationStatus,
                          )
                        }
                        className={inputClass}
                      >
                        <option value="NOT_VERIFIED">
                          Not verified
                        </option>

                        <option value="VERIFIED">
                          Verified
                        </option>
                      </select> */}

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
                        className={`relative h-6 w-11 shrink-0 rounded-full transition ${form.verificationStatus ===
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
                          className="absolute left-0 top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                        />
                      </button>
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
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
                        placeholder="e.g. 100"
                        className={inputClass}
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
                        placeholder="e.g. ml"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* Product error */}
                {createProduct.isError && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -4,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                    <span>
                      {(() => {
                        const fieldErrors = (
                          createProduct.error as Error & {
                            response?: {
                              data?: {
                                errors?: {
                                  fieldErrors?: Record<string, string[]>;
                                };
                              };
                            };
                          }
                        ).response?.data?.errors?.fieldErrors;

                        return fieldErrors
                          ? Object.values(fieldErrors)
                            .flat()
                            .map((message, index) => (
                              <p key={index}>{message}</p>
                            ))
                          : null;
                      })()}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-neutral-200 bg-white px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="hidden text-xs text-neutral-400 sm:block">
                    {uploadingImages
                      ? `Uploading ${uploadProgress}%`
                      : "You can edit this product later."}
                  </p>

                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      disabled={
                        createProduct.isPending ||
                        uploadingImages
                      }
                      onClick={onClose}
                      className="
                        rounded-xl
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-neutral-600
                        transition
                        hover:bg-neutral-100
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={
                        createProduct.isPending ||
                        uploadingImages
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-neutral-950
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        shadow-sm
                        transition
                        hover:bg-neutral-800
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {createProduct.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : uploadingImages ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Create product
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* Shared UI                                                                  */

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
  disabled:cursor-not-allowed
  disabled:bg-neutral-50
  disabled:text-neutral-400
`;

function FormSection({
  number,
  title,
  description,
  optional,
  children,
}: {
  number: string;
  title: string;
  description: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-neutral-100 pb-8 pt-1">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.14em] text-neutral-400">
            {number}
          </span>

          <h3 className="text-sm font-semibold text-neutral-950">
            {title}
          </h3>

          {optional && (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-400">
              Optional
            </span>
          )}
        </div>

        <p className="mt-1 text-xs leading-5 text-neutral-400">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
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

        {error && (
          <span className="text-[10px] text-red-600">
            {error}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}
