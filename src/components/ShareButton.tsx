"use client";

import { useState, useCallback } from "react";

export function ShareButton(): React.ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout((): void => {
        setCopied(false);
      }, 2000);
    } catch {
      /* clipboard not available, ignore */
    }
  }, []);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        aria-label="Copy page link"
      >
        <svg
          className="h-3 w-3"
          style={{ color: "var(--color-primary)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H14.25M14.25 3.75l-3-3m0 0l-3 3m3-3v10.5"
          />
        </svg>
        Share
      </button>
      {copied && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[10px] font-medium text-background animate-fade-in-up">
          Copied!
        </span>
      )}
    </div>
  );
}
