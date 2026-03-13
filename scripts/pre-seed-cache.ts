import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
if (!API_KEY) {
  console.error("Missing ALPHA_VANTAGE_API_KEY. Run with: npx tsx --env-file=.env.local scripts/pre-seed-cache.ts");
  process.exit(1);
}

const SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA",
  "JPM", "V", "JNJ", "WMT", "UNH", "HD", "DIS", "NFLX",
];

const MOCK_DIR = join(process.cwd(), "src", "data", "mock");
const BASE_URL = "https://www.alphavantage.co/query";
const DELAY_MS = 13_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOverview(symbol: string): Promise<Record<string, unknown> | null> {
  const url = `${BASE_URL}?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
  const res = await fetch(url);
  const data: Record<string, unknown> = await res.json();

  if (typeof data.Information === "string" && String(data.Information).includes("rate limit")) {
    console.error(`  RATE LIMITED on ${symbol}. Stopping.`);
    return null;
  }

  if (!data.Symbol) {
    console.error(`  No data returned for ${symbol}. Response:`, JSON.stringify(data).slice(0, 200));
    return null;
  }

  return data;
}

async function main(): Promise<void> {
  mkdirSync(MOCK_DIR, { recursive: true });

  console.log(`Pre-seeding ${SYMBOLS.length} company overviews...`);
  console.log(`Delay between calls: ${DELAY_MS / 1000}s (respecting 5/min rate limit)\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < SYMBOLS.length; i++) {
    const symbol = SYMBOLS[i];
    console.log(`[${i + 1}/${SYMBOLS.length}] Fetching ${symbol}...`);

    try {
      const data = await fetchOverview(symbol);
      if (!data) {
        failed++;
        console.log(`  FAILED: ${symbol}\n`);
        continue;
      }

      const filePath = join(MOCK_DIR, `overview-${symbol}.json`);
      writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  Saved: overview-${symbol}.json`);
      success++;
    } catch (err) {
      console.error(`  ERROR on ${symbol}:`, err instanceof Error ? err.message : err);
      failed++;
    }

    if (i < SYMBOLS.length - 1) {
      console.log(`  Waiting ${DELAY_MS / 1000}s before next call...\n`);
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nDone! ${success} succeeded, ${failed} failed.`);
  console.log(`Total API calls used: ${success + failed} of 25 daily limit.`);
}

main();
