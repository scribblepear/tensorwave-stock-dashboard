import { STOCKS } from "@/data/stocks";
import { StockCard } from "@/components/StockCard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Stock Dashboard
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Track {STOCKS.length} popular stocks. Click any stock to view details.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STOCKS.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </main>
  );
}
