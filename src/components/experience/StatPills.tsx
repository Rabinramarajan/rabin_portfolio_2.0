"use client";

import { about } from "@/content/about";

/**
 * The four career numbers as a pill row. Shared by the experience hero and the
 * home page journey section so the two can never state different figures —
 * both read `about.metrics`, which is the single source for them.
 */
export function StatPills({ className }: { className?: string }) {
  return (
    <ul className={className ? `xhero__stats ${className}` : "xhero__stats"}>
      {about.metrics.map((metric) => (
        <li key={metric.label} className="xhero__stat">
          <span className="xhero__stat-icon" aria-hidden>
            <StatGlyph icon={metric.icon} />
          </span>
          <span className="xhero__stat-text">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** The mark beside each metric. Mirrors the icon keys used in `about.metrics`. */
function StatGlyph({ icon }: { icon?: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "projects":
      return (
        <svg {...common}>
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4" />
        </svg>
      );
    case "clients":
      return (
        <svg {...common}>
          <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15 5.2a3 3 0 0 1 0 5.6" />
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
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7.5V12l3 1.8" />
        </svg>
      );
  }
}
