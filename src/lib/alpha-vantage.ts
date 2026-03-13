const API_KEY = process.env.ALPHA_VANTAGE_API_KEY ?? "";
const BASE_URL = "https://www.alphavantage.co/query";

export type CompanyOverview = {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  Exchange: string;
  Sector: string;
  Industry: string;
  MarketCapitalization: string;
};

export type DailyPrice = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  percentChange: number;
};

type RawTimeSeriesEntry = {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
};

async function rateLimitedFetch(url: string): Promise<Response> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return fetch(url, { cache: "no-store" });
}

export async function fetchCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
  const url = `${BASE_URL}?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`;
  const res = await rateLimitedFetch(url);
  const data: Record<string, unknown> = await res.json();

  if (!data.Symbol) return null;

  return {
    Symbol: String(data.Symbol ?? "N/A"),
    AssetType: String(data.AssetType ?? "N/A"),
    Name: String(data.Name ?? "N/A"),
    Description: String(data.Description ?? "N/A"),
    Exchange: String(data.Exchange ?? "N/A"),
    Sector: String(data.Sector ?? "N/A"),
    Industry: String(data.Industry ?? "N/A"),
    MarketCapitalization: String(data.MarketCapitalization ?? "N/A"),
  };
}

export async function fetchDailyPrices(symbol: string): Promise<DailyPrice[]> {
  const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${API_KEY}`;
  const res = await rateLimitedFetch(url);
  const data: Record<string, unknown> = await res.json();

  const timeSeries = data["Time Series (Daily)"] as Record<string, RawTimeSeriesEntry> | undefined;
  if (!timeSeries) return [];

  const entries = Object.entries(timeSeries)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 100);

  const prices: DailyPrice[] = [];

  for (let i = 0; i < entries.length; i++) {
    const [date, values] = entries[i];
    const close = parseFloat(values["4. close"]);
    const prevClose = i < entries.length - 1 ? parseFloat(entries[i + 1][1]["4. close"]) : close;
    const percentChange = prevClose !== 0 ? ((close - prevClose) / prevClose) * 100 : 0;

    prices.push({
      date,
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close,
      volume: parseInt(values["5. volume"], 10),
      percentChange,
    });
  }

  return prices;
}

export function formatMarketCap(value: string): string {
  const num = parseInt(value, 10);
  if (isNaN(num)) return "N/A";
  if (num >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}
