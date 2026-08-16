import type { SVGProps } from "react";

/**
 * Line-art glyphs for the services grid. Drawn on a 24-unit grid with
 * `currentColor` strokes so the lime accent flows in from CSS.
 */

const PATHS: Record<string, string> = {
  monitor: "M3 4.5h18v11H3zM8 20h8M12 15.5V20",
  layers: "M12 3l8 4.5-8 4.5-8-4.5zM4 12l8 4.5 8-4.5M4 16.5L12 21l8-4.5",
  code: "M9.5 8.5L6 12l3.5 3.5M14.5 8.5L18 12l-3.5 3.5",
  pen: "M12 3l4.5 8.5a4.5 4.5 0 1 1-9 0zM12 13.5V19M9.5 21h5",
  gauge: "M4 17a8 8 0 1 1 16 0M12 17l3.5-5",
  phone: "M7.5 3h9v18h-9zM10.5 18h3",
  grid: "M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z",
  database: "M12 3c4 0 7 1 7 2.5S16 8 12 8 5 7 5 5.5 8 3 12 3zM5 5.5v13C5 20 8 21 12 21s7-1 7-2.5v-13M5 12c0 1.5 3 2.5 7 2.5s7-1 7-2.5",
  cloud: "M7 18a4 4 0 0 1 .5-8 5 5 0 0 1 9.5 1.5 3.5 3.5 0 0 1-.5 6.5zM12 16v-6M9.5 12.5L12 10l2.5 2.5",
  shield: "M12 3l7 3v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V6zM9 12l2 2 4-4",
};

export function ServiceIcon({ name, ...rest }: { name: string } & SVGProps<SVGSVGElement>) {
  const d = PATHS[name] ?? PATHS.grid;
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
      <path d={d} />
    </svg>
  );
}

/** Service id → glyph. Unknown ids fall back to the grid mark. */
export const serviceIconMap: Record<string, string> = {
  frontend: "monitor",
  angular: "layers",
  react: "code",
  ui: "pen",
  performance: "gauge",
  ionic: "phone",
  "design-systems": "grid",
};
