import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/content/profile";

export const alt = "Rabin R — Angular Developer & Frontend Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide social preview. Living at the app root means every route inherits
 * it unless the segment ships its own (see work/[slug]/opengraph-image).
 */
export default async function OgImage() {
  /* Inlined as a data URI: next/og has no origin to resolve /logo-mark.png
     against during static generation. */
  const mark = await readFile(join(process.cwd(), "public", "logo-mark.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} alt="" width={64} height={64} />
          <span>rabinr.in</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Angular Developer &amp;
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#c9f24d" }}>
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
