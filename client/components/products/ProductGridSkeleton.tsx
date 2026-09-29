export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
        >
          <div className="aspect-square animate-pulse bg-neutral-100" />

          <div className="space-y-3 p-4 sm:p-5">
            <div className="h-2.5 w-16 animate-pulse rounded bg-neutral-100" />

            <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-100" />

            <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />

            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}