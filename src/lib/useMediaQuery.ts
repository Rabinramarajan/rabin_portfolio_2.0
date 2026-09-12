"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Matches a media query, false on the server and on the client's first render.
 *
 * Same contract as useReducedMotionSafe: an explicit server snapshot, so
 * markup that branches on the result swaps on the render *after* hydration
 * rather than mismatching during it.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
