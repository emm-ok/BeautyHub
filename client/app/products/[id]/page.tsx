import ProductDetailsShell from "@/components/products/details/ProductDetailsShell";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPDetailsPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  return (
    <ProductDetailsShell
      productId={id}
    />
  );
}