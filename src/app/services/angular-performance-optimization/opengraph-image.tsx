import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Angular Performance Optimization — Rabin R";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    eyebrow: "Performance",
    title: "Angular Performance Optimization",
    subtitle: "Core Web Vitals, rendering, network and bundle work — measured, not guessed.",
    footer: "Rabin R · Angular Engineering",
  });
}
