export function formatLargeNumber(value: string | undefined): string {
  if (!value || value === "None") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  if (num >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(1)}T`;
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  return `$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatPercent(value: string | undefined): string {
  if (!value || value === "None" || isNaN(parseFloat(value))) return "N/A";
  return `${(parseFloat(value) * 100).toFixed(2)}%`;
}

export function formatRatio(value: string | undefined): string {
  if (!value || value === "None" || value === "0") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return num.toFixed(2);
}

export function formatCurrency(value: string | undefined): string {
  if (!value) return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return `$${num.toFixed(2)}`;
}
