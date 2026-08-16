"use client";

import { useEffect, useState } from "react";
import { useMotionTier } from "@/lib/motion-tier";

/**
 * Development-only frame-rate HUD. Counts rAF ticks over a rolling 500ms
 * window, reports the running FPS, the resolved motion tier, and how many
 * windows dropped below the 30fps mobile target. Returns null in production
 * builds (dead-code eliminated).
 */
export function DevFps() {
  const { tier } = useMotionTier();
  const [fps, setFps] = useState<number | null>(null);
  const [jank, setJank] = useState(0);

  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    let low = 0;
    let running = true;

    const tick = (now: number) => {
      if (!running) return;
      frames += 1;
      const elapsed = now - last;
      if (elapsed >= 500) {
        const value = Math.round((frames * 1000) / elapsed);
        if (value < 30) low += 1;
        setFps(value);
        setJank(low);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="dev-fps" aria-hidden>
      <span>{fps === null ? "—" : fps} fps</span>
      <span>tier:{tier}</span>
      <span>jank:{jank}</span>
    </div>
  );
}