import Link from "next/link";
import Image from "next/image";
import { type Stock } from "@/data/stocks";
import { Card, CardContent } from "@/components/ui/card";

type StockCardProps = {
  stock: Stock;
  price?: number;
  percentChange?: number;
  sparklineData?: number[];
};

function Sparkline({
  data,
  positive,
}: {
  data: number[];
  positive: boolean;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-6 w-[60px] shrink-0"
    >
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "var(--color-positive)" : "var(--color-negative)"}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function StockCard({
  stock,
  price,
  percentChange,
  sparklineData,
}: StockCardProps) {
  const positive = (percentChange ?? 0) >= 0;

  return (
    <Link href={`/stock/${stock.symbol}`}>
      <Card className="group bg-background transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="relative h-9 w-9 shrink-0 transition-transform duration-200 group-hover:scale-110">
            <Image
              src={stock.logoUrl}
              alt={`${stock.name} logo`}
              fill
              className="object-contain"
              sizes="36px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {stock.symbol}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {stock.name}
            </p>
          </div>
          {sparklineData && sparklineData.length > 1 && (
            <Sparkline data={sparklineData} positive={positive} />
          )}
          {price !== undefined && (
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums text-foreground">
                ${price.toFixed(2)}
              </p>
              {percentChange !== undefined && (
                <span
                  className="inline-block mt-0.5 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums"
                  style={{
                    backgroundColor: positive
                      ? "color-mix(in oklch, var(--color-positive) 15%, transparent)"
                      : "color-mix(in oklch, var(--color-negative) 15%, transparent)",
                    color: positive
                      ? "var(--color-positive)"
                      : "var(--color-negative)",
                  }}
                >
                  {positive ? "+" : ""}
                  {percentChange.toFixed(2)}%
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
