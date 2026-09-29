export default function CartLoading() {
  return (
    <div className="flex-1 space-y-5 p-6">
      {Array.from({ length: 3 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex gap-4"
          >
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-neutral-100" />

            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
        )
      )}
    </div>
  );
}