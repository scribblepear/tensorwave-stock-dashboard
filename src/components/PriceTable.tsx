"use client";

import { useEffect, useRef } from "react";
import { type DailyPrice } from "@/lib/alpha-vantage";
import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";

type PriceTableProps = {
  prices: DailyPrice[];
  highlightedDate?: string | null;
  onClickDate?: (date: string | null) => void;
};

export function PriceTable({ prices, highlightedDate, onClickDate }: PriceTableProps) {
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!highlightedDate || !scrollRef.current) return;
    const row = rowRefs.current.get(highlightedDate);
    if (!row) return;

    const container = scrollRef.current;
    const rowTop = row.offsetTop;
    const rowHeight = row.offsetHeight;
    const containerHeight = container.clientHeight;
    container.scrollTo({ top: rowTop - containerHeight / 2 + rowHeight / 2, behavior: "smooth" });
  }, [highlightedDate]);

  return (
    <Card className="overflow-hidden">
      <div ref={scrollRef} className="overflow-auto max-h-[17.5rem] sm:max-h-[18rem]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-card border-b border-border">
            <tr>
              <th className="py-1 px-3 text-center text-xs font-medium text-muted-foreground">Date</th>
              <th className="py-1 px-3 text-center text-xs font-medium text-muted-foreground">Close</th>
              <th className="py-1 px-3 text-center text-xs font-medium text-muted-foreground">Volume</th>
              <th className="py-1 px-3 text-center text-xs font-medium text-muted-foreground">Change</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => {
              const isHighlighted = highlightedDate === price.date;
              return (
                <tr
                  key={price.date}
                  ref={(el) => {
                    if (el) rowRefs.current.set(price.date, el);
                  }}
                  onClick={() => onClickDate?.(isHighlighted ? null : price.date)}
                  className={`cursor-pointer border-b border-border last:border-0 transition-colors duration-100 hover:bg-muted/50 ${
                    isHighlighted
                      ? "bg-primary/15 shadow-[inset_3px_0_0_var(--color-primary)]"
                      : ""
                  }`}
                >
                  <td className="py-1.5 px-3 text-center font-medium whitespace-nowrap">
                    {format(parseISO(price.date), "MMM d, yyyy")}
                  </td>
                  <td className="py-1.5 px-3 text-center tabular-nums">
                    ${price.close.toFixed(2)}
                  </td>
                  <td className="py-1.5 px-3 text-center tabular-nums">
                    {price.volume.toLocaleString()}
                  </td>
                  <td className={`py-2 px-3 text-center tabular-nums font-semibold ${
                    price.percentChange > 0
                      ? "text-positive"
                      : price.percentChange < 0
                        ? "text-negative"
                        : "text-muted-foreground"
                  }`}>
                    {price.percentChange > 0 ? "+" : ""}
                    {price.percentChange.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
