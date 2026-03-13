"use client";

import { useMemo } from "react";

type TableRow = {
  date: string;
  close: number;
  high: number;
  low: number;
  volume: string;
};

type HeroTableStepProps = {
  progress: number;
  tableData: TableRow[];
};

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
}

function formatVolume(vol: string): { num: string; suffix: string } {
  const n = parseInt(vol, 10);
  if (n >= 1_000_000) return { num: (n / 1_000_000).toFixed(1), suffix: "M" };
  if (n >= 1_000) return { num: (n / 1_000).toFixed(0), suffix: "K" };
  return { num: vol, suffix: "" };
}

export function HeroTableStep({ progress, tableData }: HeroTableStepProps) {
  const clamped = useMemo(() => Math.max(0, Math.min(progress, 1)), [progress]);
  const opacity = Math.min(clamped * 3, 1);
  const translateY = (1 - Math.min(clamped * 2, 1)) * 20;

  const rows = [...tableData].reverse();

  return (
    <div
      className="flex flex-col gap-3"
      style={{ opacity, transform: `translateY(${translateY}px)` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">Market Data</p>
        </div>
        <span className="rounded-full border border-muted/50 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          Daily
        </span>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-muted/50">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-muted/40">
              <th className="px-3 py-1.5 text-left text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">Date</th>
              <th className="px-3 py-1.5 text-right text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">Close</th>
              <th className="px-3 py-1.5 text-right text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">High</th>
              <th className="px-3 py-1.5 text-right text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">Low</th>
              <th className="px-3 py-1.5 text-right text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">Vol</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const rowDelay = i * 0.08;
              const rowOpacity = Math.max(0, Math.min((clamped - rowDelay) * 4, 1));
              const isLatest = i === 0;
              const vol = formatVolume(row.volume);
              return (
                <tr
                  key={row.date}
                  className={`border-b border-muted/30 last:border-b-0 ${isLatest ? "border-l-2 border-l-amber-700" : ""}`}
                  style={{ opacity: rowOpacity }}
                >
                  <td className="px-3 py-1.5 font-mono tabular-nums">{formatDate(row.date)}</td>
                  <td className="px-3 py-1.5 text-right font-mono font-bold tabular-nums">
                    ${row.close.toFixed(2)}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-muted-foreground">
                    ${row.high.toFixed(2)}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-muted-foreground">
                    ${row.low.toFixed(2)}
                  </td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums text-muted-foreground">
                    {vol.num}<span className="opacity-50">{vol.suffix}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, white 10%, transparent)" }}
        />
      </div>
    </div>
  );
}
