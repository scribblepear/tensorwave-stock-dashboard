"use client";

import { useEffect, useState } from "react";
import { HeroCompanyStep } from "@/components/HeroCompanyStep";
import { HeroChartStep } from "@/components/HeroChartStep";
import { HeroTableStep } from "@/components/HeroTableStep";

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

type HeroCardProps = {
  currentStep: number;
  stepProgress: number;
  prices: number[];
  latestPrice: number;
  change: number;
  companyInfo: CompanyInfo;
  tableData: TableRow[];
};

export function HeroCard({
  currentStep,
  stepProgress,
  prices,
  latestPrice,
  change,
  companyInfo,
  tableData,
}: HeroCardProps) {
  const positive = change >= 0;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const stepLabels = ["Company Intelligence", "Price Analytics", "Market Data"];

  return (
    <div className="hidden lg:flex lg:flex-col lg:items-end">
      <div
        className="relative w-full max-w-[420px] rounded-2xl border border-border/40 bg-card/80 backdrop-blur-xl p-7 transition-all duration-1000 ease-out"
        style={{
          boxShadow:
            "0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 12px 30px -8px rgba(0, 0, 0, 0.1)",
          minHeight: "300px",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.92)",
        }}
      >
        {currentStep === 0 && (
          <HeroCompanyStep progress={stepProgress} companyInfo={companyInfo} />
        )}
        {currentStep === 1 && (
          <HeroChartStep
            progress={stepProgress}
            prices={prices}
            latestPrice={latestPrice}
            change={change}
          />
        )}
        {currentStep === 2 && (
          <HeroTableStep progress={stepProgress} tableData={tableData} />
        )}

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

      <div className="mt-4 flex w-full max-w-[420px] flex-col items-center gap-2">
        <div className="relative h-5 w-full overflow-hidden">
          {stepLabels.map((label, i) => (
            <p
              key={label}
              className="absolute inset-0 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/60 transition-all duration-500"
              style={{
                opacity: i === currentStep ? 1 : 0,
                transform: i === currentStep ? "translateY(0)" : i < currentStep ? "translateY(-100%)" : "translateY(100%)",
              }}
            >
              {label}
            </p>
          ))}
        </div>
        <div className="flex gap-2">
          {stepLabels.map((label, i) => (
            <div
              key={label}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentStep ? "w-10 bg-amber-700" : i < currentStep ? "w-5 bg-amber-700/40" : "w-5 bg-muted/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
