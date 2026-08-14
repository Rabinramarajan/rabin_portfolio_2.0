import type { Metadata } from "next";
import { about } from "@/content/about";
import { experience, formatRoleDates } from "@/content/experience";
import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Resume", description: "Resume preview for Rabin R." };

export default function Page() {
  return (
    <section className="section">
      <div className="shell">
        <p className="mono faint">Resume</p>
        <h1 className="sec-title">{profile.name}</h1>
        <p>
          {profile.headlineRole} / {profile.location}
        </p>
        <p style={{ margin: "1rem 0" }}>
          <PrintButton />
        </p>
        <p className="muted">{about.paragraphs[0]}</p>
        {experience.map((r) => (
          <article key={r.id} style={{ marginTop: "1.5rem" }}>
            <p className="mono faint">{formatRoleDates(r)}</p>
            <h2>
              {r.role} — {r.company}
            </h2>
            <p className="muted">{r.description}</p>
          </article>
        ))}
        {skillGroups.map((g) => (
          <p key={g.id} style={{ marginTop: "0.75rem" }}>
            <b>{g.label}:</b> {g.items.join(", ")}
          </p>
        ))}
      </div>
    </section>
  );
}
