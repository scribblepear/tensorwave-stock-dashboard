"use client";

import Image from "next/image";
import { useMemo } from "react";

type HeroCompanyStepProps = {
  progress: number;
  companyInfo: {
    name: string;
    symbol: string;
    sector: string;
    description: string;
  };
};

export function HeroCompanyStep({ progress, companyInfo }: HeroCompanyStepProps) {
  const words = useMemo(() => companyInfo.description.split(" "), [companyInfo.description]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Image
          src="https://assets.parqet.com/logos/symbol/AMD?format=png"
          alt="AMD logo"
          width={40}
          height={40}
          className="rounded-lg object-contain"
        />
        <div>
          <p className="text-lg font-bold">{companyInfo.symbol}</p>
          <p className="text-sm text-muted-foreground">{companyInfo.name}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <span className="rounded-full border border-muted/50 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {companyInfo.sector}
        </span>
        <span className="rounded-full border border-muted/50 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          SEMICONDUCTORS
        </span>
      </div>

      <div className="relative max-h-[100px] overflow-hidden">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {words.map((word, i) => {
            const delay = (i / words.length) * 0.5;
            const wordProgress = Math.max(0, Math.min((progress - delay) / 0.2, 1));
            return (
              <span
                key={`${word}-${i}`}
                style={{ opacity: wordProgress }}
              >
                {word}{" "}
              </span>
            );
          })}
        </p>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
          style={{ background: "linear-gradient(to top, var(--card), transparent)" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/40 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Exchange</p>
          <p className="text-sm font-semibold">NASDAQ</p>
        </div>
        <div className="rounded-lg bg-muted/40 px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Currency</p>
          <p className="text-sm font-semibold">USD</p>
        </div>
      </div>
    </div>
  );
}
