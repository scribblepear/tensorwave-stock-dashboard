# TensorWave Stock Dashboard

Stock dashboard built for TensorWave's take-home coding challenge. Tracks 15 major stocks with company overviews, price charts, and financial metrics, all pulled from the Alpha Vantage API.

The homepage opens with a scroll-locked hero section featuring AMD, then drops into a stock grid with stat cards, top movers, sector filtering, and search. Click any stock to get its detail page with an interactive price chart, daily price table, and key financials.

**Live:** [tensorwave-stock-dashboard.vercel.app](https://tensorwave-stock-dashboard.vercel.app)

> **Try it:** click any stock on the homepage or go directly to [/stock/AMD](https://tensorwave-stock-dashboard.vercel.app/stock/AMD)

## Getting Started

You'll need Node.js 18+ and npm.

```bash
git clone https://github.com/scribblepear/tensorwave-stock-dashboard.git
cd tensorwave-stock-dashboard
npm install
```

Optionally, create `.env.local` with your Alpha Vantage key:

```
ALPHA_VANTAGE_API_KEY=your_key_here
```

Free keys at [alphavantage.co/support](https://www.alphavantage.co/support/#api-key). But you don't need one - all 15 stocks come pre-seeded with cached data so everything works out of the box.

```bash
npm run dev
# http://localhost:3000
```

## Tech Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Recharts for charts, shadcn/ui components, and Alpha Vantage for market data. Deployed on Vercel.

## Requirements

- [x] 15 stocks displayed on the homepage as cards with logos, tickers, and sparklines
- [x] Clicking a stock takes you to its detail page
- [x] Detail page loads Company Overview from AlphaVantage
- [x] Detail page loads TIME_SERIES_DAILY from AlphaVantage
- [x] Shows symbol, asset type, name, description, exchange, sector, industry, market cap (or "N/A")
- [x] Historical prices shown with date, close price, volume, and % change
- [x] Responsive / mobile-friendly
- [x] Company logos on both pages
- [x] Loading skeleton while data loads
- [x] Price chart with 1W / 1M / 3M / 6M range toggles
- [x] Financial fundamentals (P/E, EPS, dividend yield, beta, 52-week range, etc.)
- [x] Bidirectional chart-table interaction (click a row to highlight on chart, hover chart to scroll table)
- [x] Candlestick chart mode with line/candle toggle
- [x] Apple Stocks-style hover interaction - price info in top bar, thin crosshair, and dot on the data point
- [x] Mobile/touch support for chart interactions on both line and candlestick modes
- [x] Hero section disabled on tablet screens to avoid awkward scroll-lock on mid-size viewports
- [x] Unit tests for utility functions

## Design Decisions

**Caching strategy:** The free API tier only gives 25 calls/day, so I had to be smart about it. Company overviews get cached for 30 days (they barely change outside of earnings). Daily prices also cache for 30 days. If the API is rate-limited or down, the app falls back to the last cached response instead of breaking. All 15 overviews are pre-fetched and shipped with the app, so only daily price fetches count against the limit during normal use.

**Homepage doesn't call the API at all.** It reads directly from the cached JSON files on the server, so it loads instantly and never burns API calls. Only detail pages hit the API (and even then, only if the cache is stale).

**Scroll-locked hero.** The hero section locks the page scroll and cycles through three steps (company info, price charts, market data) as you scroll. Each step has its own animation - word-by-word text reveal, SVG chart line drawing, staggered table row fades. Scroll back up and it reverses. Inspired by Greptile's landing page.

**No framer-motion.** Considered it for animations but it felt like overkill for this project. Everything is CSS transitions + a custom scroll hook.

Cache files live in `src/data/mock/` as JSON, which doubles as the pre-seeded demo data. One catch though: Vercel's filesystem is read-only in production, so the file cache won't persist between serverless invocations. Would need Redis or similar for a real deployment.

## What I'd Improve

- The free tier only gives end-of-day prices and 100 data points (~5 months). A premium key would unlock real-time quotes and full history.
- Live prices would be cool, right now everything is end-of-day data.
- Search by company name across detail pages, not just the homepage grid.
- More test coverage - there are unit tests for utils but would want integration tests for the API caching and component tests too.

## Project Structure

```
src/
  app/              # Next.js pages (homepage + /stock/[symbol])
  components/       # UI components (hero, cards, charts, etc.)
  hooks/            # Custom React hooks
  lib/              # API client, caching, formatting utils
  data/             # Stock list + pre-seeded mock JSON (15 stocks)
```

## Tracked Stocks

AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, JPM, V, JNJ, WMT, UNH, AMD, DIS, NFLX - mix of tech, finance, healthcare, and consumer sectors.

## Time Spent

~15 hours over 3 days.
