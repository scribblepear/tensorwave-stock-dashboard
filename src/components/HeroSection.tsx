"use client";

import { ScrambleText } from "@/components/ScrambleText";
import { HeroCard } from "@/components/HeroCard";
import { useHeroScroll } from "@/hooks/use-hero-scroll";

type TableRow = {
  date: string;
  close: number;
  high: number;
  low: number;
  volume: string;
};

type CompanyInfo = {
  name: string;
  symbol: string;
  sector: string;
  description: string;
};

export type HeroSectionProps = {
  prices: number[];
  companyInfo: CompanyInfo;
  tableData: TableRow[];
};

const TOTAL_STEPS = 3;

export function HeroSection({ prices, companyInfo, tableData }: HeroSectionProps) {
  const { currentStep, stepProgress, sectionRef, scrollToContent } =
    useHeroScroll({ totalSteps: TOTAL_STEPS });

  const latestPrice = prices[prices.length - 1] ?? 0;
  const prevPrice = prices[prices.length - 2] ?? 0;
  const change = prevPrice ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;

  return (
    <section ref={sectionRef} className="relative h-screen">
      <div className="hero-gradient pointer-events-none absolute inset-0" aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40"
        style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
        aria-hidden="true"
      />

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
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground/80">
              Real-time prices, trends, and analysis for the top stocks on the market.
            </p>

          </div>

          <HeroCard
            currentStep={currentStep}
            stepProgress={stepProgress}
            prices={prices}
            latestPrice={latestPrice}
            change={change}
            companyInfo={companyInfo}
            tableData={tableData}
          />
        </div>
      </div>

      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 animate-bounce flex-col items-center gap-1 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        aria-label="Scroll to dashboard"
      >
        <span className="text-xs">Scroll to explore</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
