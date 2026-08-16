import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/content/profile";

/** Canonical, indexable, public URLs only — no params, redirects or drafts. */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/work", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/experience", priority: 0.8, changeFrequency: "monthly" },
  { path: "/skills", priority: 0.7, changeFrequency: "monthly" },
  { path: "/process", priority: 0.6, changeFrequency: "yearly" },
  { path: "/pricing", priority: 0.6, changeFrequency: "yearly" },
  { path: "/insights", priority: 0.6, changeFrequency: "monthly" },
  { path: "/resume", priority: 0.6, changeFrequency: "monthly" },
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
    ...insights.map((i) => ({
      url: SITE_URL + "/insights/" + i.id,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
