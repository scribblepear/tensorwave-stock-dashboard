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

type StockPageProps = {
  params: Promise<{ symbol: string }>;
};

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();
  const stock = STOCKS.find((s) => s.symbol === upperSymbol);

  if (!stock) notFound();

  const overview = await fetchCompanyOverview(upperSymbol);
  const prices = await fetchDailyPrices(upperSymbol);

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
    <main className="animate-fade-in-up mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
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
          {/* Desktop: single row with name, ticker, price all baseline-aligned */}
          <div className="hidden sm:flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              <ScrambleText text={overview?.Name ?? stock.name} duration={1500} />
            </h1>
            <span className="text-3xl font-bold tracking-tight text-muted-foreground lg:text-4xl">
              <ScrambleText text={upperSymbol} delay={400} duration={800} />
            </span>
            {latestPrice && (
              <>
                <span className="ml-auto" />
                <AnimatedPrice
                  value={latestPrice.close}
                  isPositive={isPositive}
                  className="text-3xl font-bold tabular-nums lg:text-4xl"
                />
                <span className={`text-sm font-semibold tabular-nums ${isPositive ? "text-positive" : "text-negative"}`}>
                  {isPositive ? "+" : ""}{latestPrice.percentChange.toFixed(2)}%
                </span>
              </>
            )}
          </div>
          {/* Mobile: stacked — name+ticker, then price below */}
          <div className="sm:hidden">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <h1 className="text-lg font-bold tracking-tight">
                <ScrambleText text={overview?.Name ?? stock.name} duration={1500} />
              </h1>
              <span className="text-lg font-bold tracking-tight text-muted-foreground">
                <ScrambleText text={upperSymbol} delay={400} duration={800} />
              </span>
            </div>
            {latestPrice && (
              <div className="mt-0.5 flex items-baseline gap-2">
                <AnimatedPrice
                  value={latestPrice.close}
                  isPositive={isPositive}
                  className="text-xl font-bold tabular-nums"
                />
                <span className={`text-xs font-semibold tabular-nums ${isPositive ? "text-positive" : "text-negative"}`}>
                  {isPositive ? "+" : ""}{latestPrice.percentChange.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat bar — scrolling ticker */}
      <div className="relative mb-6 overflow-hidden py-2">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
        <div className="animate-stat-ticker flex whitespace-nowrap text-sm text-muted-foreground">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {stats.map((stat, i) => (
                <span key={`${copy}-${i}`} className="flex items-baseline">
                  {i > 0 && <span className="mx-3 text-border/50 select-none">|</span>}
                  <span className="font-semibold text-foreground">{stat.value ?? "N/A"}</span>
                  <span className="ml-1.5 text-[11px] text-muted-foreground/60">{stat.label}</span>
                </span>
              ))}
              <span className="mx-3 text-border/50 select-none">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Company Overview */}
      {overview?.Description && overview.Description !== "None" && (
        <div className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">Company Overview</h2>
          <RevealText text={overview.Description} className="leading-relaxed text-muted-foreground" />
        </div>
      )}

      {/* Chart + Table side by side (60/40) */}
      {prices.length > 0 && (
        <PriceSection prices={prices} />
      )}

      {prices.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Price data is currently unavailable. This may be due to API rate limits.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
