import fs from "fs";
import path from "path";
import { STOCKS } from "@/data/stocks";
import { formatMarketCap } from "@/lib/alpha-vantage";
import { getMarketStatus, formatMarketDate } from "@/lib/market-status";
import { HeroSection } from "@/components/HeroSection";
import { HomeContent, type StockWithData } from "@/components/HomeContent";


type RawTimeSeriesEntry = {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
};

function loadAllPrices(symbol: string): number[] {
  const filePath = path.join(process.cwd(), "src", "data", "mock", `daily-${symbol}.json`);

  if (!fs.existsSync(filePath)) return [];

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
    "Time Series (Daily)"?: Record<string, RawTimeSeriesEntry>;
  };

  const timeSeries = raw["Time Series (Daily)"];
  if (!timeSeries) return [];

  return Object.entries(timeSeries)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => parseFloat(v["4. close"]));
}

function loadStockData(symbol: string) {
  const allPrices = loadAllPrices(symbol);

  if (allPrices.length < 2) {
    return { price: undefined, percentChange: undefined, sparklineData: undefined };
  }

  const recent = allPrices.slice(-20);
  const price = recent[recent.length - 1];
  const previousPrice = recent[recent.length - 2];
  const percentChange =
    previousPrice !== undefined && previousPrice !== 0
      ? ((price - previousPrice) / previousPrice) * 100
      : 0;

  return { price, percentChange, sparklineData: recent };
}

function loadMarketCap(symbol: string): string {
  const filePath = path.join(process.cwd(), "src", "data", "mock", `overview-${symbol}.json`);

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
      MarketCapitalization?: string;
    };
    return raw.MarketCapitalization ?? "0";
  } catch {
    return "0";
  }
}

type OverviewJson = {
  Name?: string;
  Symbol?: string;
  Sector?: string;
  Description?: string;
};

function loadCompanyInfo(symbol: string) {
  const filePath = path.join(process.cwd(), "src", "data", "mock", `overview-${symbol}.json`);

  if (!fs.existsSync(filePath)) {
    return { name: symbol, symbol, sector: "Unknown", description: "" };
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as OverviewJson;

  return {
    name: raw.Name ?? symbol,
    symbol: raw.Symbol ?? symbol,
    sector: raw.Sector ?? "Unknown",
    description: raw.Description ?? "",
  };
}

function loadTableData(symbol: string) {
  const filePath = path.join(process.cwd(), "src", "data", "mock", `daily-${symbol}.json`);

  if (!fs.existsSync(filePath)) return [];

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
    "Time Series (Daily)"?: Record<string, RawTimeSeriesEntry>;
  };

  const timeSeries = raw["Time Series (Daily)"];
  if (!timeSeries) return [];

  return Object.entries(timeSeries)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([date, v]) => ({
      date,
      close: parseFloat(v["4. close"]),
      high: parseFloat(v["2. high"]),
      low: parseFloat(v["3. low"]),
      volume: v["5. volume"],
    }));
}

export default function HomePage() {
  const { isOpen, label } = getMarketStatus();
  const formattedDate = formatMarketDate();

  const stocksWithData: StockWithData[] = STOCKS.map((stock) => {
    const { price, percentChange, sparklineData } = loadStockData(stock.symbol);
    const marketCap = loadMarketCap(stock.symbol);
    return { stock, price, percentChange, sparklineData, marketCap };
  });

  const totalMarketCapNum = stocksWithData.reduce((sum, s) => {
    const num = parseInt(s.marketCap ?? "0", 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalMarketCap = formatMarketCap(String(totalMarketCapNum));

  const heroPrices = loadAllPrices("AMD");
  const heroCompanyInfo = loadCompanyInfo("AMD");
  const heroTableData = loadTableData("AMD");

  return (
    <>
      <HeroSection
        prices={heroPrices}
        companyInfo={heroCompanyInfo}
        tableData={heroTableData}
      />

      <main id="dashboard" className="mx-auto max-w-5xl px-4 py-16 pb-20 sm:px-6 lg:px-8">
        <HomeContent
          stocksWithData={stocksWithData}
          totalMarketCap={totalMarketCap}
          formattedDate={formattedDate}
          isMarketOpen={isOpen}
          marketLabel={label}
        />
      </main>
    </>
  );
}
