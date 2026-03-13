export function CardSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 rounded-2xl border border-card-border bg-card p-5">
      <div className="h-12 w-12 rounded-xl bg-card-border" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-20 rounded bg-card-border" />
        <div className="h-3 w-40 rounded bg-card-border" />
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-8 w-48 rounded bg-card-border" />
        <div className="h-4 w-full rounded bg-card-border" />
        <div className="h-4 w-3/4 rounded bg-card-border" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-card-border" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-card-border" />
    </div>
  );
}
