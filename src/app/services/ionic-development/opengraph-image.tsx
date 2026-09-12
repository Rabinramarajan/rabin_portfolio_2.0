import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Ionic & Cross-platform Mobile — Rabin R";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OgImage() {
  return ogCard({
    eyebrow: "Mobile",
    title: "Ionic & Cross-platform Mobile",
    subtitle: "iOS and Android from one Angular + Ionic codebase.",
    footer: "Rabin R · Angular Engineering",
  });
}
