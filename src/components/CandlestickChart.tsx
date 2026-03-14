"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";

type CandleData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type CandlestickChartProps = {
  data: CandleData[];
};

type HoveredCandle = CandleData & { x: number; y: number };

function CandleTooltip({ candle }: { candle: HoveredCandle }) {
  const bullish = candle.close >= candle.open;
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg border border-white/30 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-xl"
      style={{ left: candle.x + 12, top: candle.y - 60 }}
    >
      <div className="mb-1 text-muted-foreground">
        {format(parseISO(candle.date), "MMM d, yyyy")}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 tabular-nums">
        <span className="text-muted-foreground">O</span>
        <span>${candle.open.toFixed(2)}</span>
        <span className="text-muted-foreground">H</span>
        <span>${candle.high.toFixed(2)}</span>
        <span className="text-muted-foreground">L</span>
        <span>${candle.low.toFixed(2)}</span>
        <span className="text-muted-foreground">C</span>
        <span style={{ color: bullish ? "var(--color-positive)" : "var(--color-negative)" }}>
          ${candle.close.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export function CandlestickChart({ data }: CandlestickChartProps) {
  const [hovered, setHovered] = useState<HoveredCandle | null>(null);

  const { yMin, yMax } = useMemo(() => {
    if (!data.length) return { yMin: 0, yMax: 1 };
    const lows = data.map((d) => d.low);
    const highs = data.map((d) => d.high);
    const lo = Math.min(...lows);
    const hi = Math.max(...highs);
    const pad = (hi - lo) * 0.08 || 1;
    return { yMin: lo - pad, yMax: hi + pad };
  }, [data]);

  const padding = { top: 8, right: 8, bottom: 24, left: 48 };

  return (
    <div className="relative h-64 w-full sm:h-72">
      {hovered && <CandleTooltip candle={hovered} />}
      <svg
        className="h-full w-full"
        viewBox="0 0 800 300"
        preserveAspectRatio="none"
        onMouseLeave={() => setHovered(null)}
      >
        <YAxis yMin={yMin} yMax={yMax} padding={padding} />
        <XAxis data={data} padding={padding} />
        {data.map((d, i) => {
          const count = data.length;
          const plotW = 800 - padding.left - padding.right;
          const plotH = 300 - padding.top - padding.bottom;
          const candleW = Math.max(2, (plotW / count) * 0.7);
          const gap = plotW / count;
          const x = padding.left + gap * i + gap / 2;

          const toY = (val: number): number =>
            padding.top + plotH * (1 - (val - yMin) / (yMax - yMin));

          const bullish = d.close >= d.open;
          const bodyTop = toY(Math.max(d.open, d.close));
          const bodyBottom = toY(Math.min(d.open, d.close));
          const bodyH = Math.max(1, bodyBottom - bodyTop);
          const color = bullish ? "var(--color-positive)" : "var(--color-negative)";

          return (
            <g
              key={d.date}
              onMouseEnter={(e) => {
                const svg = e.currentTarget.closest("svg");
                const rect = svg?.getBoundingClientRect();
                setHovered({
                  ...d,
                  x: rect ? (x / 800) * rect.width : 0,
                  y: rect ? (toY(d.high) / 300) * rect.height : 0,
                });
              }}
              style={{ cursor: "crosshair" }}
            >
              <line
                x1={x} y1={toY(d.high)} x2={x} y2={toY(d.low)}
                stroke={color} strokeWidth={1}
              />
              <rect
                x={x - candleW / 2} y={bodyTop}
                width={candleW} height={bodyH}
                fill={bullish ? color : color}
                stroke={color} strokeWidth={0.5}
                rx={0.5}
              />
              <rect
                x={x - gap / 2} y={padding.top}
                width={gap} height={300 - padding.top - padding.bottom}
                fill="transparent"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function YAxis({ yMin, yMax, padding }: { yMin: number; yMax: number; padding: { top: number; bottom: number; left: number } }) {
  const ticks = 5;
  const plotH = 300 - padding.top - padding.bottom;
  return (
    <>
      {Array.from({ length: ticks }).map((_, i) => {
        const val = yMin + ((yMax - yMin) * i) / (ticks - 1);
        const y = padding.top + plotH * (1 - i / (ticks - 1));
        return (
          <g key={i}>
            <line x1={padding.left} y1={y} x2={800 - 8} y2={y} stroke="var(--border)" strokeOpacity={0.4} strokeDasharray="3 3" />
            <text x={padding.left - 6} y={y + 3} textAnchor="end" fontSize={10} fill="var(--muted-foreground)">${val.toFixed(0)}</text>
          </g>
        );
      })}
    </>
  );
}

function XAxis({ data, padding }: { data: CandleData[]; padding: { top: number; bottom: number; left: number; right: number } }) {
  const interval = Math.max(1, Math.floor(data.length / 6));
  const plotW = 800 - padding.left - padding.right;
  const gap = plotW / data.length;
  return (
    <>
      {data.map((d, i) => {
        if (i % interval !== 0) return null;
        const x = padding.left + gap * i + gap / 2;
        return (
          <text key={d.date} x={x} y={300 - 4} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            {format(parseISO(d.date), "MMM d")}
          </text>
        );
      })}
    </>
  );
}
