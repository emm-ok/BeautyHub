import { AlertTriangle } from "lucide-react";

interface ProductWarningsProps {
  warnings?: string | null;
}

export default function ProductWarnings({
  warnings,
}: ProductWarningsProps) {
  if (!warnings) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            Important information
          </p>

          <h2 className="mt-2 text-xl font-semibold text-amber-950">
            Before using this product
          </h2>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-amber-900/75">
            {warnings}
          </p>
        </div>
      </div>
    </section>
  );
}