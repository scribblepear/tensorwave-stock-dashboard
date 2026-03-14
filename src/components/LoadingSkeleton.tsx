import { Card, CardContent } from "@/components/ui/card";

const POINTS: [number, number][] = [
  [0, 108], [7, 112], [14, 116], [21, 118], [28, 114],
  [35, 106], [42, 98], [49, 90], [56, 84], [63, 78],
  [70, 88], [77, 96], [84, 104], [91, 100],
  [98, 92], [105, 82], [112, 72], [119, 62], [126, 56],
  [133, 66], [140, 78], [147, 88], [154, 94], [161, 100],
  [168, 96], [175, 92], [182, 98], [189, 94], [196, 88], [203, 92],
  [210, 80], [217, 68], [224, 56], [231, 46], [238, 38],
  [245, 48], [252, 54],
  [259, 38], [266, 22], [273, 10], [280, 4],
];

// smooth the path between points
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    // control points at 1/6 tension
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const PATH_D = smoothPath(POINTS);

function ChartLineLoader() {
  return (
    <div className="flex items-center justify-center w-full">
      <svg viewBox="-10 -4 300 128" fill="none" className="w-4/5 max-w-[480px] h-auto">
        <path
          d={PATH_D}
          className="chart-draw-line"
          stroke="var(--muted-foreground)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.3}
          fill="none"
        />
      </svg>
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
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-32 rounded bg-muted" />

        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-muted sm:h-16 sm:w-16" />
          {/* Desktop */}
          <div className="hidden sm:flex flex-1 flex-wrap items-baseline gap-3">
            <div className="h-9 w-56 rounded bg-muted" />
            <div className="h-9 w-20 rounded bg-muted" />
            <div className="ml-auto" />
            <div className="h-9 w-32 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
          {/* Mobile */}
          <div className="sm:hidden flex-1 space-y-1.5">
            <div className="flex items-baseline gap-2">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="h-5 w-12 rounded bg-muted" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="h-6 w-24 rounded bg-muted" />
              <div className="h-3 w-12 rounded bg-muted" />
            </div>
          </div>
        </div>

        <div className="h-5 w-full rounded bg-muted" />

        <div>
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div>
            <div className="h-6 w-32 rounded bg-muted" />
            <Card className="mt-4">
              <CardContent className="flex h-80 items-center justify-center">
                <ChartLineLoader />
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="h-6 w-28 rounded bg-muted" />
            <Card className="mt-4 h-80 sm:h-[22rem] overflow-hidden">
              <CardContent className="space-y-3 p-4">
                <div className="flex gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-4 flex-1 rounded bg-muted" />
                  ))}
                </div>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-3 flex-1 rounded bg-muted" />
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-6 w-36 rounded bg-muted" />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="mt-1.5 h-4 w-12 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
