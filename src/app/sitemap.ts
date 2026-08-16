import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/content/profile";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/services", "/work", "/experience", "/skills", "/process", "/pricing", "/insights", "/contact", "/resume"];
  return [
    ...routes.map((r) => ({ url: SITE_URL + r, lastModified: now })),
    ...projects.map((p) => ({ url: SITE_URL + "/work/" + p.slug, lastModified: now })),
    ...insights.map((i) => ({ url: SITE_URL + "/insights/" + i.id, lastModified: now })),
  ];
}
