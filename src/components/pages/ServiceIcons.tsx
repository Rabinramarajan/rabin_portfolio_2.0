import type { SVGProps } from "react";
import type { ServiceOfferingIcon } from "@/content/types";

/**
 * Line-art glyphs for the services grid and its stats bar. Drawn on a 24-unit
 * grid with `currentColor` strokes so the lime accent flows in from CSS.
 * Each entry is a list of sub-paths — a single `d` can't express the glyphs
 * that need a detached detail (a phone's speaker, a headset's ear cups).
 */
const SERVICE_PATHS: Record<ServiceOfferingIcon, string[]> = {
  code: ["M9.5 8L5.5 12l4 4", "M14.5 8l4 4-4 4"],
  layers: ["M12 3l8.5 4.5L12 12 3.5 7.5z", "M3.5 12L12 16.5 20.5 12", "M3.5 16.5L12 21l8.5-4.5"],
  phone: ["M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5z", "M10.5 18.5h3"],
  cloud: ["M7.5 18.5a4 4 0 0 1 .4-8 5.2 5.2 0 0 1 9.9 1.4 3.6 3.6 0 0 1-.4 6.6z"],
  pen: ["M12 2.5l4.8 9a5 5 0 1 1-9.6 0z", "M12 13v6.5", "M9.5 21.5h5"],
  server: ["M3.5 4.5h17v6h-17z", "M3.5 13.5h17v6h-17z", "M6.5 7.5h.01M9 7.5h.01", "M6.5 16.5h.01M9 16.5h.01"],
  shield: ["M12 2.5l7.5 3v6.2c0 4.3-3.1 7.1-7.5 8.8-4.4-1.7-7.5-4.5-7.5-8.8V5.5z", "M9 11.8l2.2 2.2 4-4.2"],
  support: [
    "M4 14v-2a8 8 0 0 1 16 0v2",
    "M4 13.5h1.8a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H4a1.5 1.5 0 0 1-1.5-1.5v-2A1.5 1.5 0 0 1 4 13.5z",
    "M20 13.5h-1.8a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1H20a1.5 1.5 0 0 0 1.5-1.5v-2a1.5 1.5 0 0 0-1.5-1.5z",
    "M19 18.5v.5a2.5 2.5 0 0 1-2.5 2.5H13",
  ],
};

/** Glyphs for the stats bar under the grid. */
const STAT_PATHS: Record<string, string[]> = {
  people: [
    "M9 11.2a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z",
    "M2.5 19.8c0-3.4 2.9-5.6 6.5-5.6s6.5 2.2 6.5 5.6",
    "M16 5.3a3.1 3.1 0 0 1 0 5.9",
    "M17.6 14.5c2.5.5 3.9 2.3 3.9 5.1",
  ],
  rocket: [
    "M13.5 3.2c3 1 5.5 3.8 6.4 6.9l-7 7-4-1.4-1.9-4z",
    "M7.6 15.2 4.4 19.7l4.4-3.2",
    "M15.4 8.6h.01",
  ],
  award: ["M12 14.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z", "M8.6 13.4 7.5 21l4.5-2.4 4.5 2.4-1.1-7.6"],
  star: ["M12 3.2l2.7 5.6 6 .9-4.4 4.3 1.1 6.1-5.4-2.9-5.4 2.9 1.1-6.1L3.3 9.7l6-.9z"],
};

function Glyph({ paths, ...rest }: { paths: string[] } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...rest}
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function ServiceIcon({ name, ...rest }: { name: ServiceOfferingIcon } & SVGProps<SVGSVGElement>) {
  return <Glyph paths={SERVICE_PATHS[name] ?? SERVICE_PATHS.code} {...rest} />;
}

export function StatIcon({ name, ...rest }: { name: string } & SVGProps<SVGSVGElement>) {
  return <Glyph paths={STAT_PATHS[name] ?? STAT_PATHS.star} {...rest} />;
}
