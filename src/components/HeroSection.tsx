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
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-6 px-6 lg:gap-12 lg:px-8 lg:grid-cols-[3fr_2fr]">
          <div className="text-center lg:text-left">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70">
              Stock Dashboard
            </p>
            <h1 className="text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="text-[#8B4000] dark:text-[#2dd4bf]">
                <ScrambleText text="TensorWave" duration={1200} />
              </span>
              <br />
              <span style={{ color: "var(--color-primary)" }}>
                <ScrambleText text="Markets" delay={300} duration={900} />
              </span>
            </h1>
            <p className="mx-auto mt-7 max-w-md text-base leading-relaxed text-muted-foreground/80 lg:mx-0">
              Track prices and trends for 15 major stocks.
            </p>

          </div>

          <div className="max-w-sm mx-auto lg:max-w-none lg:mx-0">
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
