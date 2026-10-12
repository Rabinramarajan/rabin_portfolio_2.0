import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_URL, defaultSeo, profile } from '../../data/profile';

export interface PageSeo {
  /** Page-scoped title; " | Rabin R" is appended except on the home page. */
  title: string;
  description: string;
  /** Route path, e.g. "/work/prims-member-portal". */
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  /** Absolute or root-relative image for social previews. */
  image?: string;
  /** Hide pages that should not be indexed (404, unpublished drafts). */
  noindex?: boolean;
  /** Schema.org JSON-LD for this page, built from visible content only. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const TITLE_SUFFIX = 'Rabin R';
/** Search results truncate titles around 60 characters and descriptions around 160. */
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;
const DEFAULT_OG_IMAGE = '/brand/og-image.png';
const JSON_LD_ID = 'page-jsonld';

/** "Title | Rabin R", or just the title when the suffix would push it past the limit. */
export function pageTitle(title: string): string {
  const withBrand = `${title} | ${TITLE_SUFFIX}`;
  return withBrand.length <= MAX_TITLE || title.includes(TITLE_SUFFIX) ? withBrand : title;
}

/** Trims meta descriptions at a word boundary; the visible page copy is never changed. */
export function metaDescription(text: string): string {
  if (text.length <= MAX_DESCRIPTION) return text;
  const cut = text.slice(0, MAX_DESCRIPTION - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '') + '…';
}

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL + '/';
  if (/^https?:\/\//.test(path)) return path;
  return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}

/**
 * Single place that writes per-route metadata: title, description, canonical,
 * Open Graph, Twitter card and JSON-LD. It runs during prerender, so every
 * static HTML file ships with its own tags rather than the home page's.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(seo: PageSeo): void {
    const url = absoluteUrl(seo.path);
    const fullTitle = seo.path === '/' ? defaultSeo.title : pageTitle(seo.title);
    const description = metaDescription(seo.description);
    const image = absoluteUrl(seo.image ?? DEFAULT_OG_IMAGE);
    const type = seo.type ?? 'website';

    this.title.setTitle(fullTitle);
    this.setName('description', description);
    this.setName('robots', seo.noindex ? 'noindex, follow' : 'index, follow');

    this.setProperty('og:type', type);
    this.setProperty('og:url', url);
    this.setProperty('og:site_name', profile.name);
    this.setProperty('og:locale', 'en_IN');
    this.setProperty('og:title', fullTitle);
    this.setProperty('og:description', description);
    this.setProperty('og:image', image);
    this.setProperty('og:image:alt', `${profile.name} — ${profile.role}`);
    this.setOptionalProperty('article:published_time', type === 'article' ? seo.publishedTime : undefined);
    this.setOptionalProperty('article:modified_time', type === 'article' ? seo.modifiedTime : undefined);

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', fullTitle);
    this.setName('twitter:description', description);
    this.setName('twitter:image', image);

    this.setCanonical(url);
    this.setJsonLd(seo.jsonLd);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setOptionalProperty(property: string, content: string | undefined): void {
    if (content) this.setProperty(property, content);
    else this.meta.removeTag(`property="${property}"`);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  private setJsonLd(data: PageSeo['jsonLd']): void {
    this.document.getElementById(JSON_LD_ID)?.remove();
    if (!data) return;

    const script = this.document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    // Escape "<" so content can never close the script element early
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    this.document.head.appendChild(script);
  }
}
