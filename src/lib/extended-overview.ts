import { readFileSync, existsSync } from "fs";
import { join } from "path";

export type ExtendedOverview = {
  TrailingPE: string;
  ForwardPE: string;
  EPS: string;
  DividendYield: string;
  Beta: string;
  "52WeekHigh": string;
  "52WeekLow": string;
  ProfitMargin: string;
  AnalystTargetPrice: string;
  RevenueTTM: string;
  PEGRatio: string;
  ReturnOnEquityTTM: string;
};

const MOCK_DIR = join(process.cwd(), "src", "data", "mock");

const EXTENDED_KEYS: ReadonlyArray<keyof ExtendedOverview> = [
  "TrailingPE",
  "ForwardPE",
  "EPS",
  "DividendYield",
  "Beta",
  "52WeekHigh",
  "52WeekLow",
  "ProfitMargin",
  "AnalystTargetPrice",
  "RevenueTTM",
  "PEGRatio",
  "ReturnOnEquityTTM",
] as const;

export function readExtendedOverview(symbol: string): ExtendedOverview | null {
  const filePath = join(MOCK_DIR, `overview-${symbol}.json`);
  if (!existsSync(filePath)) return null;

  try {
    const raw = JSON.parse(readFileSync(filePath, "utf-8")) as Record<string, unknown>;
    if (!raw.Symbol) return null;

    const result = {} as Record<string, string>;
    for (const key of EXTENDED_KEYS) {
      const val = raw[key];
      result[key] = typeof val === "string" ? val : "None";
    }

    return result as unknown as ExtendedOverview;
  } catch {
    return null;
  }
}
