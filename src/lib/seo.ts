import type { Metadata } from "next";
import { SITE_URL, defaultSeo, profile } from "@/content/profile";

/**
 * Single source of truth for per-route metadata.
 *
 * Next merges `openGraph` from the parent layout, so a page that sets only
 * `title`/`description` silently inherits the *homepage* OG title and
 * description — every route would share one social preview. Building the
 * canonical + OG + Twitter triple from one call keeps them in sync and unique.
 */

export const TITLE_SUFFIX = "Rabin R";

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return SITE_URL + "/";
  return SITE_URL + (path.startsWith("/") ? path : "/" + path);
}

export interface PageSeoInput {
  /** Page-scoped title — the layout template appends " | Rabin R". */
  title: string;
  description: string;
  /** Route path, e.g. "/work" or "/work/prims-member-portal". */
  path: string;
  /** Use "article" for case studies and insight posts. */
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  /**
   * Set false when the route segment ships its own `opengraph-image` file —
   * that convention already injects the tags and must not be doubled up.
   */
  inheritOgImage?: boolean;
}

export const OG_IMAGE_ALT = "Rabin R — Angular Developer & Frontend Software Engineer";

const DEFAULT_OG_IMAGE = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: OG_IMAGE_ALT,
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  keywords,
  publishedTime,
  inheritOgImage = true,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = path === "/" ? defaultSeo.title : `${title} | ${TITLE_SUFFIX}`;

  return {
    // The layout template appends " | Rabin R"; the homepage title is already
    // complete, so it opts out of the template with `absolute`.
    title: path === "/" ? { absolute: fullTitle } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: profile.name,
      locale: "en_IN",
      title: fullTitle,
      description,
      ...(inheritOgImage ? { images: [DEFAULT_OG_IMAGE] } : {}),
      ...(type === "article"
        ? { authors: [profile.name], ...(publishedTime ? { publishedTime } : {}) }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(inheritOgImage ? { images: [DEFAULT_OG_IMAGE.url] } : {}),
    },
  };
}
