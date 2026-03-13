import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { STOCKS } from "@/data/stocks";
import { fetchCompanyOverview, fetchDailyPrices, formatMarketCap } from "@/lib/alpha-vantage";
import { PriceChart } from "@/components/PriceChart";
import { PriceTable } from "@/components/PriceTable";

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

  const fields = [
    { label: "Symbol", value: overview?.Symbol },
    { label: "Asset Type", value: overview?.AssetType },
    { label: "Exchange", value: overview?.Exchange },
    { label: "Sector", value: overview?.Sector },
    { label: "Industry", value: overview?.Industry },
    { label: "Market Cap", value: overview ? formatMarketCap(overview.MarketCapitalization) : undefined },
  ];

  const latestPrice = prices[0];
  const isPositive = latestPrice ? latestPrice.percentChange >= 0 : true;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
      >
        ← Back to Dashboard
      </Link>

      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-accent-light">
          <Image
            src={stock.logoUrl}
            alt={`${stock.name} logo`}
            fill
            className="object-contain p-2"
            sizes="64px"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {overview?.Name ?? stock.name}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-muted">{upperSymbol}</span>
            {latestPrice && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${
                isPositive
                  ? "bg-positive/10 text-positive"
                  : "bg-negative/10 text-negative"
              }`}>
                {isPositive ? "+" : ""}{latestPrice.percentChange.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        {latestPrice && (
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">${latestPrice.close.toFixed(2)}</p>
            <p className="text-xs text-muted">Latest close</p>
          </div>
        )}
      </div>

      {overview?.Description && overview.Description !== "None" && (
        <p className="mb-8 leading-relaxed text-muted">
          {overview.Description}
        </p>
      )}

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map((field) => (
          <div
            key={field.label}
            className="rounded-xl border border-card-border bg-card p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {field.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {field.value ?? "N/A"}
            </p>
          </div>
        ))}
      </div>

      {prices.length > 0 && (
        <>
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Price History
            </h2>
            <div className="rounded-2xl border border-card-border bg-card p-4">
              <PriceChart prices={prices} />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Daily Prices
            </h2>
            <PriceTable prices={prices} />
          </section>
        </>
      )}

      {prices.length === 0 && (
        <div className="rounded-2xl border border-card-border bg-card p-8 text-center">
          <p className="text-muted">
            Price data is currently unavailable. This may be due to API rate limits.
          </p>
        </div>
      )}
    </main>
  );
}
