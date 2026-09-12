import type { MetadataRoute } from "next";
import { publishedInsights } from "@/content/insights";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/content/profile";

/** Canonical, indexable, public URLs only — no params, redirects or drafts. */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/work", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/angular-development", priority: 0.85, changeFrequency: "monthly" },
  { path: "/services/web-application-development", priority: 0.85, changeFrequency: "monthly" },
  { path: "/services/mobile-app-development", priority: 0.85, changeFrequency: "monthly" },
  { path: "/experience", priority: 0.8, changeFrequency: "monthly" },
  /* Both are indexable (neither sets a noindex robots directive) and both are
     linked from the primary nav, so omitting them here understated the site to
     crawlers rather than protecting anything. */
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/skills", priority: 0.7, changeFrequency: "monthly" },
  { path: "/process", priority: 0.6, changeFrequency: "yearly" },
  { path: "/pricing", priority: 0.6, changeFrequency: "yearly" },
  { path: "/insights", priority: 0.6, changeFrequency: "monthly" },
  { path: "/resume", priority: 0.6, changeFrequency: "monthly" },
  /* Low priority, but indexable and linked from the footer: their job is to be
     findable evidence that the site says how it handles data. */
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...ROUTES.map((r) => ({
      url: SITE_URL + r.path,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...projects.map((p) => ({
      url: SITE_URL + "/work/" + p.slug,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    // Only insights with a written body — a title-and-dek stub is thin content.
    ...publishedInsights().map((i) => ({
      url: SITE_URL + "/insights/" + i.id,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
