"use client";

import { motion } from "motion/react";
import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * The strip that closes the timeline — the same record the chapters above
 * describe, stated once as numbers. Values come from `about.metrics` and the
 * profile, so this panel can never drift from the rest of the site.
 */
export function JourneySummary() {
  const reduce = useReducedMotionSafe();

  const byLabel = (label: string) => about.metrics.find((m) => m.label === label)?.value ?? "—";

  const rows = [
    { key: "journey", title: "Journey", value: `${profile.yearsExperienceLabel} Years`, note: "of continuous growth and learning" },
    { key: "projects", title: "Projects", value: byLabel("Projects Completed"), note: "successfully delivered across domains" },
    { key: "clients", title: "Clients", value: byLabel("Happy Clients"), note: "satisfied clients worldwide" },
    { key: "commitment", title: "Commitment", value: byLabel("Commitment"), note: "dedicated to quality and excellence" },
  ];

  return (
    <motion.ul
      className="jsum"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0.2 : 0.6, ease }}
    >
      {rows.map((row) => (
        <li key={row.key} className="jsum__item">
          <span className="jsum__icon" aria-hidden>
            <Glyph id={row.key} />
          </span>
          <div className="jsum__text">
            <p className="jsum__title">{row.title}</p>
            <p className="jsum__value">{row.value}</p>
            <p className="jsum__note">{row.note}</p>
          </div>
        </li>
      ))}
    </motion.ul>
  );
}

function Glyph({ id }: { id: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (id) {
    case "projects":
      return (
        <svg {...common}>
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4" />
        </svg>
      );
    case "clients":
      return (
        <svg {...common}>
          <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4" />
        </svg>
      );
    case "commitment":
      return (
        <svg {...common}>
          <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2.5" />
          <path d="M4 10h16M9 3v4M15 3v4" />
        </svg>
      );
  }
}
