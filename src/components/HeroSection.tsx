"use client";

import { useEffect, useRef, useCallback } from "react";
import { ScrambleText } from "@/components/ScrambleText";

type HeroSectionProps = {
  prices: number[];
};

function pricesToPath(prices: number[], w: number, h: number, pad: number): string {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const step = w / (prices.length - 1);

  return prices
    .map((p, i) => {
      const x = i * step;
      const y = pad + ((max - p) / range) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const SCROLL_THRESHOLD = 600;

export function HeroSection({ prices }: HeroSectionProps) {
  const cardLineRef = useRef<SVGPathElement>(null);
  const cardGlowRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const accumulatedRef = useRef(0);
  const lockedRef = useRef(true);
  const releasedRef = useRef(false);

  const latestPrice = prices[prices.length - 1] ?? 0;
  const prevPrice = prices[prices.length - 2] ?? 0;
  const change = prevPrice ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;
  const positive = change >= 0;

  const updateChart = useCallback((progress: number) => {
    const clamped = Math.max(0, Math.min(progress, 1));
    if (cardLineRef.current) {
      cardLineRef.current.style.strokeDashoffset = String(1 - clamped);
    }
    if (cardGlowRef.current) {
      cardGlowRef.current.style.strokeDashoffset = String(1 - clamped);
    }
    if (arrowRef.current) {
      arrowRef.current.style.opacity = clamped >= 1 ? "0" : "1";
    }
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const alreadyPastHero = window.scrollY > window.innerHeight * 0.5;
    if (isMobile || alreadyPastHero) {
      lockedRef.current = false;
      releasedRef.current = true;
      updateChart(1);
    } else {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    }
    let rafId = 0;

    function onWheel(e: WheelEvent) {
      if (!lockedRef.current) return;

      e.preventDefault();
      accumulatedRef.current = Math.max(0, accumulatedRef.current + e.deltaY);
      const progress = accumulatedRef.current / SCROLL_THRESHOLD;
      updateChart(progress);

      if (progress >= 1 && !releasedRef.current) {
        releasedRef.current = true;
        lockedRef.current = false;
        document.body.style.overflow = "";
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current || !releasedRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const fade = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.5)));
        sectionRef.current.style.opacity = String(1 - fade);
      });
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
    };
  }, [updateChart]);

  const scrollToContent = () => {
    if (lockedRef.current) {
      accumulatedRef.current = SCROLL_THRESHOLD;
      updateChart(1);
      releasedRef.current = true;
      lockedRef.current = false;
      document.body.style.overflow = "";
    }
    requestAnimationFrame(() => {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const cardPath = prices.length > 1 ? pricesToPath(prices.slice(-40), 390, 180, 12) : "";
  const chartColor = positive ? "var(--color-positive)" : "var(--color-negative)";

  return (
    <section ref={sectionRef} className="relative h-screen">
      <div className="hero-gradient pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 z-10" style={{ background: "linear-gradient(to top, var(--background), transparent)" }} aria-hidden="true" />

      <div className="flex h-full items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-8 md:grid-cols-[3fr_2fr]">
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70">
              Stock Intelligence Platform
            </p>
            <h1 className="text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
              <span style={{ color: "#8B4000" }}>
                <ScrambleText text="TensorWave" duration={1200} />
              </span>
              <br />
              <span style={{ color: "var(--color-primary)" }}>
                <ScrambleText text="Markets" delay={300} duration={900} />
              </span>
            </h1>
            <p className="mt-7 max-w-md text-base text-muted-foreground/80 leading-relaxed">
              Real-time prices, trends, and analysis for the top stocks on the market.
            </p>
            <p className="mt-10 flex items-center gap-2 text-xs text-muted-foreground/50">
              <svg className="h-3.5 w-3.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Scroll to explore
            </p>
          </div>

          <div className="hidden md:block">
            <div
              className="relative w-full max-w-[400px] ml-auto rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-7"
              style={{ boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 12px 30px -8px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">AAPL</p>
                  <p className="text-sm text-muted-foreground">Apple Inc.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums">${latestPrice.toFixed(2)}</p>
                  <span
                    className="inline-block rounded px-1.5 py-0.5 text-xs font-medium tabular-nums"
                    style={{
                      backgroundColor: positive
                        ? "color-mix(in oklch, var(--color-positive) 15%, transparent)"
                        : "color-mix(in oklch, var(--color-negative) 15%, transparent)",
                      color: chartColor,
                    }}
                  >
                    {positive ? "+" : ""}{change.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted/30 p-2">
                <svg className="w-full" viewBox="0 0 390 180" preserveAspectRatio="none">
                  <path
                    ref={cardGlowRef}
                    d={cardPath}
                    fill="none"
                    stroke={chartColor}
                    strokeWidth="8"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0.15"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                  <path
                    ref={cardLineRef}
                    d={cardPath}
                    fill="none"
                    stroke={chartColor}
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                  />
                </svg>
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground tabular-nums">
                <span>40 days ago</span>
                <span>Today</span>
              </div>

              <div
                className="pointer-events-none absolute -inset-px rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${
                    positive
                      ? "color-mix(in oklch, var(--color-positive) 10%, transparent)"
                      : "color-mix(in oklch, var(--color-negative) 10%, transparent)"
                  }, transparent 50%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        ref={arrowRef}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-muted-foreground/40 transition-opacity hover:text-muted-foreground"
        aria-label="Scroll to dashboard"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
