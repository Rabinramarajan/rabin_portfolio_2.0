import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = "Rabin R — Angular Developer & Frontend Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide social preview. Living at the app root means every route inherits
 * it unless the segment ships its own (see work/[slug]/opengraph-image).
 */
export default function OgImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a1a1aa" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#f97316",
              color: "#0a0a0b",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {profile.monogram}
          </div>
          <span>rabinr.in</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Angular Developer &amp;
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#f97316" }}>
            Frontend Software Engineer
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a1a1aa" }}>
          <span>{profile.name}</span>
          <span>
            {profile.locationShort} · {profile.yearsExperienceLabel} years
          </span>
        </div>
      </div>
    ),
    size,
  );
}
