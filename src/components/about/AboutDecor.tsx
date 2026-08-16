/**
 * Ornamental accents for the About section: a dotted wave field behind the
 * pull quote and flowing contour lines inside the closing CTA band.
 *
 * Geometry is computed once at module scope so server and client emit byte
 * identical markup (no hydration mismatch), and both graphics are purely
 * decorative — hidden from assistive technology.
 */

const WAVE = { w: 320, h: 110 };

/** Dot field banded around a sine crest, fading toward the outer rows. */
const waveDots = (() => {
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  for (let x = 0; x <= WAVE.w; x += 6) {
    const phase = (x / WAVE.w) * Math.PI * 2.2;
    const crest = WAVE.h / 2 + Math.sin(phase) * 26;
    for (let band = -3; band <= 3; band++) {
      const y = crest + band * 7 + Math.cos(phase) * band * 2.5;
      if (y < 4 || y > WAVE.h - 4) continue;
      const falloff = 1 - Math.abs(band) / 4;
      dots.push({
        x,
        y: +y.toFixed(2),
        r: +(0.9 + falloff * 0.7).toFixed(2),
        o: +(0.12 + falloff * 0.5).toFixed(2),
      });
    }
  }
  return dots;
})();

export function DottedWave() {
  return (
    <svg
      className="about-quote__wave"
      viewBox={`0 0 ${WAVE.w} ${WAVE.h}`}
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      {waveDots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.o} />
      ))}
    </svg>
  );
}

const ORBIT = { w: 300, h: 375 };

/**
 * Concentric arcs sweeping behind the portrait, each carrying a single node.
 * Radii and angles are fixed constants so the markup is deterministic.
 */
const orbits = [
  { r: 96, from: -58, to: 26, at: -14 },
  { r: 132, from: -74, to: 40, at: 22 },
  { r: 170, from: -86, to: 52, at: -62 },
].map(({ r, from, to, at }, i) => {
  const point = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${(ORBIT.w / 2 + Math.cos(rad) * r).toFixed(2)} ${(ORBIT.h / 2 + Math.sin(rad) * r).toFixed(2)}`;
  };
  const node = point(at).split(" ");
  return {
    d: `M${point(from)}A${r} ${r} 0 0 1 ${point(to)}`,
    cx: +node[0],
    cy: +node[1],
    o: +(0.5 - i * 0.11).toFixed(2),
  };
});

export function PortraitOrbits() {
  return (
    <svg
      className="about-card__orbits"
      viewBox={`0 0 ${ORBIT.w} ${ORBIT.h}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {orbits.map((o, i) => (
        <g key={i} opacity={o.o}>
          <path d={o.d} stroke="currentColor" strokeWidth="0.8" />
          <circle cx={o.cx} cy={o.cy} r="2.2" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

const FLOW = { w: 480, h: 120 };

/** Stacked sine contours, amplitude ramping left→right so they never cross. */
const flowPaths = Array.from({ length: 9 }, (_, line) => {
  const amp = 12 + line * 1.6;
  const base = FLOW.h / 2 + (line - 4) * 5.5;
  const shift = line * 0.16;
  let d = "";
  for (let x = 0; x <= FLOW.w; x += 12) {
    const y = base + Math.sin((x / FLOW.w) * Math.PI * 3 + shift) * amp * (x / FLOW.w);
    d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`;
  }
  return { d, o: +(0.14 + line * 0.045).toFixed(2) };
});

export function FlowLines() {
  return (
    <svg
      className="about-cta__flow"
      viewBox={`0 0 ${FLOW.w} ${FLOW.h}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      aria-hidden
      focusable="false"
    >
      {flowPaths.map((p, i) => (
        <path key={i} d={p.d} opacity={p.o} />
      ))}
    </svg>
  );
}
