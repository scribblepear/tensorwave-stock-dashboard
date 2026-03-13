"use client";

import { useInView } from "@/hooks/use-in-view";

type FadeInOnViewProps = {
  children: React.ReactNode;
  className?: string;
};

export function FadeInOnView({ children, className = "" }: FadeInOnViewProps): React.ReactElement {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`${inView ? "animate-fade-in-up" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
