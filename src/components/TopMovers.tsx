import Link from "next/link";
import Image from "next/image";

type Mover = {
  symbol: string;
  name: string;
  percentChange: number;
  logoUrl: string;
};

type TopMoversProps = {
  movers: Mover[];
};

function ChangeBadge({ value }: { value: number }): React.ReactElement {
  const positive = value >= 0;
  return (
    <span
      className="rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums"
      style={{
        backgroundColor: positive
          ? "color-mix(in oklch, var(--color-positive) 15%, transparent)"
          : "color-mix(in oklch, var(--color-negative) 15%, transparent)",
        color: positive
          ? "var(--color-positive)"
          : "var(--color-negative)",
      }}
    >
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export function TopMovers({ movers }: TopMoversProps): React.ReactElement {
  return (
    <section>
      <p className="text-sm font-medium text-muted-foreground mb-3">
        Top Movers
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {movers.map((mover) => (
          <Link
            href={`/stock/${mover.symbol}`}
            key={mover.symbol}
            className="shrink-0 flex items-center gap-2 rounded-xl border border-border/50 bg-muted/40 px-3 py-2 transition-colors hover:bg-accent/60 hover:border-primary/30"
          >
            <div className="relative h-4 w-4 shrink-0">
              <Image
                src={mover.logoUrl}
                alt={`${mover.name} logo`}
                fill
                className="object-contain"
                sizes="16px"
              />
            </div>
            <span className="text-sm font-bold">{mover.symbol}</span>
            <ChangeBadge value={mover.percentChange} />
          </Link>
        ))}
      </div>
    </section>
  );
}
