import { type ExtendedOverview } from "@/lib/extended-overview";
import {
  formatLargeNumber,
  formatPercent,
  formatRatio,
  formatCurrency,
} from "@/lib/format-financial";

type MetricItem = {
  label: string;
  value: string;
  accent?: "positive" | "negative" | "neutral";
};

function buildMetrics(data: ExtendedOverview): MetricItem[] {
  return [
    { label: "Trailing P/E", value: formatRatio(data.TrailingPE) },
    { label: "Forward P/E", value: formatRatio(data.ForwardPE) },
    { label: "EPS", value: formatCurrency(data.EPS) },
    { label: "PEG Ratio", value: formatRatio(data.PEGRatio) },
    { label: "Revenue (TTM)", value: formatLargeNumber(data.RevenueTTM) },
    { label: "Profit Margin", value: formatPercent(data.ProfitMargin) },
    { label: "Dividend Yield", value: formatPercent(data.DividendYield) },
    { label: "Beta", value: formatRatio(data.Beta) },
    { label: "52-Week High", value: formatCurrency(data["52WeekHigh"]) },
    { label: "52-Week Low", value: formatCurrency(data["52WeekLow"]) },
    { label: "Analyst Target", value: formatCurrency(data.AnalystTargetPrice) },
    { label: "ROE (TTM)", value: formatPercent(data.ReturnOnEquityTTM) },
  ];
}

type FinancialMetricsProps = {
  data: ExtendedOverview;
};

export function FinancialMetrics({ data }: FinancialMetricsProps) {
  const metrics = buildMetrics(data);

  return (
    <section className="mt-10 mb-8">
      <h2 className="mb-3 text-lg font-semibold">Fundamentals</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5 transition-colors hover:bg-muted/50"
          >
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
