import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Frontend Architecture — Rabin R";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    eyebrow: "Frontend Architecture",
    title: "Frontend Architecture",
    subtitle: "Component architecture, design systems and data flow built for the third release.",
    footer: "Rabin R · Angular Engineering",
  });
}
