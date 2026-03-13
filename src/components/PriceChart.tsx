"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
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

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#a1a1aa" }}
            tickFormatter={(val: string) => format(parseISO(val), "MMM d")}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#a1a1aa" }}
            domain={["auto", "auto"]}
            tickFormatter={(val: number) => `$${val.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#fafafa",
            }}
            labelFormatter={(label) => format(parseISO(String(label)), "MMM d, yyyy")}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Close"]}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
