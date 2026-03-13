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

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to Dashboard
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={stock.logoUrl}
            alt={`${stock.name} logo`}
            fill
            className="object-contain p-2"
            sizes="64px"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {overview?.Name ?? stock.name}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{upperSymbol}</p>
        </div>
      </div>

      {overview?.Description && overview.Description !== "None" && (
        <p className="mb-8 leading-relaxed text-zinc-600 dark:text-zinc-400">
          {overview.Description}
        </p>
      )}

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map((field) => (
          <div
            key={field.label}
            className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
              {field.label}
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {field.value ?? "N/A"}
            </p>
          </div>
        ))}
      </div>

      {prices.length > 0 && (
        <>
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Price History
            </h2>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <PriceChart prices={prices} />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Daily Prices
            </h2>
            <PriceTable prices={prices} />
          </section>
        </>
      )}

      {prices.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-zinc-500 dark:text-zinc-400">
            Price data is currently unavailable. This may be due to API rate limits.
          </p>
        </div>
      )}
    </main>
  );
}
