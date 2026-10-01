interface CreationProgressProps {
  status:
    | "idle"
    | "creating"
    | "uploading"
    | "success";
}

export function ProductCreationProgress({
  status,
}: CreationProgressProps) {
  const steps = [
    {
      key: "creating",
      label: "Create product",
    },
    {
      key: "uploading",
      label: "Upload images",
    },
    {
      key: "success",
      label: "Complete",
    },
  ];

  const currentIndex =
    status === "idle"
      ? -1
      : steps.findIndex(
          (step) => step.key === status,
        );

  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const complete =
          index <= currentIndex;

        return (
          <div
            key={step.key}
            className="flex flex-1 items-center"
          >
            <div className="flex items-center gap-2">
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  complete
                    ? "bg-neutral-950 text-white"
                    : "bg-neutral-100 text-neutral-400",
                ].join(" ")}
              >
                {index + 1}
              </div>

              <span className="hidden text-xs font-medium text-neutral-600 sm:block">
                {step.label}
              </span>
            </div>

            {index <
              steps.length - 1 && (
              <div className="mx-3 h-px flex-1 bg-neutral-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}