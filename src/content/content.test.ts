import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";

import { projects } from "@/content/projects";
import { faqs } from "@/content/faq";
import { processSteps } from "@/content/process";
import { engagementModels } from "@/content/engagement-models";
import { pricingPlans } from "@/content/pricing";
import { insights } from "@/content/insights";
import { about } from "@/content/about";
import { navigation, profile } from "@/content/profile";
import { ORDER, sections, sectionIndex } from "@/content/sections";

/**
 * Content invariants.
 *
 * These run in CI rather than at runtime on purpose: a duplicate slug or a
 * missing image should fail the build, not degrade a page for a visitor. The
 * cost of a runtime guard is paid on every request; the cost of this is paid
 * once, by whoever broke it.
 */

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) dupes.add(value);
    seen.add(value);
  }
  return [...dupes];
}

describe("identifiers are unique", () => {
  it.each([
    ["project slugs", projects.map((p) => p.slug)],
    ["project numbers", projects.map((p) => p.number)],
    ["faq ids", faqs.map((f) => f.id)],
    ["process step ids", processSteps.map((s) => s.id)],
    ["engagement model ids", engagementModels.map((m) => m.id)],
    ["pricing plan ids", pricingPlans.map((p) => p.id)],
    ["insight ids", insights.map((i) => i.id)],
    ["social ids", profile.socials.map((s) => s.id)],
    ["section ids", [...ORDER]],
  ])("%s", (_label, values) => {
    expect(duplicates(values as string[])).toEqual([]);
  });
});

describe("projects", () => {
  it("every project has the fields the case-study route reads", () => {
    for (const project of projects) {
      expect(project.slug, `${project.title} slug`).toMatch(/^[a-z0-9-]+$/);
      expect(project.title.trim().length, `${project.slug} title`).toBeGreaterThan(0);
      expect(project.category.trim().length, `${project.slug} category`).toBeGreaterThan(0);
      expect(project.technologies.length, `${project.slug} technologies`).toBeGreaterThan(0);
      expect(project.seo?.title, `${project.slug} seo.title`).toBeTruthy();
      expect(project.seo?.description, `${project.slug} seo.description`).toBeTruthy();
    }
  });

  it("every referenced image exists in /public and has alt text", () => {
    // `cover` is optional — a case study with no screenshot renders a poster.
    const media = projects.flatMap((p) => [...(p.cover ? [p.cover] : []), ...(p.gallery ?? [])]);
    for (const image of media) {
      expect(image.alt.trim().length, `alt for ${image.src}`).toBeGreaterThan(0);
      expect(
        existsSync(path.join(PUBLIC_DIR, image.src)),
        `missing asset: public${image.src}`,
      ).toBe(true);
    }
  });
});

describe("section registry", () => {
  it("numbers sections from their position in ORDER", () => {
    expect(sectionIndex("about")).toBe("01");
    expect(sectionIndex(ORDER[ORDER.length - 1])).toBe(String(ORDER.length).padStart(2, "0"));
  });

  it("gives every section a label", () => {
    for (const id of ORDER) {
      expect(sections[id].label.trim().length, `${id} label`).toBeGreaterThan(0);
    }
  });
});

describe("cross-references", () => {
  it("pricing plans only use models declared in engagement-models", () => {
    const known = new Set(engagementModels.map((m) => m.id));
    for (const plan of pricingPlans) {
      expect(known.has(plan.model), `plan ${plan.id} model "${plan.model}"`).toBe(true);
    }
  });

  it("every engagement model has at least one pricing plan", () => {
    for (const model of engagementModels) {
      expect(
        pricingPlans.some((p) => p.model === model.id),
        `no pricing plan for model "${model.id}"`,
      ).toBe(true);
    }
  });

  it("about metrics carry an icon the stats bar can render", () => {
    for (const metric of about.metrics) {
      expect(metric.icon, `metric "${metric.label}"`).toBeTruthy();
    }
  });

  it("internal navigation targets a real route or anchor", () => {
    for (const item of navigation) {
      expect(item.href, `nav "${item.label}"`).toMatch(/^\/(#[a-z-]+|[a-z-]+(\/.*)?)?$/);
    }
  });

  it("social links are absolute or mailto", () => {
    for (const social of profile.socials) {
      expect(social.href, `social "${social.id}"`).toMatch(/^(https?:\/\/|mailto:)/);
    }
  });
});
