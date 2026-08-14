"use client";

import type { ProcessStep } from "@/content/types";

/**
 * Editorial numbered index — a thin rule with seven numerals, not a pill bar.
 * Buttons so it is keyboard reachable; aria-current marks the active stage.
 */
export function ProcessNav({
  steps,
  active,
  onSelect,
  orientation,
}: {
  steps: ProcessStep[];
  active: number;
  onSelect: (index: number) => void;
  orientation: "vertical" | "horizontal";
}) {
  return (
    <nav className="pnav" data-orientation={orientation} aria-label="Process stages">
      <ol className="pnav__list">
        {steps.map((step, i) => {
          const state = i < active ? "past" : i === active ? "now" : "next";
          return (
            <li key={step.id}>
              <button
                type="button"
                className="pnav__item"
                data-state={state}
                aria-current={i === active ? "step" : undefined}
                onClick={() => onSelect(i)}
              >
                <span className="pnav__num">{step.number}</span>
                <span className="pnav__label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
