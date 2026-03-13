"use client";

import { useMemo } from "react";

type SectorData = {
  name: string;
  avgChange: number;
};

type SectorPerformanceProps = {
  sectors: SectorData[];
  activeSector: string;
  onSectorClick: (sector: string) => void;
};

export function SectorPerformance({
  sectors,
  activeSector,
  onSectorClick,
}: SectorPerformanceProps) {
  const maxAbsChange = useMemo(
    () => Math.max(...sectors.map((s) => Math.abs(s.avgChange)), 0.01),
    [sectors],
  );

  if (sectors.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-3 mb-6 max-h-64 overflow-y-auto">
      <p className="text-xs font-medium text-muted-foreground mb-2">
        Sector Performance
      </p>
      <div className="space-y-1">
        {sectors.map((sector) => {
          const isActive = sector.name === activeSector;
          const positive = sector.avgChange >= 0;
          const barWidth = Math.min((Math.abs(sector.avgChange) / maxAbsChange) * 50, 40);

          return (
            <button
              key={sector.name}
              type="button"
              onClick={() => onSectorClick(sector.name)}
              className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left transition-colors hover:bg-accent/60 ${
                isActive ? "bg-accent" : ""
              }`}
            >
              <span className="w-20 shrink-0 text-xs text-muted-foreground truncate">
                {sector.name}
              </span>

              <div className="relative flex-1 h-4">
                <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
                <div
                  className={`absolute top-0.5 h-3 ${positive ? "rounded-r" : "rounded-l"}`}
                  style={{
                    ...(positive ? { left: "50%" } : { right: "50%" }),
                    width: `${barWidth}%`,
                    backgroundColor: positive ? "var(--color-positive)" : "var(--color-negative)",
                    opacity: isActive ? 1 : 0.7,
                  }}
                />
              </div>

              <span
                className="w-14 shrink-0 text-right text-xs tabular-nums font-medium"
                style={{
                  color: positive ? "var(--color-positive)" : "var(--color-negative)",
                }}
              >
                {positive ? "+" : ""}
                {sector.avgChange.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
