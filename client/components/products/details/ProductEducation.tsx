import {
  BookOpen,
  Droplets,
  FlaskConical,
  Sparkles,
} from "lucide-react";

import { Product } from "@/types/product";

interface ProductEducationProps {
  product: Product;
}

interface EducationCardProps {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}

function EducationCard({
  icon,
  label,
  value,
}: EducationCardProps) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
          {icon}
        </div>

        <h3 className="text-sm font-semibold text-neutral-950">
          {label}
        </h3>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-600">
        {value}
      </p>
    </div>
  );
}

export default function ProductEducation({
  product,
}: ProductEducationProps) {
  const hasEducation =
    Boolean(
      product.benefits ||
        product.keyIngredients ||
        product.howToUse
    );

  if (!hasEducation) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Product education
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
          Know what you&apos;re buying
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-500">
          Everything you need to understand
          how this product fits into your
          routine.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <EducationCard
          icon={
            <Sparkles className="h-4 w-4 text-neutral-600" />
          }
          label="Benefits"
          value={product.benefits}
        />

        <EducationCard
          icon={
            <FlaskConical className="h-4 w-4 text-neutral-600" />
          }
          label="Key ingredients"
          value={
            product.keyIngredients
          }
        />

        <EducationCard
          icon={
            <BookOpen className="h-4 w-4 text-neutral-600" />
          }
          label="How to use"
          value={product.howToUse}
        />

        <EducationCard
          icon={
            <Droplets className="h-4 w-4 text-neutral-600" />
          }
          label="Product format"
          value={
            product.size &&
            product.unit
              ? `${product.size} ${product.unit}`
              : null
          }
        />
      </div>
    </section>
  );
}