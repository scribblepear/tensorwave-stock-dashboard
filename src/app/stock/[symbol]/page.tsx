import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { STOCKS } from "@/data/stocks";
import { fetchCompanyOverview, fetchDailyPrices, formatMarketCap } from "@/lib/alpha-vantage";
import { PriceSection } from "@/components/PriceSection";
import { AnimatedPrice } from "@/components/AnimatedPrice";
import { ScrambleText } from "@/components/ScrambleText";
import { RevealText } from "@/components/RevealText";
import { Card, CardContent } from "@/components/ui/card";
import { FinancialMetrics } from "@/components/FinancialMetrics";
import { readExtendedOverview } from "@/lib/extended-overview";

type StockPageProps = {
  params: Promise<{ symbol: string }>;
};

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();
  const stock = STOCKS.find((s) => s.symbol === upperSymbol);

  if (!stock) {
    return { title: "Stock Not Found" };
  }

  const title = `${stock.name} (${upperSymbol}) | TensorWave Stock Dashboard`;
  const description = `Price history and company info for ${stock.name} (${upperSymbol})`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();
  const stock = STOCKS.find((s) => s.symbol === upperSymbol);

  if (!stock) notFound();

  const [overview, prices] = await Promise.all([
    fetchCompanyOverview(upperSymbol),
    fetchDailyPrices(upperSymbol),
  ]);

  const extendedOverview = readExtendedOverview(upperSymbol);
  const latestPrice = prices[0];
  const isPositive = latestPrice ? latestPrice.percentChange >= 0 : true;

  const stats = [
    { label: "Exchange", value: overview?.Exchange },
    { label: "Sector", value: overview?.Sector },
    { label: "Industry", value: overview?.Industry },
    { label: "Market Cap", value: overview ? formatMarketCap(overview.MarketCapitalization) : undefined },
    { label: "Type", value: overview?.AssetType },
  ];

  return (
    <main className="relative animate-fade-in-up mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "linear-gradient(135deg, oklch(from var(--primary) l c h / 0.025) 0%, transparent 40%, transparent 60%, oklch(from var(--primary) l c h / 0.015) 100%)" }}
        aria-hidden="true"
      />
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        <svg className="h-3 w-3" style={{ color: "var(--color-primary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      <div className="mb-5 flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
          <Image
            src={stock.logoUrl}
            alt={`${stock.name} logo`}
            fill
            className="object-contain"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="hidden sm:flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              <ScrambleText text={overview?.Name ?? stock.name} duration={1500} />
            </h1>
            <span className="mx-2.5 h-7 w-[2px] shrink-0 rounded-full bg-border self-center" />
            <span className="text-3xl font-bold tracking-tight lg:text-4xl" style={{ color: "var(--color-primary)" }}>
              <ScrambleText text={upperSymbol} delay={400} duration={800} />
            </span>
            {latestPrice && (
              <>
                <span className="ml-auto" />
                <AnimatedPrice
                  value={latestPrice.close}
                  isPositive={isPositive}
                  className="text-4xl font-bold tabular-nums tracking-tight lg:text-5xl"
                />
                <span
                  className="rounded px-1.5 py-0.5 text-sm font-semibold tabular-nums"
                  style={{
                    backgroundColor: isPositive
                      ? "color-mix(in oklch, var(--color-positive) 15%, transparent)"
                      : "color-mix(in oklch, var(--color-negative) 15%, transparent)",
                    color: isPositive ? "var(--color-positive)" : "var(--color-negative)",
                  }}
                >
                  {isPositive ? "+" : ""}{latestPrice.percentChange.toFixed(2)}%
                </span>
              </>
            )}
          </div>
          <div className="sm:hidden">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <h1 className="text-lg font-bold tracking-tight">
                <ScrambleText text={overview?.Name ?? stock.name} duration={1500} />
              </h1>
              <span className="mx-1.5 h-4 w-[2px] shrink-0 rounded-full bg-border self-center" />
              <span className="text-lg font-bold tracking-tight" style={{ color: "var(--color-primary)" }}>
                <ScrambleText text={upperSymbol} delay={400} duration={800} />
              </span>
            </div>
            {latestPrice && (
              <div className="mt-0.5 flex items-baseline gap-2">
                <AnimatedPrice
                  value={latestPrice.close}
                  isPositive={isPositive}
                  className="text-2xl font-bold tabular-nums tracking-tight"
                />
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums"
                  style={{
                    backgroundColor: isPositive
                      ? "color-mix(in oklch, var(--color-positive) 15%, transparent)"
                      : "color-mix(in oklch, var(--color-negative) 15%, transparent)",
                    color: isPositive ? "var(--color-positive)" : "var(--color-negative)",
                  }}
                >
                  {isPositive ? "+" : ""}{latestPrice.percentChange.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-6 overflow-hidden rounded-xl border border-border/40 bg-muted py-3">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-muted to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-muted to-transparent" />
        <div className="animate-stat-ticker flex whitespace-nowrap text-sm text-muted-foreground">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {stats.map((stat, i) => (
                <span key={`${copy}-${i}`} className="flex items-baseline">
                  {i > 0 && <span className="mx-3 text-border/50 select-none">|</span>}
                  <span className="font-semibold text-foreground">{stat.value ?? "N/A"}</span>
                  <span className="ml-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">{stat.label}</span>
                </span>
              ))}
              <span className="mx-3 text-border/50 select-none">|</span>
            </div>
          ))}
        </div>
      </div>

      {overview?.Description && overview.Description !== "None" && (
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">Company Overview</h2>
          <RevealText text={overview.Description} className="leading-relaxed text-muted-foreground" />
        </div>
      )}

      {prices.length > 0 && (
        <PriceSection prices={prices} latestDate={latestPrice?.date} />
      )}

      {prices.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <svg className="h-8 w-8 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4-4 4 4 4-6 4 4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
            </svg>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Price data unavailable - the Alpha Vantage free tier allows 25 requests per day. Try again later or check back tomorrow.
            </p>
          </CardContent>
        </Card>
      )}

      {extendedOverview && <FinancialMetrics data={extendedOverview} />}
    </main>
  );
}
