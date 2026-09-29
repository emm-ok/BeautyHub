import { Product } from "@/types/products";

interface ProductInformationProps {
  product: Product;
}

export default function ProductInformation({
  product,
}: ProductInformationProps) {
  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Product description
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
          About this product
        </h2>
      </div>

      <p className="mt-6 whitespace-pre-line text-sm leading-8 text-neutral-600 sm:text-base">
        {product.description}
      </p>

      <div className="mt-8 grid gap-6 border-t border-neutral-100 pt-8 sm:grid-cols-2">
        {product.brand && (
          <div>
            <p className="text-xs uppercase tracking-wider text-neutral-400">
              Brand
            </p>

            <p className="mt-1 text-sm font-medium text-neutral-900">
              {product.brand}
            </p>
          </div>
        )}

        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-400">
            Category
          </p>

          <p className="mt-1 text-sm font-medium text-neutral-900">
            {product.category.name.replace(
              /_/g,
              " "
            )}
          </p>
        </div>

        {product.size &&
          product.unit && (
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-400">
                Size
              </p>

              <p className="mt-1 text-sm font-medium text-neutral-900">
                {product.size}{" "}
                {product.unit}
              </p>
            </div>
          )}

        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-400">
            Availability
          </p>

          <p className="mt-1 text-sm font-medium text-neutral-900">
            {product.stockQuantity > 0
              ? "Available"
              : "Currently unavailable"}
          </p>
        </div>
      </div>
    </section>
  );
}