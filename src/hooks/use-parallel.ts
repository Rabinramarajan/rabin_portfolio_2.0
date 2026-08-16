"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { animationController, type Phase, type RegisterOptions } from "@/lib/animation-controller";
import { useMotionTier } from "@/lib/motion-tier";

/**
 * Register an element with the central controller and expose its phase.
 * `ref` goes on the element; the phase drives the element's animation props.
 * The ref is a stable callback ref, so `idle → active → complete` is the only
 * source of truth for the reveal.
 */
export function useViewportRegister<T extends HTMLElement = HTMLDivElement>(
  options: RegisterOptions = {},
): { ref: (node: T | null) => void; phase: Phase } {
  const [phase, setPhase] = useState<Phase>("idle");
  const latestOptions = useRef(options);
  const elRef = useRef<T | null>(null);

  /* Keep the latest options for the one-time registration below. */
  useEffect(() => {
    latestOptions.current = options;
  });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    return animationController.register(el, {
      ...latestOptions.current,
      onPhase: (next) => {
        setPhase(next);
        latestOptions.current.onPhase?.(next);
      },
    });
  }, []);

  const ref = useCallback((node: T | null) => {
    elRef.current = node;
  }, []);

  return { ref, phase };
}

const COUNT_REGEX = /^(\d+(?:\.\d+)?)(.*)$/;

/**
 * Count-up that turns "30+" / "100%" style strings into an eased tally.
 * Starts when the element crosses the shared observer, animates via the
 * controller's rAF loop, and collapses to the final string under reduced
 * motion or when the value has no numeric prefix.
 */
export function useCountUp(
  raw: string,
  { duration = 1.2, delay = 0.2 }: { duration?: number; delay?: number } = {},
): { ref: (node: HTMLSpanElement | null) => void; display: string } {
  const reduce = useReducedMotion();
  const { tier } = useMotionTier();
  /* Basic tier tallies fast and quiet — the number lands instead of racing. */
  const effectiveDuration = tier === "basic" ? 0.4 : duration;
  const { ref, phase } = useViewportRegister<HTMLSpanElement>({
    threshold: 0.3,
    once: true,
    completeDelay: (duration + delay) * 1000,
  });
  const [display, setDisplay] = useState(raw);

  const parsed = useMemo(() => {
    const match = raw.match(COUNT_REGEX);
    if (!match) return null;
    return {
      value: parseFloat(match[1]),
      suffix: match[2],
      decimals: (match[1].split(".")[1] ?? "").length,
    };
  }, [raw]);

  useEffect(() => {
    /* `reduce !== false` covers the pre-hydration `null` too, so a tally can
       never start before motion preferences have resolved. */
    if (!parsed || reduce !== false || phase !== "active") return;

    let start = -1;
    const stop = animationController.addFrame((now) => {
      if (start < 0) start = now + delay * 1000;
      const p = Math.min(1, Math.max(0, (now - start) / (effectiveDuration * 1000)));
      if (p <= 0) return;
      const eased = 1 - Math.pow(1 - p, 3);
      const current = parsed.value * eased;
      const shown = parsed.decimals > 0 ? current.toFixed(parsed.decimals) : String(Math.round(current));
      setDisplay(shown + parsed.suffix);
      if (p >= 1) {
        setDisplay(raw);
        stop();
      }
    });
    return stop;
  }, [parsed, phase, reduce, raw, effectiveDuration, delay]);

  return { ref, display };
}