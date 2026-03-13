import { Card, CardContent } from "@/components/ui/card";

// Realistic stock chart — rally, correction, consolidation, breakout, pullback, moonshot
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

// Convert points to a smooth cubic bezier path (catmull-rom interpolation)
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
      <svg viewBox="-10 -4 300 128" fill="none" className="w-3/5 max-w-[320px] h-auto">
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
        <Card className="animate-pulse">
          <CardContent className="flex h-80 items-center justify-center">
            <ChartLineLoader />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
