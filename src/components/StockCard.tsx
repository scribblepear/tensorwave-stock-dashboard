import Link from "next/link";
import Image from "next/image";
import { type Stock } from "@/data/stocks";

type StockCardProps = {
  stock: Stock;
};

export function StockCard({ stock }: StockCardProps) {
  return (
    <Link href={`/stock/${stock.symbol}`}>
      <div className="group flex items-center gap-4 rounded-2xl border border-card-border bg-card p-5 shadow-sm transition-all hover:shadow-lg hover:border-accent/40 hover:-translate-y-1">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-accent-light">
          <Image
            src={stock.logoUrl}
            alt={`${stock.name} logo`}
            fill
            className="object-contain p-1.5"
            sizes="48px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-lg font-bold text-foreground">
            {stock.symbol}
          </span>
          <p className="truncate text-sm text-muted">
            {stock.name}
          </p>
        </div>
        <div className="text-muted transition-all group-hover:translate-x-1 group-hover:text-accent">
          →
        </div>
      </div>
    </Link>
  );
}
