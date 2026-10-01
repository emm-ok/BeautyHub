import type { ReactNode } from "react";

interface ProductFormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}

export function ProductFormSection({
  title,
  description,
  children,
  action,
}: ProductFormSectionProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-start justify-between gap-6 border-b border-neutral-100 px-6 py-5 sm:px-7">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-neutral-950">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-neutral-500">
            {description}
          </p>
        </div>

        {action}
      </div>

      <div className="p-6 sm:p-7">
        {children}
      </div>
    </section>
  );
}