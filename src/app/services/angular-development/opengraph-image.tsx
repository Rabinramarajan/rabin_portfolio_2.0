import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Angular Development — Rabin R";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    eyebrow: "Angular Engineering",
    title: "Angular Development",
    subtitle: "Enterprise Angular with signals, standalone APIs and architecture that survives real teams.",
    footer: "Rabin R · Angular Engineering",
  });
}
