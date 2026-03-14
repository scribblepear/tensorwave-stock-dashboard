"use client";

import { useMemo, useCallback, useRef, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, type MouseHandlerDataParam } from "recharts";
import { type DailyPrice } from "@/lib/alpha-vantage";
import { CandlestickChart } from "@/components/CandlestickChart";
import { format, parseISO, subDays } from "date-fns";

export const RANGES = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 0 },
] as const;

type ChartDataPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  percentChange: number;
};

type ChartMode = "line" | "candle";

type PriceChartProps = {
  prices: DailyPrice[];
  onHoverDate?: (date: string | null) => void;
  activeDate?: string | null;
  selectedDate?: string | null;
  range: string;
  onRangeChange: (range: string) => void;
  chartMode: ChartMode;
  onChartModeChange: (mode: ChartMode) => void;
};

function LineChartHeader({ point, isPositive }: { point: ChartDataPoint | null; isPositive: boolean }) {
  return (
    <div className="pointer-events-none flex h-6 items-center justify-center gap-3 text-xs tabular-nums">
      {point ? (
        <>
          <span className="font-medium text-muted-foreground">
            {format(parseISO(point.date), "MMM d, yyyy")}
          </span>
          <span className="font-semibold">${point.close.toFixed(2)}</span>
          <span
            className="font-medium"
            style={{ color: isPositive ? "var(--color-positive)" : "var(--color-negative)" }}
          >
            {point.percentChange > 0 ? "+" : ""}{point.percentChange.toFixed(2)}%
          </span>
          <span className="text-muted-foreground">
            Vol {point.volume.toLocaleString()}
          </span>
        </>
      ) : (
        <span className="text-muted-foreground/50 text-[10px]">Hover or tap the chart</span>
      )}
    </div>
  );
}

export function PriceChart({ prices, onHoverDate, activeDate, selectedDate, range, onRangeChange, chartMode, onChartModeChange }: PriceChartProps) {
  const chartData = useMemo(() => {
    const allData: ChartDataPoint[] = [...prices].reverse().map((p) => ({
      date: p.date,
      open: p.open,
      high: p.high,
      low: p.low,
      close: p.close,
      volume: p.volume,
      percentChange: p.percentChange,
    }));

    const selected = RANGES.find((r) => r.label === range);
    if (!selected || selected.days === 0) return allData;

    const cutoff = subDays(new Date(), selected.days);
    // filter doesn't work right without parseISO here, just comparing strings breaks it
    return allData.filter((d) => parseISO(d.date) >= cutoff);
  }, [prices, range]);

  const firstClose = chartData[0]?.close ?? 0;
  const lastClose = chartData[chartData.length - 1]?.close ?? 0;
  const isPositive = lastClose >= firstClose;
  const lineColor = isPositive ? "#16a34a" : "#dc2626";

  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  const handleMouseMove = useCallback(
    (state: MouseHandlerDataParam) => {
      const date = state?.activeLabel ? String(state.activeLabel) : null;
      onHoverDate?.(date);
      if (date) {
        const pt = chartData.find((d) => d.date === date);
        setHoveredPoint(pt ?? null);
      }
    },
    [onHoverDate, chartData],
  );

  const handleMouseLeave = useCallback(() => {
    onHoverDate?.(null);
    setHoveredPoint(null);
  }, [onHoverDate]);

  const lineChartRef = useRef<HTMLDivElement>(null);
  const handleLineTouch = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || !lineChartRef.current) return;
      const rect = lineChartRef.current.getBoundingClientRect();
      const margin = 35;
      const relX = touch.clientX - rect.left - margin;
      const chartW = rect.width - margin - 5;
      const idx = Math.round((relX / chartW) * (chartData.length - 1));
      const clamped = Math.max(0, Math.min(idx, chartData.length - 1));
      const pt = chartData[clamped];
      onHoverDate?.(pt?.date ?? null);
      setHoveredPoint(pt ?? null);
    },
    [chartData, onHoverDate],
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => onRangeChange(r.label)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                range === r.label
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-md border border-border/50 p-0.5">
          {(["line", "candle"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onChartModeChange(mode)}
              className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                chartMode === mode
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {mode === "line" ? "Line" : "Candle"}
            </button>
          ))}
        </div>
      </div>

      {chartMode === "candle" ? (
        <CandlestickChart data={chartData} onHoverDate={onHoverDate} />
      ) : (
      <>
      <LineChartHeader point={hoveredPoint} isPositive={isPositive} />
      <div
        ref={lineChartRef}
        className="h-56 w-full sm:h-64 [&_.recharts-wrapper]:!cursor-crosshair"
        onTouchMove={handleLineTouch}
        onTouchEnd={handleMouseLeave}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 5, left: -10 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(val: string) => format(parseISO(val), "MMM d")}
              interval={Math.floor(chartData.length / 6)}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              width={45}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              domain={["auto", "auto"]}
              tickFormatter={(val: number) => `$${val.toFixed(0)}`}
              axisLine={false}
              tickLine={false}
            />
            {!selectedDate && (
              <Tooltip
                content={() => null}
                cursor={false}
                isAnimationActive={false}
              />
            )}
            {activeDate && chartData.some((d) => d.date === activeDate) && (
              <ReferenceLine
                x={activeDate}
                stroke="var(--muted-foreground)"
                strokeWidth={0.5}
                strokeDasharray="3 3"
                strokeOpacity={0.6}
              />
            )}
            <Area
              type="monotone"
              dataKey="close"
              stroke={lineColor}
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={selectedDate ? false : { r: 3, fill: lineColor, stroke: "#fff", strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      </>
      )}
    </div>
  );
}
