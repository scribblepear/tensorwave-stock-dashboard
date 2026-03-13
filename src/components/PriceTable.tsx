"use client";

import { useState } from "react";
import { type DailyPrice } from "@/lib/alpha-vantage";
import { format, parseISO } from "date-fns";

type PriceTableProps = {
  prices: DailyPrice[];
};

const PAGE_SIZE = 20;

export function PriceTable({ prices }: PriceTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = prices.slice(0, visibleCount);

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-card-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-card-border text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Close</th>
              <th className="px-4 py-3 text-right">Volume</th>
              <th className="px-4 py-3 text-right">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {visible.map((price) => (
              <tr
                key={price.date}
                className="transition-colors hover:bg-accent-light/50"
              >
                <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                  {format(parseISO(price.date), "MMM d, yyyy")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-foreground">
                  ${price.close.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-muted">
                  {price.volume.toLocaleString()}
                </td>
                <td className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                  price.percentChange > 0
                    ? "text-positive"
                    : price.percentChange < 0
                      ? "text-negative"
                      : "text-muted"
                }`}>
                  {price.percentChange > 0 ? "+" : ""}
                  {price.percentChange.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleCount < prices.length && (
        <button
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          className="mt-4 w-full rounded-xl border border-card-border bg-card py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-light"
        >
          Show more
        </button>
      )}
    </div>
  );
}
