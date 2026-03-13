import Link from "next/link";
import Image from "next/image";
import { type Stock } from "@/data/stocks";
import { Card, CardContent } from "@/components/ui/card";

type StockCardProps = {
  stock: Stock;
};

export function StockCard({ stock }: StockCardProps) {
  return (
    <Link href={`/stock/${stock.symbol}`}>
      <Card className="group transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={stock.logoUrl}
              alt={`${stock.name} logo`}
              fill
              className="object-contain p-1.5"
              sizes="44px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-foreground">
              {stock.symbol}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {stock.name}
            </p>
          </div>
          <span className="text-sm text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary">
            →
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
