export default function ProductDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 h-4 w-48 animate-pulse rounded bg-neutral-200" />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-[2rem] bg-neutral-200" />

          <div className="space-y-5">
            <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />

            <div className="h-12 w-4/5 animate-pulse rounded-xl bg-neutral-200" />

            <div className="h-6 w-1/3 animate-pulse rounded bg-neutral-200" />

            <div className="h-32 animate-pulse rounded-[2rem] bg-neutral-200" />

            <div className="h-14 animate-pulse rounded-xl bg-neutral-200" />
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-[2rem] bg-neutral-200" />

          <div className="h-72 animate-pulse rounded-[2rem] bg-neutral-200" />
        </div>
      </div>
    </main>
  );
}