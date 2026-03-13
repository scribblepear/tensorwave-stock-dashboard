"use client";

import { useEffect, useState, useRef } from "react";

type RevealTextProps = {
  text: string;
  className?: string;
  wordsPerTick?: number;
  intervalMs?: number;
  startDelay?: number;
};

export function RevealText({
  text,
  className = "",
  wordsPerTick = 1,
  intervalMs = 40,
  startDelay = 300,
}: RevealTextProps) {
  const words = text.split(/(\s+)/);
  const [visibleCount, setVisibleCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    const totalWords = words.filter((w) => w.trim()).length;
    setVisibleCount(0);

    timerRef.current = setTimeout(() => {
      let revealed = 0;
      intervalRef.current = setInterval(() => {
        revealed += wordsPerTick;
        setVisibleCount(revealed);
        if (revealed >= totalWords) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, intervalMs);
    }, startDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, wordsPerTick, intervalMs, startDelay]);

  let wordIndex = 0;

  return (
    <p className={className}>
      {words.map((segment, i) => {
        if (!segment.trim()) {
          return <span key={i}>{segment}</span>;
        }
        const currentWordIndex = wordIndex;
        wordIndex++;
        const isVisible = currentWordIndex < visibleCount;
        return (
          <span
            key={i}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "none" : "translateX(-4px)",
              transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
              display: "inline",
            }}
          >
            {segment}
          </span>
        );
      })}
    </p>
  );
}
