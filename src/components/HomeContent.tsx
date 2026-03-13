"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { type Stock } from "@/data/stocks";
import { StockCard } from "@/components/StockCard";
import { KpiCards } from "@/components/KpiCards";
import { TopMovers } from "@/components/TopMovers";
import { useInView } from "@/hooks/use-in-view";

export type StockWithData = {
  stock: Stock;
  price?: number;
  percentChange?: number;
  sparklineData?: number[];
  marketCap?: string;
};

type HomeContentProps = {
  stocksWithData: StockWithData[];
  totalMarketCap: string;
  formattedDate: string;
  isMarketOpen: boolean;
  marketLabel: string;
};

export function HomeContent({
  stocksWithData,
  totalMarketCap,
  formattedDate,
  isMarketOpen,
  marketLabel,
}: HomeContentProps) {
  const [search, setSearch] = useState("");
  const [activeSector, setActiveSector] = useState("All");
  const searchRef = useRef<HTMLInputElement>(null);

  const { ref: bentoRef, inView: bentoVisible } = useInView({ threshold: 0.15 });
  const { ref: searchBarRef, inView: searchVisible } = useInView({ threshold: 0.2 });
  const { ref: gridRef, inView: gridVisible } = useInView({ threshold: 0.05 });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sectors = useMemo(() => {
    const set = new Set(stocksWithData.map((s) => s.stock.sector));
    return Array.from(set).sort();
  }, [stocksWithData]);

  const withChanges = useMemo(
    () => stocksWithData.filter((s) => s.percentChange !== undefined),
    [stocksWithData],
  );

  const gainers = withChanges.filter((s) => (s.percentChange ?? 0) >= 0);
  const losers = withChanges.filter((s) => (s.percentChange ?? 0) < 0);

  const topGainer = useMemo(
    () =>
      withChanges.length > 0
        ? withChanges.reduce((best, cur) =>
            (cur.percentChange ?? 0) > (best.percentChange ?? 0) ? cur : best,
          )
        : null,
    [withChanges],
  );

  const topLoser = useMemo(
    () =>
      withChanges.length > 0
        ? withChanges.reduce((worst, cur) =>
            (cur.percentChange ?? 0) < (worst.percentChange ?? 0) ? cur : worst,
          )
        : null,
    [withChanges],
  );

  const avgChange = useMemo(() => {
    if (withChanges.length === 0) return 0;
    return withChanges.reduce((acc, s) => acc + (s.percentChange ?? 0), 0) / withChanges.length;
  }, [withChanges]);

  const topMovers = useMemo(() => {
    return [...withChanges]
      .sort((a, b) => Math.abs(b.percentChange ?? 0) - Math.abs(a.percentChange ?? 0))
      .slice(0, 6)
      .map((s) => ({
        symbol: s.stock.symbol,
        name: s.stock.name,
        percentChange: s.percentChange ?? 0,
        logoUrl: s.stock.logoUrl,
      }));
  }, [withChanges]);

  const filtered = useMemo(() => {
    let items = stocksWithData;
    if (activeSector !== "All") {
      items = items.filter((s) => s.stock.sector === activeSector);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (s) =>
          s.stock.symbol.toLowerCase().includes(q) || s.stock.name.toLowerCase().includes(q),
      );
    }
    return items;
  }, [stocksWithData, activeSector, search]);

  return (
    <>
      <div
        ref={bentoRef}
        className={`mb-8 rounded-2xl border border-border/40 bg-muted/30 p-5 sm:p-6 ${bentoVisible ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Markets Overview</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              {isMarketOpen && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isMarketOpen ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </span>
            {marketLabel}
          </div>
        </div>

        <KpiCards
          gainers={gainers.length}
          losers={losers.length}
          avgChange={avgChange}
          totalMarketCap={totalMarketCap}
          topGainer={topGainer ? { symbol: topGainer.stock.symbol, change: topGainer.percentChange ?? 0 } : null}
          topLoser={topLoser ? { symbol: topLoser.stock.symbol, change: topLoser.percentChange ?? 0 } : null}
        />

        {topMovers.length > 0 && <TopMovers movers={topMovers} />}
      </div>

      <div
        ref={searchBarRef}
        className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-center ${searchVisible ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="relative w-full sm:w-64 shrink-0">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stocks..."
            className="h-9 w-full rounded-xl border border-input bg-background pl-9 pr-14 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mb-0.5 scrollbar-hide">
          {["All", ...sectors].map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                sector === activeSector
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">No stocks match your search.</div>
      ) : (
        <div
          ref={gridRef}
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${gridVisible ? "animate-fade-in-up-stagger" : ""}`}
        >
          {filtered.map((item) => (
            <StockCard
              key={item.stock.symbol}
              stock={item.stock}
              price={item.price}
              percentChange={item.percentChange}
              sparklineData={item.sparklineData}
              animate={gridVisible}
            />
          ))}
        </div>
      )}
    </>
  );
}
