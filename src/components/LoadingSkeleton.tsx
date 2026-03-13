import { Card, CardContent } from "@/components/ui/card";

function CandlestickLoader() {
  return (
    <div className="flex items-end justify-center gap-1.5 h-10">
      {[0, 0.15, 0.3, 0.45].map((delay, i) => (
        <div
          key={i}
          className="candle-bar w-2 rounded-sm bg-positive"
          style={{
            height: "100%",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardContent className="flex animate-pulse items-center gap-4 p-5">
        <div className="h-11 w-11 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-3 w-40 rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="mt-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-8 w-48 rounded bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
          </div>
          <div className="mt-6 h-4 w-full rounded bg-muted" />
          <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="h-3 w-16 rounded bg-muted" />
                  <div className="mt-2 h-4 w-24 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card>
          <CardContent className="flex h-80 items-center justify-center">
            <CandlestickLoader />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
