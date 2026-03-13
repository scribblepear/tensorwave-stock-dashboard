# Stock Dashboard

A responsive stock market dashboard built with Next.js, TypeScript, Tailwind CSS, and the AlphaVantage API.

## Features

- **Homepage** — 15 popular stocks displayed as cards with company logos, ticker symbols, and sector tags
- **Stock Details** — click any stock to view company overview, price history chart, and daily price table
- **Price Chart** — interactive line chart showing ~100 days of historical close prices (Recharts)
- **Daily Prices** — paginated table with date, close price, volume, and daily percentage change
- **Responsive** — mobile-friendly layout using Tailwind CSS
- **Loading States** — skeleton animations while data loads
- **Rate Limit Handling** — in-memory caching with local data fallback when API limits are reached

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **API:** AlphaVantage (Company Overview + Time Series Daily)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- An [AlphaVantage API key](https://www.alphavantage.co/support/#api-key) (free tier)

### Installation

```bash
git clone https://github.com/scribblepear/tensorwave-stock-dashboard.git
cd tensorwave-stock-dashboard
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage with stock cards
│   ├── layout.tsx                  # Root layout with fonts and global styles
│   └── stock/[symbol]/
│       ├── page.tsx                # Stock details (server component)
│       └── loading.tsx             # Loading skeleton
├── components/
│   ├── StockCard.tsx               # Individual stock card
│   ├── PriceChart.tsx              # Recharts line chart
│   ├── PriceTable.tsx              # Paginated price table
│   └── LoadingSkeleton.tsx         # Skeleton animations
├── data/
│   ├── stocks.ts                   # Static stock list (15 tickers)
│   └── mock/                       # Fallback data for rate-limited API
└── lib/
    └── alpha-vantage.ts            # API client with caching and retry logic
```

## API Rate Limits

AlphaVantage's free tier allows 25 requests per day. The app handles this by:

1. Caching successful API responses in memory for 24 hours
2. Spacing requests 1.5 seconds apart to avoid per-second burst limits
3. Falling back to local mock data when the API returns a rate limit error
