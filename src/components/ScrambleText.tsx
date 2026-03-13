"use client";

import { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

type ScrambleTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

export function ScrambleText({ text, className = "", delay = 0, duration = 1500 }: ScrambleTextProps) {
  // Start with real text to avoid hydration mismatch
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef<number>(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    const startTime = performance.now() + delay;
    const TICK_INTERVAL = 50;

    function tick(now: number) {
      if (now - lastTickRef.current < TICK_INTERVAL) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTickRef.current = now;

      if (now < startTime) {
        setDisplayed(
          text
            .split("")
            .map((ch) => (ch === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]))
            .join("")
        );
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      const revealedCount = Math.floor(eased * text.length);

      const result = text
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealedCount) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayed(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [text, delay, duration]);

  return <span className={className} suppressHydrationWarning>{displayed}</span>;
}
