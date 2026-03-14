"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedPriceProps = {
  value: number;
  isPositive: boolean;
  className?: string;
};

export function AnimatedPrice({ value, isPositive, className = "" }: AnimatedPriceProps) {
  const [displayed, setDisplayed] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const from = value * 0.995;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(from + (value - from) * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        // Trigger flash when counter finishes
        setFlashing(true);
        setTimeout(() => setFlashing(false), 600);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return (
    <span
      className={`relative inline-block transition-colors duration-500 ${className}`}
      style={{
        backgroundColor: flashing
          ? isPositive
            ? "color-mix(in oklch, var(--color-positive) 15%, transparent)"
            : "color-mix(in oklch, var(--color-negative) 15%, transparent)"
          : "transparent",
        borderRadius: "6px",
        padding: "0 4px",
        margin: "0 -4px",
      }}
    >
      ${displayed.toFixed(2)}
    </span>
  );
}
