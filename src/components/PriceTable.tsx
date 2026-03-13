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
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Close</th>
              <th className="px-4 py-3 text-right">Volume</th>
              <th className="px-4 py-3 text-right">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {visible.map((price) => (
              <tr
                key={price.date}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
              >
                <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                  {format(parseISO(price.date), "MMM d, yyyy")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                  ${price.close.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-zinc-700 dark:text-zinc-300">
                  {price.volume.toLocaleString()}
                </td>
                <td className={`whitespace-nowrap px-4 py-3 text-right font-medium ${
                  price.percentChange > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : price.percentChange < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-zinc-500"
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
          className="mt-4 w-full rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Show more
        </button>
      )}
    </div>
  );
}
