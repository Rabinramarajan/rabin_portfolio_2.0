import { PrintButton } from "@/components/PrintButton";
import { profile } from "@/content/profile";
import {
  resumeAchievements,
  resumeAdditional,
  resumeContact,
  resumeEducation,
  resumeExperience,
  resumeFileName,
  resumeLinks,
  resumeProjects,
  resumeSkillGroups,
  resumeSummary,
  resumeTitles,
} from "@/content/resume";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume",
  description:
    "Resume of Rabin R — Frontend Angular Consultant in Chennai, India, with roles, responsibilities, delivered projects and the full technology stack.",
  path: "/resume",
});

/** Uppercase, ruled section heading — the template's only structural divider. */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="doc__section" aria-labelledby={id}>
      <h2 className="doc__section-title" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <div className="resume-page">
      {/* Screen-only toolbar. Hidden in print so it never lands on the page. */}
      <div className="resume-page__bar">
        <div>
          <p className="mono faint">Resume</p>
          <p className="resume-page__hint">
            Choose <strong>Save as PDF</strong> as the destination to download.
          </p>
        </div>
        <PrintButton fileName={resumeFileName} label="Download / Print" />
      </div>

      {/* The document itself. What is on screen is exactly what prints. */}
      <article className="doc">
        <header className="doc__head">
          <h1 className="doc__name">{profile.name}</h1>
          <p className="doc__titles">{resumeTitles.join(" | ")}</p>
          <p className="doc__contact">
            {resumeContact.location}
            <span className="doc__sep">|</span>
            <a href={`tel:${resumeContact.phone.replace(/\s/g, "")}`}>
              {resumeContact.phone}
            </a>
            <span className="doc__sep">|</span>
            <a href={`mailto:${resumeContact.email}`}>{resumeContact.email}</a>
          </p>
          <p className="doc__contact">
            {resumeLinks.map((link, i) => (
              <span key={link.href}>
                {i > 0 && <span className="doc__sep">|</span>}
                <a href={link.href} rel="noreferrer">
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </header>

        <Section id="doc-summary" title="Professional Summary">
          <p className="doc__body">{resumeSummary}</p>
        </Section>

        <Section id="doc-skills" title="Core Skills">
          <dl className="doc__skills">
            {resumeSkillGroups.map((g) => (
              <div className="doc__skill-row" key={g.id}>
                <dt>{g.label}:</dt>
                <dd>{g.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="doc-experience" title="Professional Experience">
          {resumeExperience.map((r) => (
            <article className="doc__entry" key={r.id}>
              <h3 className="doc__entry-title">{r.role}</h3>
              <p className="doc__entry-meta">
                {r.employer}, {r.location} | {r.period}
              </p>
              <ul className="doc__bullets">
                {r.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </Section>

        <Section id="doc-projects" title="Projects">
          {resumeProjects.map((p) => (
            <article className="doc__entry" key={p.id}>
              <h3 className="doc__entry-title">{p.name}</h3>
              <p className="doc__entry-meta">{p.stack}</p>
              <p className="doc__body">{p.description}</p>
            </article>
          ))}
        </Section>

        <Section id="doc-achievements" title="Key Achievements">
          <ul className="doc__bullets">
            {resumeAchievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Section>

        <Section id="doc-education" title="Education &amp; Certification">
          {resumeEducation.map((e) => (
            <p className="doc__body doc__line" key={e.id}>
              <strong>{e.qualification}:</strong> {e.detail}
            </p>
          ))}
        </Section>

        <Section id="doc-additional" title="Additional Information">
          <p className="doc__body">
            {resumeAdditional.map((item, i) => (
              <span key={item.label}>
                {i > 0 && <span className="doc__sep">|</span>}
                {item.label}: {item.value}
              </span>
            ))}
          </p>
        </Section>
      </article>
    </div>
  );
}
