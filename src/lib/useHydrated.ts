"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during SSR and on the client's first render, true from the commit
 * onward.
 *
 * Client-only signals (the motion tier, matchMedia, localStorage) read as
 * their SSR defaults on the server but as the real value on the client's very
 * first render. Branching markup on them directly is a hydration mismatch, and
 * React does not patch up mismatched attributes - the DOM is left stranded
 * with the server's classes even though React rendered something else.
 *
 * Gating on this defers the swap to an ordinary post-hydration re-render,
 * which the DOM does follow.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
