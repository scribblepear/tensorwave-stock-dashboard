"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { type DailyPrice } from "@/lib/alpha-vantage";
import { format, parseISO } from "date-fns";

type PriceChartProps = {
  prices: DailyPrice[];
};

export function PriceChart({ prices }: PriceChartProps) {
  const chartData = [...prices].reverse().map((p) => ({
    date: p.date,
    close: p.close,
  }));

  const firstClose = chartData[0]?.close ?? 0;
  const lastClose = chartData[chartData.length - 1]?.close ?? 0;
  const isPositive = lastClose >= firstClose;

  const strokeColor = isPositive ? "#16a34a" : "#dc2626";
  const fillColor = isPositive ? "#16a34a" : "#dc2626";

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
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
            interval="preserveStartEnd"
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            domain={["auto", "auto"]}
            tickFormatter={(val: number) => `$${val.toFixed(0)}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--foreground)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            labelFormatter={(label) => format(parseISO(String(label)), "MMM d, yyyy")}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Close"]}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: strokeColor, stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
