"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared scroll state for the progress indicators.
 *
 * `ProgressSync` is the single writer: it feeds the section id that currently
 * crosses its IntersectionObserver threshold (through the central controller)
 * and the page-scroll percent. Navbar (active nav link) and Footer (readout)
 * both subscribe through `useScrollSync`, so the three indicators — top bar,
 * nav state, footer percent — stay synchronized with zero extra observers.
 */
export type ScrollState = {
  active: string | null;
  percent: number;
};

/** Homepage sections the single-page scroll-spy watches, in page order. */
export const HOME_SECTIONS = ["about", "services", "experience", "skills", "process", "contact"] as const;

let snapshot: ScrollState = { active: null, percent: 0 };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function setActiveSection(id: string | null | ((prev: string | null) => string | null)) {
  const next = typeof id === "function" ? id(snapshot.active) : id;
  if (next === snapshot.active) return;
  snapshot = { active: next, percent: snapshot.percent };
  emit();
}

export function setScrollPercent(value: number) {
  const percent = Math.round(value * 100);
  if (percent === snapshot.percent) return;
  snapshot = { active: snapshot.active, percent };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

/** React hook exposing { active, percent }. Server snapshot == initial client
    snapshot, so hydration never mismatches. */
export function useScrollSync(): ScrollState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}