"use client";

import { useState } from "react";
import { type DailyPrice } from "@/lib/alpha-vantage";
import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type PriceTableProps = {
  prices: DailyPrice[];
};

const PAGE_SIZE = 20;

export function PriceTable({ prices }: PriceTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = prices.slice(0, visibleCount);

  return (
    <div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Close</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((price) => (
              <TableRow key={price.date}>
                <TableCell className="font-medium">
                  {format(parseISO(price.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  ${price.close.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {price.volume.toLocaleString()}
                </TableCell>
                <TableCell className={`text-right font-semibold ${
                  price.percentChange > 0
                    ? "text-positive"
                    : price.percentChange < 0
                      ? "text-negative"
                      : "text-muted-foreground"
                }`}>
                  {price.percentChange > 0 ? "+" : ""}
                  {price.percentChange.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {visibleCount < prices.length && (
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          Show more
        </Button>
      )}
    </div>
  );
}
