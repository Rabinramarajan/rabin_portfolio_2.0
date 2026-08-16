"use client";

import { useSyncExternalStore } from "react";

/**
 * Motion tiering — progressive complexity.
 *
 * Three tiers, in spirit:
 *   base  → static HTML (JavaScript disabled). The server-rendered layout is
 *           complete and functional; nothing below needs JS to be readable.
 *   basic → smooth but light. Reduced-motion users, ≤2 GB devices and ≤4-core
 *           devices get fades and short durations only: no parallax, no
 *           continuous scroll-linking, no pointer-driven layers.
 *   full  → everything. High-end devices with no reduced-motion preference.
 *
 * The tier is computed once on the client and re-evaluated when the
 * prefers-reduced-motion media query flips. A manual preference (auto /
 * basic / full) is persisted in localStorage so the choice survives sessions.
 */
export type MotionTier = "basic" | "full";
export type MotionPreference = "auto" | MotionTier;

const STORAGE_KEY = "rr-motion-tier";

type DeviceNavigator = Navigator & { deviceMemory?: number };

function readStoredPreference(): MotionPreference {
  if (typeof window === "undefined") return "auto";
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "basic" || value === "full" || value === "auto") return value;
  } catch {
    /* storage disabled or private mode — fall through to auto */
  }
  return "auto";
}

function detectTier(preference: MotionPreference): MotionTier {
  if (preference === "basic" || preference === "full") return preference;
  if (typeof window === "undefined") return "full";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "basic";
  const memory = (navigator as DeviceNavigator).deviceMemory;
  if (typeof memory === "number" && memory <= 2) return "basic";
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores <= 4) return "basic";
  return "full";
}

let tier: MotionTier = "full";
let preference: MotionPreference = "auto";
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getMotionTier(): MotionTier {
  return tier;
}

export function getMotionPreference(): MotionPreference {
  return preference;
}

export function setMotionPreference(next: MotionPreference) {
  preference = next;
  try {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore storage failures */
  }
  tier = detectTier(next);
  emit();
}

let monitoring = false;
function ensureMonitoring() {
  if (monitoring || typeof window === "undefined") return;
  monitoring = true;
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onChange = () => {
    tier = detectTier(preference);
    emit();
  };
  reduceQuery.addEventListener("change", onChange);
}

/* Eager client init so the first render already sees the real tier. During SSR
   the module never reaches this branch, so the server always renders the
   "full" structure and useSyncExternalStore reconciles on the client. */
if (typeof window !== "undefined") {
  preference = readStoredPreference();
  tier = detectTier(preference);
  ensureMonitoring();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** React hook exposing the resolved tier and the persisted preference. */
export function useMotionTier() {
  const current = useSyncExternalStore(subscribe, getMotionTier, () => "full" as MotionTier);
  const stored = useSyncExternalStore(subscribe, getMotionPreference, () => "auto" as MotionPreference);
  return { tier: current, preference: stored, setPreference: setMotionPreference };
}