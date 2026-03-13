export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  logoUrl: string;
};

function logoUrl(symbol: string): string {
  return `https://assets.parqet.com/logos/symbol/${symbol}?format=png`;
}

export const STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", logoUrl: logoUrl("AAPL") },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", logoUrl: logoUrl("MSFT") },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", logoUrl: logoUrl("GOOGL") },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", logoUrl: logoUrl("AMZN") },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", logoUrl: logoUrl("NVDA") },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", logoUrl: logoUrl("META") },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Consumer Cyclical", logoUrl: logoUrl("TSLA") },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services", logoUrl: logoUrl("JPM") },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services", logoUrl: logoUrl("V") },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", logoUrl: logoUrl("JNJ") },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive", logoUrl: logoUrl("WMT") },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare", logoUrl: logoUrl("UNH") },
  { symbol: "HD", name: "The Home Depot", sector: "Consumer Cyclical", logoUrl: logoUrl("HD") },
  { symbol: "DIS", name: "The Walt Disney Company", sector: "Communication Services", logoUrl: logoUrl("DIS") },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Communication Services", logoUrl: logoUrl("NFLX") },
];
