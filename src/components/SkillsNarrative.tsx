import Link from "next/link";
import { PageSectionHead } from "@/components/pages/PageSectionHead";

/**
 * Written context for /skills.
 *
 * The tech ecosystem visual lists what I use; it cannot say how deeply, or on
 * what. A flat list of forty technologies is the least trustworthy thing on a
 * portfolio, so this states the honest depth for each group and points at the
 * case study that evidences it.
 */

const GROUPS: { title: string; body: string; evidence?: { label: string; href: string } }[] = [
  {
    title: "Angular — primary, daily, four years",
    body:
      "This is where I am strongest and where most of my production work lives. Angular 17 through 22, standalone components, signals, zoneless change detection, SSR, RxJS for the genuinely asynchronous parts, and migrations from NgModule-based codebases. I have built and maintained Angular applications in government case management, pension, insurance and healthcare, including one serving more than ten thousand users.",
    evidence: { label: "Fiji Immigration internal system", href: "/work/fiji-immigration-internal" },
  },
  {
    title: "TypeScript — non-negotiable",
    body:
      "Every project, strict mode, types carried through to the API boundary rather than stopping at it. Most of the runtime errors I have had to debug in other people's codebases were preventable by a type that was never written, so this is not a preference so much as a cost-avoidance measure.",
  },
  {
    title: "Ionic, Capacitor — shipped to both stores",
    body:
      "Cross-platform iOS and Android from one Angular codebase, including biometric authentication, secure storage, offline behaviour, and the parts teams underestimate: signing, provisioning, store review and the update path. The VNPF member app in Vanuatu is the clearest example of this in production.",
    evidence: { label: "VNPF blo mi member app", href: "/work/vnpf-blo-mi" },
  },
  {
    title: "React and Next.js — secondary, production-real",
    body:
      "Used for product and marketing frontends where rendering strategy and content structure matter more than form-heavy application logic. App Router, server components, typed content models. This site is built with it. I would describe myself as strong here and expert in Angular, which is a distinction worth making rather than blurring.",
  },
  {
    title: "Node.js and data — enough to be useful, not a backend specialist",
    body:
      "I integrate with REST and GraphQL APIs daily and have built Node and Express services, worked against Sails.js backends, and used PostgreSQL, MySQL, MongoDB, Firebase and Supabase. I am comfortable reading and extending a backend and proposing API changes that remove frontend complexity. I would not present myself as the right person to architect your data layer from scratch.",
  },
  {
    title: "Accessibility and testing — part of the build, not a phase",
    body:
      "WCAG 2.1 AA as the working standard: semantic markup, keyboard operability, visible focus, screen reader behaviour. Playwright for the end-to-end flows that would cost real money if they broke, unit tests for logic with a right answer. I do not chase coverage percentages; the property I want is that a green build means the important paths still work.",
  },
  {
    title: "Design tools — implementation-level, not a designer",
    body:
      "I work fluently from Figma, Adobe XD and Sketch files and can design an interface where none exists, working from product requirements. I handle the engineering decisions designs leave unspecified — states, edge cases, responsive behaviour, motion. If you need brand or visual identity work, hire a designer.",
  },
];

export function SkillsNarrative() {
  return (
    <section className="section skills-narrative" aria-labelledby="skills-depth">
      <div className="shell" style={{ maxWidth: "46rem" }}>
        <PageSectionHead
          index="02"
          label="Depth"
          title="What I actually use, and how deeply"
        />
        <p className="skills-narrative__lede" id="skills-depth">
          A list of technologies says almost nothing on its own — everyone&rsquo;s list looks
          similar. This is the honest version: where I am genuinely expert, where I am
          competent, and where you should hire someone else.
        </p>

        <div className="skills-narrative__groups">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="skills-narrative__title">{group.title}</h3>
              <p className="skills-narrative__body">{group.body}</p>
              {group.evidence ? (
                <p className="skills-narrative__evidence">
                  Evidence: <Link href={group.evidence.href}>{group.evidence.label}</Link>
                </p>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
