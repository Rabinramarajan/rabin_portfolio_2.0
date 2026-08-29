import { Monogram } from "@/components/Logo";

/**
 * The orbital field behind the work hero.
 *
 * Concentric hairline rings with a handful of nodes riding them, the brand
 * mark at the centre. It is decoration only — no information lives here that
 * is not already in the headline beside it — so the whole thing is hidden
 * from assistive technology and drawn in a single SVG with no images to
 * download beyond the mark itself.
 */

/** Ring radii, as a fraction of the 200-unit viewBox half-width. */
const RINGS = [38, 60, 80, 96];

/** [ring index, angle in degrees, dot radius] — hand-placed, not random, so
    the field reads as composed rather than scattered. */
const NODES: [number, number, number][] = [
  [0, -52, 1.6],
  [0, 142, 1.2],
  [1, 18, 2],
  [1, 172, 1.4],
  [1, -100, 1.2],
  [2, -20, 1.8],
  [2, 88, 2],
  [2, -142, 1.3],
  [3, 42, 1.6],
  [3, -70, 1.2],
  [3, 158, 1.4],
];

/** The fine dust between the rings — smaller and dimmer than the nodes, and
    placed off-ring so the field does not read as four tidy necklaces. */
const DUST: [number, number][] = [
  [30, 70], [52, -24], [72, 132], [88, -58], [46, -160],
  [64, 58], [92, 20], [34, -118], [78, -96], [58, 158],
];

const point = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: 100 + r * Math.cos(rad), y: 100 + r * Math.sin(rad) };
};

export function WorkOrbit() {
  return (
    <div className="worbit" aria-hidden>
      <svg className="worbit__svg" viewBox="0 0 200 200" fill="none">
        <defs>
          <radialGradient id="worbit-haze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.16" />
            <stop offset="55%" stopColor="var(--color-accent)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="96" fill="url(#worbit-haze)" />

        {RINGS.map((r, i) => (
          <circle
            key={r}
            className="worbit__ring"
            cx="100"
            cy="100"
            r={r}
            strokeDasharray={i === 1 || i === 3 ? "1.2 5" : undefined}
            style={{ opacity: 0.42 - i * 0.08 }}
          />
        ))}

        {/* Two chords across the field: the "network" read, at a hairline. */}
        <path className="worbit__chord" d="M28 74 L172 126" />
        <path className="worbit__chord" d="M52 168 L148 32" />

        {DUST.map(([r, deg], i) => {
          const { x, y } = point(r, deg);
          return <circle key={`d${i}`} className="worbit__dust" cx={x} cy={y} r={0.7} />;
        })}

        {NODES.map(([ring, deg, size], i) => {
          const { x, y } = point(RINGS[ring], deg);
          return <circle key={i} className="worbit__node" cx={x} cy={y} r={size} />;
        })}
      </svg>

      <span className="worbit__mark">
        <Monogram />
      </span>
    </div>
  );
}
