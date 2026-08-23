"use client";

import { useSyncExternalStore } from "react";

/* The timeline layout switches to its single-column mobile form below 768px. */
const QUERY = "(min-width: 768px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Whether a reveal may enter from the side.
 *
 * Side-entry reveals start the element translated horizontally. Below the
 * tablet breakpoint the content already fills the gutter, so that offset
 * pushed the element past the viewport edge — and because these elements sit
 * below the fold, the reveal that would clear the offset never fired. The
 * result was a permanent ~6px horizontal scroll on every phone width.
 *
 * Callers fall back to a vertical offset, which costs no horizontal room and
 * reads the same at narrow widths. Mirrors useReducedMotionSafe: an explicit
 * server snapshot of `false` keeps hydration matching, and mobile-first is
 * also the safe default — no offscreen offset is ever rendered on the server.
 */
export function useSideRevealSafe(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
