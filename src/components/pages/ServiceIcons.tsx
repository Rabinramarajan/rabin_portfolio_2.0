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
