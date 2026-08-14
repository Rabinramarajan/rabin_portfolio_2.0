"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Motion's own useReducedMotion reads matchMedia during the first client
 * render, so any markup that branches on it hydrates against different server
 * HTML. useSyncExternalStore gives React an explicit server snapshot, so the
 * preference is applied on the render after hydration instead of during it.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
