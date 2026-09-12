"use client";

import Link from "next/link";
import { TechEcosystem } from "@/components/TechEcosystem";
import { type SectionHeadingLevel } from "@/components/ui";

/**
 * The six that describe the specialism.
 *
 * The ecosystem below shows around thirty-five technologies, which reads as
 * capable and makes the specialism invisible: thirty-five logos compete with
 * each other and with the work. These six go first, and the full field stays
 * one scroll down for anyone who wants it.
 */
const PRIMARY_STACK = ["Angular", "TypeScript", "RxJS", "Signals", "Ionic", "Next.js"];

/**
 * Skills — the tech ecosystem.
 *
 * The statement / orbit / detail block that used to sit above the ecosystem
 * was removed; the section is now the ecosystem alone, kept in this wrapper so
 * the `#skills` anchor and the section aura stay put.
 */
export function SkillsSection({
  headingLevel = "h2",
}: { headingLevel?: SectionHeadingLevel; index?: string } = {}) {
  return (
    <section id="skills" className="section skd">
      <span className="skd__aura" aria-hidden />

      <div className="shell skd__shell">
        <div className="skd__primary">
          <p className="skd__primary-label">Primary stack</p>
          <ul className="skd__primary-list">
            {PRIMARY_STACK.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <Link className="skd__primary-link" href="/skills">
            View full technology stack →
          </Link>
        </div>

        <TechEcosystem headingLevel={headingLevel} />
      </div>
    </section>
  );
}
