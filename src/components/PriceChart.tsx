"use client";

import { useState, useMemo, useCallback } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { type DailyPrice } from "@/lib/alpha-vantage";
import { format, parseISO, subDays, subMonths } from "date-fns";

const RANGES = [
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

type PriceChartProps = {
  prices: DailyPrice[];
  onHoverDate?: (date: string | null) => void;
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: ChartDataPoint }[] }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        color: "var(--foreground)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        padding: "8px 12px",
        fontSize: "12px",
      }}
    >
      <div style={{ color: "var(--muted-foreground)", marginBottom: 2 }}>
        {format(parseISO(d.date), "MMM d, yyyy")}
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>
        ${d.close.toFixed(2)}
      </div>
    </div>
  );
}

export function PriceChart({ prices, onHoverDate }: PriceChartProps) {
  const [range, setRange] = useState("6M");
  const [activeDate, setActiveDate] = useState<string | null>(null);

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

    if (range === "All") return allData;

    const selected = RANGES.find((r) => r.label === range);
    if (!selected || selected.days === 0) return allData;

    const cutoff = selected.days <= 180
      ? subDays(new Date(), selected.days)
      : subMonths(new Date(), 12);

    return allData.filter((d) => parseISO(d.date) >= cutoff);
  }, [prices, range]);

  const firstClose = chartData[0]?.close ?? 0;
  const lastClose = chartData[chartData.length - 1]?.close ?? 0;
  const isPositive = lastClose >= firstClose;

  const strokeColor = isPositive ? "#16a34a" : "#dc2626";
  const fillColor = isPositive ? "#16a34a" : "#dc2626";

  const handleMouseMove = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => {
      const date = state?.activeLabel ? String(state.activeLabel) : null;
      setActiveDate(date);
      onHoverDate?.(date);
    },
    [onHoverDate],
  );

  const handleMouseLeave = useCallback(() => {
    setActiveDate(null);
    onHoverDate?.(null);
  }, [onHoverDate]);

  return (
    <div>
      {/* Range toggles */}
      <div className="mb-3 flex gap-1">
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setRange(r.label)}
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

      <div className="h-64 w-full sm:h-72 [&_.recharts-wrapper]:!cursor-crosshair">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 5, left: -10 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
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
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "4 4" }}
              isAnimationActive={false}
            />
            {activeDate && (
              <ReferenceLine
                x={activeDate}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
            )}
            <Area
              type="monotone"
              dataKey="close"
              stroke={strokeColor}
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ r: 5, fill: strokeColor, stroke: "#fff", strokeWidth: 2, className: "animate-active-dot" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
