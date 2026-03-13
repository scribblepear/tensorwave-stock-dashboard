type TopMover = {
  symbol: string;
  change: number;
};

type KpiCardsProps = {
  gainers: number;
  losers: number;
  avgChange: number;
  totalMarketCap: string;
  topGainer: TopMover | null;
  topLoser: TopMover | null;
};

export function KpiCards({
  gainers,
  losers,
  avgChange,
  totalMarketCap,
  topGainer,
}: KpiCardsProps) {
  const avgPositive = avgChange >= 0;
  const total = Math.max(gainers + losers, 1);

  return (
    <div className="mb-4 flex items-center gap-0 rounded-xl border border-border/50 bg-background/60 px-1 py-3">
      <StatItem label="Market Cap">
        <span className="text-sm font-semibold tabular-nums">{totalMarketCap}</span>
      </StatItem>

      <Divider />

      <StatItem label="Avg Change">
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: avgPositive ? "var(--color-positive)" : "var(--color-negative)" }}
        >
          {avgPositive ? "+" : ""}{avgChange.toFixed(2)}%
        </span>
      </StatItem>

      <Divider />

      <StatItem label="Advance / Decline">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums">
            <span style={{ color: "var(--color-positive)" }}>{gainers}</span>
            <span className="text-muted-foreground"> / </span>
            <span style={{ color: "var(--color-negative)" }}>{losers}</span>
          </span>
          <div className="flex h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-l-full"
              style={{
                width: `${(gainers / total) * 100}%`,
                backgroundColor: "var(--color-positive)",
              }}
            />
            <div
              className="h-full rounded-r-full"
              style={{
                width: `${(losers / total) * 100}%`,
                backgroundColor: "var(--color-negative)",
              }}
            />
          </div>
        </div>
      </StatItem>

      <Divider />

      <StatItem label="Top Mover">
        {topGainer ? (
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: "var(--color-positive)" }}
          >
            {topGainer.symbol} +{topGainer.change.toFixed(2)}%
          </span>
        ) : (
          <span className="text-sm font-semibold tabular-nums text-muted-foreground">N/A</span>
        )}
      </StatItem>
    </div>
  );
}

function StatItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 px-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-8 w-px shrink-0 bg-border" />;
}
