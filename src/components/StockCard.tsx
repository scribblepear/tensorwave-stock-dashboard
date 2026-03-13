import Link from "next/link";
import Image from "next/image";
import { type Stock } from "@/data/stocks";

type StockCardProps = {
  stock: Stock;
};

export function StockCard({ stock }: StockCardProps) {
  return (
    <Link href={`/stock/${stock.symbol}`}>
      <div className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={stock.logoUrl}
            alt={`${stock.name} logo`}
            fill
            className="object-contain p-1"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {stock.symbol}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {stock.sector}
            </span>
          </div>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            {stock.name}
          </p>
        </div>
        <div className="text-zinc-400 transition-transform group-hover:translate-x-1">
          →
        </div>
      </div>
    </Link>
  );
}
