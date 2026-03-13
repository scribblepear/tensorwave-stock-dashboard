import { STOCKS } from "@/data/stocks";
import { StockCard } from "@/components/StockCard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="mb-2 inline-block rounded-full bg-accent-light px-3 py-1 text-xs font-semibold text-accent">
          {STOCKS.length} Stocks
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Stock Dashboard
        </h1>
        <p className="mt-2 text-muted">
          Click any stock to view company details, price history, and more.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STOCKS.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </main>
  );
}
