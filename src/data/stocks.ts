export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  logoUrl: string;
};

export const STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", logoUrl: "https://logo.clearbit.com/apple.com" },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", logoUrl: "https://logo.clearbit.com/microsoft.com" },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", logoUrl: "https://logo.clearbit.com/google.com" },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", logoUrl: "https://logo.clearbit.com/amazon.com" },
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", logoUrl: "https://logo.clearbit.com/nvidia.com" },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", logoUrl: "https://logo.clearbit.com/meta.com" },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Consumer Cyclical", logoUrl: "https://logo.clearbit.com/tesla.com" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services", logoUrl: "https://logo.clearbit.com/jpmorganchase.com" },
  { symbol: "V", name: "Visa Inc.", sector: "Financial Services", logoUrl: "https://logo.clearbit.com/visa.com" },
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", logoUrl: "https://logo.clearbit.com/jnj.com" },
  { symbol: "WMT", name: "Walmart Inc.", sector: "Consumer Defensive", logoUrl: "https://logo.clearbit.com/walmart.com" },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare", logoUrl: "https://logo.clearbit.com/unitedhealthgroup.com" },
  { symbol: "HD", name: "The Home Depot", sector: "Consumer Cyclical", logoUrl: "https://logo.clearbit.com/homedepot.com" },
  { symbol: "DIS", name: "The Walt Disney Company", sector: "Communication Services", logoUrl: "https://logo.clearbit.com/disney.com" },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Communication Services", logoUrl: "https://logo.clearbit.com/netflix.com" },
];
