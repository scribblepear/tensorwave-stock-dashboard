import { DetailsSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <DetailsSkeleton />
    </main>
  );
}
