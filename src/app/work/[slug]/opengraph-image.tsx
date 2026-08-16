import { ImageResponse } from "next/og";
import { getProject, projects } from "@/content/projects";
import { profile } from "@/content/profile";

export const alt = "Case study by Rabin R";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/** Per-case-study preview so every project link shares as its own card. */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

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
        <div style={{ display: "flex", fontSize: 26, color: "#f97316", letterSpacing: 2 }}>
          {(project?.category ?? "Case study").toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
            {project?.title ?? "Selected work"}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", lineHeight: 1.35 }}>
            {project?.tagline ?? ""}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a1a1aa" }}>
          <span>{project?.technologies.slice(0, 4).join("  ·  ") ?? "Angular · TypeScript"}</span>
          <span>{profile.name}</span>
        </div>
      </div>
    ),
    size,
  );
}
