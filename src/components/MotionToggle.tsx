"use client";

import { useMotionTier, type MotionPreference } from "@/lib/motion-tier";

const CYCLE: MotionPreference[] = ["auto", "basic", "full"];
const LABEL: Record<MotionPreference, string> = {
  auto: "Auto",
  basic: "Reduced",
  full: "Full",
};

/**
 * Persisted animation-intensity control. Cycles Auto → Reduced → Full; the
 * choice is stored in localStorage by the motion-tier module so it survives
 * sessions. "Auto" defers to prefers-reduced-motion + device capability.
 */
export function MotionToggle() {
  const { preference, setPreference } = useMotionTier();
  const cycle = () => {
    const next = CYCLE[(CYCLE.indexOf(preference) + 1) % CYCLE.length];
    setPreference(next);
  };
  return (
    <button
      type="button"
      className="ft__motion"
      onClick={cycle}
      aria-pressed={preference !== "auto"}
      title="Animation intensity — cycles Auto, Reduced, Full (stored for next visit)"
    >
      Motion: {LABEL[preference]}
    </button>
  );
}