import {
  CheckCircle2,
  Heart,
} from "lucide-react";

import {
  Product,
  ProductConcern,
  SkinType,
} from "@/types/product";

interface ProductSuitabilityProps {
  product: Product;
}

const skinTypeLabels: Record<
  SkinType,
  string
> = {
  NORMAL: "Normal skin",
  DRY: "Dry skin",
  OILY: "Oily skin",
  COMBINATION: "Combination skin",
  SENSITIVE: "Sensitive skin",
  ALL: "All skin types",
  UNKNOWN: "Skin type not specified",
};

const concernLabels: Record<
  ProductConcern,
  string
> = {
  ACNE_PRONE: "Acne-prone skin",
  DARK_SPOTS: "Dark spots",
  UNEVEN_SKIN_TONE:
    "Uneven skin tone",
  DRYNESS: "Dryness",
  OILY_SKIN: "Oily skin",
  SENSITIVE_SKIN:
    "Sensitive skin",
  ROUGH_SKIN: "Rough skin",
  BUMPY_SKIN: "Bumpy skin",
  BODY_ACNE: "Body acne",
  ANTI_AGING: "Anti-aging",
  GENERAL_SKINCARE:
    "General skincare",
  GENERAL_BODY_CARE:
    "General body care",
};

export default function ProductSuitability({
  product,
}: ProductSuitabilityProps) {
  const skinTypes =
    product.skinTypes ?? [];

  const concerns =
    product.concerns ?? [];

  if (
    skinTypes.length === 0 &&
    concerns.length === 0 &&
    !product.suitabilityNotes
  ) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
          <Heart className="h-4 w-4 text-neutral-700" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Suitability
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
            Is this right for you?
          </h2>
        </div>
      </div>

      {skinTypes.length > 0 && (
        <div className="mt-7">
          <p className="text-sm font-semibold text-neutral-900">
            Suitable skin types
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {skinTypes.map(
              (skinType) => (
                <span
                  key={skinType}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700"
                >
                  {
                    skinTypeLabels[
                      skinType
                    ]
                  }
                </span>
              )
            )}
          </div>
        </div>
      )}

      {concerns.length > 0 && (
        <div className="mt-7">
          <p className="text-sm font-semibold text-neutral-900">
            Designed for
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {concerns.map(
              (concern) => (
                <div
                  key={concern}
                  className="flex items-center gap-2 text-sm text-neutral-600"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-neutral-500" />

                  {
                    concernLabels[
                      concern
                    ]
                  }
                </div>
              )
            )}
          </div>
        </div>
      )}

      {product.suitabilityNotes && (
        <div className="mt-7 rounded-2xl bg-neutral-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Good to know
          </p>

          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-neutral-600">
            {product.suitabilityNotes}
          </p>
        </div>
      )}
    </section>
  );
}