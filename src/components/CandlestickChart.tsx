"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { format, parseISO } from "date-fns";

type CandleData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type CandlestickChartProps = {
  data: CandleData[];
  onHoverDate?: (date: string | null) => void;
};

type HoveredCandle = CandleData & { x: number; y: number; containerW: number };

function CandleTooltip({ candle }: { candle: HoveredCandle }) {
  const bullish = candle.close >= candle.open;
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg border border-border/30 bg-background/90 px-3 py-2 text-xs shadow-lg backdrop-blur-xl"
      style={{
        left: candle.x > candle.containerW * 0.7 ? candle.x - 140 : candle.x + 12,
        top: candle.y - 60,
      }}
    >
      <div className="mb-1 font-medium text-muted-foreground">
        {format(parseISO(candle.date), "MMM d, yyyy")}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 tabular-nums">
        <span className="text-muted-foreground">O</span>
        <span>${candle.open.toFixed(2)}</span>
        <span className="text-muted-foreground">H</span>
        <span>${candle.high.toFixed(2)}</span>
        <span className="text-muted-foreground">L</span>
        <span>${candle.low.toFixed(2)}</span>
        <span className="text-muted-foreground">C</span>
        <span style={{ color: bullish ? "var(--color-positive)" : "var(--color-negative)" }}>
          ${candle.close.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export function CandlestickChart({ data, onHoverDate }: CandlestickChartProps) {
  const [hovered, setHovered] = useState<HoveredCandle | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { yMin, yMax, yTicks } = useMemo(() => {
    if (!data.length) return { yMin: 0, yMax: 1, yTicks: [] };
    const lo = Math.min(...data.map((d) => d.low));
    const hi = Math.max(...data.map((d) => d.high));
    const range = hi - lo || 1;
    const step = [1, 2, 5, 10, 25, 50, 100, 250].find((s) => range / s <= 4) ?? 50;
    const min = Math.floor(lo / step) * step;
    const max = Math.ceil(hi / step) * step;
    const ticks: number[] = [];
    for (let v = min; v <= max; v += step) ticks.push(v);
    return { yMin: min, yMax: max, yTicks: ticks };
  }, [data]);

  const xLabels = useMemo(() => {
    if (data.length <= 1) return [];
    const count = Math.min(5, data.length);
    const interval = Math.max(1, Math.floor(data.length / count));
    return data
      .map((d, i) => ({ date: d.date, i, pct: (i + 0.5) / data.length }))
      .filter((_, i) => i % interval === 0 && i > 0 && i < data.length - 1);
  }, [data]);

  const toYPct = (val: number): number => (1 - (val - yMin) / (yMax - yMin)) * 100;

  const handleTouch = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const chartLeft = 44;
      const chartW = rect.width - chartLeft;
      const relX = touch.clientX - rect.left - chartLeft;
      const idx = Math.floor((relX / chartW) * data.length);
      const d = data[Math.max(0, Math.min(idx, data.length - 1))];
      if (!d) return;
      const centerPct = (Math.max(0, Math.min(idx, data.length - 1)) + 0.5) / data.length;
      setHovered({
        ...d,
        x: chartLeft + centerPct * chartW,
        y: (toYPct(d.high) / 100) * (rect.height - 20),
        containerW: rect.width,
      });
      onHoverDate?.(d.date);
    },
    [data, onHoverDate, toYPct],
  );

  return (
    <div className="relative h-64 w-full sm:h-72" ref={containerRef}>
      {hovered && <CandleTooltip candle={hovered} />}

      <div className="absolute inset-y-0 left-0 flex w-11 flex-col justify-between py-1 pr-1.5">
        {[...yTicks].reverse().map((val) => (
          <span key={val} className="text-right text-[10px] tabular-nums text-muted-foreground">
            ${val.toFixed(0)}
          </span>
        ))}
      </div>

      <div
        className="absolute inset-0 cursor-crosshair"
        style={{ left: 44, bottom: 20 }}
        onMouseLeave={() => { setHovered(null); onHoverDate?.(null); }}
        onTouchMove={handleTouch}
        onTouchEnd={() => { setHovered(null); onHoverDate?.(null); }}
      >
        <svg className="h-full w-full" preserveAspectRatio="none">
          {yTicks.map((val) => (
            <line
              key={val}
              x1="0" x2="100%"
              y1={`${toYPct(val)}%`} y2={`${toYPct(val)}%`}
              stroke="var(--border)" strokeOpacity={0.3} strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {data.map((d, i) => {
            const count = data.length;
            const widthPct = 100 / count;
            const centerPct = (i + 0.5) * widthPct;
            const candleWidthPct = widthPct * 0.65;

            const bullish = d.close >= d.open;
            const bodyTopPct = toYPct(Math.max(d.open, d.close));
            const bodyBottomPct = toYPct(Math.min(d.open, d.close));
            const color = bullish ? "var(--color-positive)" : "var(--color-negative)";

            return (
              <g
                key={d.date}
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const svgRect = e.currentTarget.closest("svg")?.getBoundingClientRect();
                  if (!svgRect) return;
                  setHovered({
                    ...d,
                    x: svgRect.left - rect.left + (svgRect.width * centerPct) / 100,
                    y: svgRect.top - rect.top + (svgRect.height * toYPct(d.high)) / 100,
                    containerW: rect.width,
                  });
                  onHoverDate?.(d.date);
                }}
              >
                <line
                  x1={`${centerPct}%`} x2={`${centerPct}%`}
                  y1={`${toYPct(d.high)}%`} y2={`${toYPct(d.low)}%`}
                  stroke={color} strokeWidth={1} vectorEffect="non-scaling-stroke"
                />
                <rect
                  x={`${centerPct - candleWidthPct / 2}%`}
                  y={`${bodyTopPct}%`}
                  width={`${candleWidthPct}%`}
                  height={`${Math.max(0.3, bodyBottomPct - bodyTopPct)}%`}
                  fill={color}
                  rx={1}
                />
                <rect
                  x={`${i * widthPct}%`} y="0"
                  width={`${widthPct}%`} height="100%"
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="absolute bottom-0 flex h-5" style={{ left: 44, right: 0 }}>
        {xLabels.map(({ date, pct }) => (
          <span
            key={date}
            className="absolute text-[10px] text-muted-foreground"
            style={{ left: `${pct * 100}%`, transform: "translateX(-50%)" }}
          >
            {format(parseISO(date), "MMM d")}
          </span>
        ))}
      </div>
    </div>
  );
}
