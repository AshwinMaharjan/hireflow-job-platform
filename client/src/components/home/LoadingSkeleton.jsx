function LoadingSkeleton({ count = 6, variant = "card", columns = "md:grid-cols-2 xl:grid-cols-3" }) {
  if (variant === "row") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-1/4 rounded bg-gray-100" />
              </div>
              <div className="h-8 w-20 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${columns}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gray-200" />
            <div className="flex-1">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-1/2 rounded bg-gray-100" />
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
          </div>
          <div className="mt-8 flex gap-3">
            <div className="h-8 w-24 rounded-full bg-gray-200" />
            <div className="h-8 w-28 rounded-full bg-gray-200" />
          </div>
          <div className="mt-8 h-10 rounded-xl bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;