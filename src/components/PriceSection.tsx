"use client";

import { useState } from "react";
import { type DailyPrice } from "@/lib/alpha-vantage";
import { PriceChart } from "@/components/PriceChart";
import { PriceTable } from "@/components/PriceTable";
import { Card, CardContent } from "@/components/ui/card";

type PriceSectionProps = {
  prices: DailyPrice[];
};

export function PriceSection({ prices }: PriceSectionProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Price History</h2>
        <Card>
          <CardContent className="p-4">
            <PriceChart prices={prices} onHoverDate={setHoveredDate} />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Daily Prices</h2>
        <PriceTable prices={prices} highlightedDate={hoveredDate} />
      </section>
    </div>
  );
}
