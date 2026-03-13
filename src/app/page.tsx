import { STOCKS } from "@/data/stocks";
import { StockCard } from "@/components/StockCard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Stock Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
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
