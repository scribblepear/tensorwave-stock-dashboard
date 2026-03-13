"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const STEP_THRESHOLDS = [500, 800, 800];

type UseHeroScrollOptions = {
  totalSteps: number;
};

type UseHeroScrollReturn = {
  currentStep: number;
  stepProgress: number;
  sectionRef: React.RefObject<HTMLElement | null>;
  scrollToContent: () => void;
};

function getStepFromAccumulated(accumulated: number): { step: number; progress: number } {
  let remaining = accumulated;
  for (let i = 0; i < STEP_THRESHOLDS.length; i++) {
    const threshold = STEP_THRESHOLDS[i];
    if (remaining < threshold) {
      return { step: i, progress: remaining / threshold };
    }
    remaining -= threshold;
  }
  return { step: STEP_THRESHOLDS.length - 1, progress: 1 };
}

const TOTAL_THRESHOLD = STEP_THRESHOLDS.reduce((a, b) => a + b, 0);

export function useHeroScroll({ totalSteps }: UseHeroScrollOptions): UseHeroScrollReturn {
  const sectionRef = useRef<HTMLElement | null>(null);
  const accumulatedRef = useRef(0);
  const lockedRef = useRef(true);
  const releasedRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);

  const updateFromScroll = useCallback((accumulated: number) => {
    const clamped = Math.max(0, Math.min(accumulated, TOTAL_THRESHOLD));
    const { step, progress } = getStepFromAccumulated(clamped);
    setCurrentStep(step);
    setStepProgress(progress);
  }, []);

  const unlock = useCallback(() => {
    releasedRef.current = true;
    lockedRef.current = false;
    document.body.style.overflow = "";
  }, []);

  const lock = useCallback(() => {
    releasedRef.current = false;
    lockedRef.current = true;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  }, []);

  const scrollToContent = useCallback(() => {
    if (lockedRef.current) {
      accumulatedRef.current = TOTAL_THRESHOLD;
      setCurrentStep(totalSteps - 1);
      setStepProgress(1);
      unlock();
    }
    requestAnimationFrame(() => {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    });
  }, [totalSteps, unlock]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const alreadyPast = window.scrollY > window.innerHeight * 0.5;

    if (isMobile || alreadyPast) {
      lockedRef.current = false;
      releasedRef.current = true;
      setCurrentStep(totalSteps - 1);
      setStepProgress(1);
    } else {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    }

    let rafId = 0;

    function onWheel(e: WheelEvent) {
      if (lockedRef.current) {
        e.preventDefault();
        accumulatedRef.current = Math.max(0, accumulatedRef.current + e.deltaY);
        updateFromScroll(accumulatedRef.current);

        if (accumulatedRef.current >= TOTAL_THRESHOLD) {
          unlock();
        }
        return;
      }

      if (window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault();
        accumulatedRef.current = TOTAL_THRESHOLD + e.deltaY;
        if (accumulatedRef.current < TOTAL_THRESHOLD) {
          lock();
          updateFromScroll(accumulatedRef.current);
        }
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current || lockedRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const fade = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.5)));
        sectionRef.current.style.opacity = String(1 - fade);
      });
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
    };
  }, [totalSteps, updateFromScroll, unlock, lock]);

  return { currentStep, stepProgress, sectionRef, scrollToContent };
}
