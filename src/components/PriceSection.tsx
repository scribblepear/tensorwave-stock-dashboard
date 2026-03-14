"use client";

import { useState, useCallback } from "react";
import { type DailyPrice } from "@/lib/alpha-vantage";
import { PriceChart, RANGES } from "@/components/PriceChart";
import { PriceTable } from "@/components/PriceTable";
import { format, parseISO, subDays } from "date-fns";

type PriceSectionProps = {
  prices: DailyPrice[];
  latestDate?: string;
};

const GLASS = "relative rounded-xl border border-white/30 bg-white/60 shadow-sm backdrop-blur-xl overflow-hidden";

function dateInRange(date: string, rangeLabel: string): boolean {
  const selected = RANGES.find((r) => r.label === rangeLabel);
  if (!selected || selected.days === 0) return true;
  const target = parseISO(date);
  const cutoff = subDays(new Date(), selected.days);
  return target >= cutoff;
}

function bestRangeForDate(date: string, currentRange: string): string {
  if (dateInRange(date, currentRange)) return currentRange;
  const target = parseISO(date);
  const now = new Date();
  for (const r of RANGES) {
    if (r.days === 0) return r.label;
    const cutoff = subDays(now, r.days);
    if (target >= cutoff) return r.label;
  }
  return "6M";
}

export function PriceSection({ prices, latestDate }: PriceSectionProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [range, setRange] = useState("6M");
  const [chartMode, setChartMode] = useState<"line" | "candle">("line");
  const activeDate = selectedDate ?? hoveredDate;

  const handleChartHover = useCallback((date: string | null) => {
    if (date) setSelectedDate(null);
    setHoveredDate(date);
  }, []);

  const handleClickDate = useCallback((date: string | null) => {
    setSelectedDate(date);
    if (date) {
      setRange((prev) => bestRangeForDate(date, prev));
    }
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <div className={GLASS}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent" aria-hidden="true" />
        <div className="relative px-4 pt-3 pb-1">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Price History
          </p>
          <PriceChart
            prices={prices}
            onHoverDate={handleChartHover}
            activeDate={activeDate}
            selectedDate={selectedDate}
            range={range}
            onRangeChange={setRange}
            chartMode={chartMode}
            onChartModeChange={setChartMode}
          />
          {latestDate && (
            <p className="-mt-0.5 text-[10px] text-muted-foreground/40">
              Data as of {format(parseISO(latestDate), "MMM d, yyyy")}
            </p>
          )}
        </div>
      </div>

      <div className={GLASS}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] to-transparent" aria-hidden="true" />
        <div className="relative px-4 pt-3 pb-1">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Daily Prices
          </p>
          <PriceTable prices={prices} highlightedDate={activeDate} onClickDate={handleClickDate} />
        </div>
      </div>
    </div>
  );
}
