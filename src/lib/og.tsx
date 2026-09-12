import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * The shared social card.
 *
 * Every shareable route — case study, article, service page — renders the
 * same three bands: an eyebrow saying what kind of page this is, the title,
 * and a footer carrying the discipline and the name. A link to this site
 * should be recognisable in a feed before the title is read, which one
 * default card for the whole domain cannot do.
 */
export function ogCard({
  eyebrow,
  title,
  subtitle,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          color: "#f5f5f4",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#c9f24d", letterSpacing: 2 }}>
          {eyebrow.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 62, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", lineHeight: 1.35 }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a1a1aa" }}>
          <span>{footer ?? "Angular Engineering"}</span>
          <span>{profile.name}</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
