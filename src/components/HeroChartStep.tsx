"use client";

import { useRef, useEffect, useMemo } from "react";

type HeroChartStepProps = {
  progress: number;
  prices: number[];
  latestPrice: number;
  change: number;
};

function pricesToPath(prices: number[], w: number, h: number, pad: number): string {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const step = w / (prices.length - 1);

  return prices
    .map((p, i) => {
      const x = i * step;
      const y = pad + ((max - p) / range) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function HeroChartStep({ progress, prices, latestPrice, change }: HeroChartStepProps) {
  const lineRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);

  const clamped = useMemo(() => Math.max(0, Math.min(progress, 1)), [progress]);
  const drawProgress = useMemo(() => Math.min(clamped / 0.8, 1), [clamped]);
  const positive = change >= 0;
  const chartColor = positive ? "var(--color-positive)" : "var(--color-negative)";
  const cardPath = prices.length > 1 ? pricesToPath(prices.slice(-40), 390, 180, 12) : "";

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.style.strokeDashoffset = String(1 - drawProgress);
    }
    if (glowRef.current) {
      glowRef.current.style.strokeDashoffset = String(1 - drawProgress);
    }
  }, [drawProgress]);

  const opacity = Math.min(clamped * 3, 1);

  return (
    <div className="flex flex-col gap-3" style={{ opacity }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">AMD</p>
          <p className="text-sm text-muted-foreground">Price Analytics</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums">${latestPrice.toFixed(2)}</p>
          <span
            className="inline-block rounded px-1.5 py-0.5 text-xs font-medium tabular-nums"
            style={{
              backgroundColor: positive
                ? "color-mix(in oklch, var(--color-positive) 15%, transparent)"
                : "color-mix(in oklch, var(--color-negative) 15%, transparent)",
              color: chartColor,
            }}
          >
            {positive ? "+" : ""}{change.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="rounded-lg bg-muted/30 p-2">
        <svg className="w-full" viewBox="0 0 390 180" preserveAspectRatio="none">
          <path
            ref={glowRef}
            d={cardPath}
            fill="none"
            stroke={chartColor}
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.15"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
          <path
            ref={lineRef}
            d={cardPath}
            fill="none"
            stroke={chartColor}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
        <span>~2 months ago</span>
        <span>Latest close</span>
      </div>
    </div>
  );
}
