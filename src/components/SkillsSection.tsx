"use client";

import { TechEcosystem } from "@/components/TechEcosystem";
import { type SectionHeadingLevel } from "@/components/ui";

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
        <TechEcosystem headingLevel={headingLevel} />
      </div>
    </section>
  );
}
