"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { type Stock } from "@/data/stocks";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedPrice } from "@/components/AnimatedPrice";

type StockCardProps = {
  stock: Stock;
  price?: number;
  percentChange?: number;
  sparklineData?: number[];
  animate?: boolean;
};

function estimatePolylineLength(data: number[]): number {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  let length = 0;
  for (let i = 1; i < data.length; i++) {
    const dx = 100 / (data.length - 1);
    const dy =
      ((data[i]! - min) / range) * 100 - ((data[i - 1]! - min) / range) * 100;
    length += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.ceil(length);
}

function Sparkline({ data, positive, animate = true }: { data: number[]; positive: boolean; animate?: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pathLength = useMemo(() => estimatePolylineLength(data), [data]);

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-6 w-[60px] shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "var(--color-positive)" : "var(--color-negative)"}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className={animate ? "sparkline-draw-in" : ""}
        style={{ "--sparkline-length": pathLength } as React.CSSProperties}
      />
    </svg>
  );
}

function hoverShadow(positive: boolean): string {
  return positive
    ? "0 8px 24px color-mix(in oklch, var(--color-positive) 25%, transparent)"
    : "0 8px 24px color-mix(in oklch, var(--color-negative) 25%, transparent)";
}

export function StockCard({ stock, price, percentChange, sparklineData, animate = true }: StockCardProps) {
  const positive = (percentChange || 0) >= 0;

  return (
    <Link href={`/stock/${stock.symbol}`}>
      <Card
        className={`group bg-background transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 border-l-2 ${
          positive ? "border-l-green-400/50" : "border-l-red-400/50"
        }`}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = hoverShadow(positive);
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "";
        }}
      >
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
            <p className="text-sm font-semibold text-foreground">{stock.symbol}</p>
            <p className="truncate text-xs text-muted-foreground">{stock.name}</p>
          </div>
          {sparklineData && sparklineData.length > 1 && (
            <Sparkline data={sparklineData} positive={positive} animate={animate} />
          )}
          {price !== undefined && (
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold tabular-nums text-foreground">
                <AnimatedPrice value={price} isPositive={positive} />
              </p>
              {percentChange !== undefined && (
                <span
                  className="inline-block mt-0.5 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums"
                  style={{
                    backgroundColor: positive
                      ? "color-mix(in oklch, var(--color-positive) 15%, transparent)"
                      : "color-mix(in oklch, var(--color-negative) 15%, transparent)",
                    color: positive ? "var(--color-positive)" : "var(--color-negative)",
                  }}
                >
                  {positive ? "+" : ""}
                  {percentChange.toFixed(2)}%
                </span>
              )}
            </div>
          )}
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </CardContent>
      </Card>
    </Link>
  );
}
