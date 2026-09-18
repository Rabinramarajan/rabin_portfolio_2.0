/**
 * Generates the placeholder cover art for the insights listing.
 *
 * These stand in until an article carries a real `cover`. They are drawn
 * rather than photographed on purpose: stock imagery would say nothing true
 * about the argument in the piece, and a generated plate stays on the site's
 * palette (near-black ground, one lime accent) at any size.
 *
 * One motif per topic, so a row of four cards is distinguishable at a glance
 * without introducing a second colour. Run with:
 *
 *   node scripts/generate-insight-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "insights");

const W = 1600;
const H = 900;
const ACCENT = "#c9f24d";

/** Shared ground: the same near-black gradient every plate is drawn on. */
const ground = (id, x, y) => `
  <defs>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1b1b22"/>
      <stop offset="1" stop-color="#0d0d11"/>
    </linearGradient>
    <radialGradient id="l${id}" cx="${x}" cy="${y}" r="0.72">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g${id})"/>
  <rect width="${W}" height="${H}" fill="url(#l${id})"/>`;

const line = (extra = "") =>
  `fill="none" stroke="${ACCENT}" stroke-linecap="round" stroke-linejoin="round" ${extra}`;
const faint = (o) => `fill="none" stroke="#ffffff" stroke-opacity="${o}"`;

/* Each motif is the subject drawn literally enough to read at thumbnail size:
   stacked planes for architecture, a rising trace for performance, and so on. */
const motifs = {
  architecture: {
    light: ["0.72", "0.1"],
    art: `
      <g transform="translate(800 470)">
        <path d="M0-190 300-40 0 110-300-40Z" ${line('stroke-width="8" stroke-opacity="0.85"')}/>
        <path d="M-300 60 0 210 300 60" ${line('stroke-width="8" stroke-opacity="0.5"')}/>
        <path d="M-300 160 0 310 300 160" ${line('stroke-width="8" stroke-opacity="0.25"')}/>
      </g>`,
  },
  performance: {
    light: ["0.2", "0.86"],
    art: `
      <g transform="translate(280 640)">
        <path d="M0 0h240l90-300 150 520 110-320h370" ${line('stroke-width="10"')}/>
        <circle cx="580" cy="220" r="16" fill="${ACCENT}"/>
      </g>
      <path d="M180 700h1240" ${faint("0.1")} stroke-width="4"/>`,
  },
  design: {
    light: ["0.5", "1.05"],
    art: `
      <g transform="translate(800 450)">
        <circle r="185" ${line('stroke-width="8" stroke-opacity="0.85"')}/>
        <path d="M-185 0h370M0-185v370" ${faint("0.16")} stroke-width="4"/>
        <rect x="-185" y="-185" width="370" height="370" rx="24" ${faint("0.12")} stroke-width="4"/>
        <path d="M-185 0A185 185 0 0 1 185 0Z" fill="${ACCENT}" fill-opacity="0.14"/>
      </g>`,
  },
  accessibility: {
    light: ["0.08", "0.12"],
    art: `
      <g transform="translate(800 450)">
        <rect x="-250" y="-130" width="500" height="260" rx="130" ${faint("0.14")} stroke-width="4"/>
        <rect x="-282" y="-162" width="564" height="324" rx="162" ${line('stroke-width="8" stroke-dasharray="26 20"')}/>
        <circle cx="-120" r="34" fill="${ACCENT}" fill-opacity="0.9"/>
        <path d="M-40 0h250" ${faint("0.22")} stroke-width="10" stroke-linecap="round"/>
      </g>`,
  },
  mobile: {
    light: ["0.9", "0.88"],
    art: `
      <g transform="translate(800 450)">
        <rect x="-135" y="-235" width="270" height="470" rx="38" ${line('stroke-width="8"')}/>
        <path d="M-40-200h80" ${faint("0.3")} stroke-width="8" stroke-linecap="round"/>
        <path d="M-90-80h180M-90-20h180M-90 40h110" ${faint("0.16")} stroke-width="10" stroke-linecap="round"/>
        <path d="M-300 150c90-70 190-70 260 0" ${line('stroke-width="6" stroke-opacity="0.35" stroke-dasharray="14 16"')}/>
        <path d="M300 150c-90-70-190-70-260 0" ${line('stroke-width="6" stroke-opacity="0.35" stroke-dasharray="14 16"')}/>
      </g>`,
  },
  practice: {
    light: ["0.5", "-0.06"],
    art: `
      <g transform="translate(560 300)">
        <rect width="480" height="80" rx="20" ${line('stroke-width="6" stroke-opacity="0.8"')}/>
        <path d="M42 40l26 26 52-56" ${line('stroke-width="10"')}/>
        <rect y="115" width="480" height="80" rx="20" ${faint("0.14")} stroke-width="6"/>
        <path d="M42 155l26 26 52-56" ${line('stroke-width="10" stroke-opacity="0.55"')}/>
        <rect y="230" width="480" height="80" rx="20" ${faint("0.1")} stroke-width="6"/>
      </g>`,
  },
};

mkdirSync(OUT, { recursive: true });

for (const [name, { light, art }] of Object.entries(motifs)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="presentation">${ground(
    name,
    light[0],
    light[1],
  )}${art}</svg>`;
  const file = join(OUT, `topic-${name}.svg`);
  writeFileSync(file, svg.replace(/\n\s+/g, " ").trim() + "\n");
  console.log("wrote", file);
}
