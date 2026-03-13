export function CardSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-8 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        ))}
      </div>
      <div className="h-64 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
    </div>
  );
}
