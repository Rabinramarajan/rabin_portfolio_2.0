/**
 * Central media manifest.
 *
 * Every large production asset (project frames, case-study galleries, service
 * art, hero reels, portraits) lives in Vercel Blob under a single predictable
 * prefix. This file is the ONE place a media URL is written down: components
 * and content modules call `media("projects/galaxy-sofas/gallery-01.webp")`
 * and never hold a Blob URL of their own.
 *
 * The manifest doubles as the migration map — each key is the Blob pathname
 * (relative to `BLOB_ROOT`) and each value is the legacy `/public/media` path
 * the asset was uploaded from. `scripts/migrate-media-to-blob.mjs` reads it to
 * perform the upload, and `media()` falls back to the legacy path while
 * `NEXT_PUBLIC_BLOB_BASE_URL` is unset, so local development and the build
 * keep working before (and after) the upload runs.
 *
 * Small static assets — favicons, the manifest logos, inline SVG marks — stay
 * in /public on purpose. They are a few KB each and are requested from the
 * document itself; routing them through Blob would only add a DNS hop.
 *
 * REPLACING AN ASSET'S CONTENT: bump the key, do not just repoint the value.
 * Blob serves `cache-control: public, max-age=31536000` with no revalidation,
 * so a key is effectively immutable once anyone has fetched it — uploading new
 * bytes to the same pathname leaves every returning visitor on the old file for
 * up to a year. A new key is a new URL, which is the only thing that reliably
 * busts that cache. Hence the `-v6` hero keys below.
 */

/** Top-level Blob prefix. Everything this site owns lives under it. */
export const BLOB_ROOT = "portfolio";

/** Blob folders. Kept explicit so upload tooling cannot invent a new one. */
export const BLOB_FOLDERS = [
  "projects",
  "case-studies",
  "services",
  "hero",
  "profile",
  "other",
] as const;

export type BlobFolder = (typeof BLOB_FOLDERS)[number];

/**
 * Public read origin of the Blob store, e.g.
 * `https://xxxxxxxx.public.blob.vercel-storage.com`. Public by design: it is a
 * read-only CDN host, never the token. Unset → local `/media/*` is served.
 *
 * Only a *public* Blob host is accepted. A private store
 * (`*.private.blob.vercel-storage.com`) serves 403 to the browser and to the
 * next/image optimizer, so pointing this at one takes every image on the site
 * down. Rather than trust the value, an unusable origin is ignored and the
 * local files are served instead — a stale or mistyped env var degrades to the
 * previous behaviour rather than breaking the render.
 */
const PUBLIC_BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/;

function resolveBaseUrl(): string {
  const configured = (process.env.NEXT_PUBLIC_BLOB_BASE_URL ?? "").trim().replace(/\/+$/, "");
  if (!configured) return "";

  if (!PUBLIC_BLOB_HOST.test(configured)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[media] Ignoring NEXT_PUBLIC_BLOB_BASE_URL="${configured}": not a public Blob origin ` +
          "(https://<store>.public.blob.vercel-storage.com). Serving /public/media instead. " +
          "A private store cannot serve images to the browser — see docs/vercel-blob.md.",
      );
    }
    return "";
  }

  return configured;
}

const BLOB_BASE_URL = resolveBaseUrl();

/**
 * key   → Blob pathname under `${BLOB_ROOT}/`
 * value → the `/public/media` path it was migrated from (upload source and
 *         local fallback).
 */
export const MEDIA_MANIFEST = {
  // ---- hero -------------------------------------------------------------
  /* The reel is scroll-scrubbed: Hero.tsx writes scroll position straight onto
     video.currentTime, so every frame must be seekable without decoding from a
     keyframe. It is encoded all-intra (`-g 1 -keyint_min 1 -sc_threshold 0`)
     from media-src/hero/home-reel-master.mp4, which is why it is several times
     the size a normal 5s clip would be. Re-encoding it with default GOP
     settings costs nothing visually and silently turns the scrub to mush.

     Two other settings are deliberate. CRF 23: the master is itself only
     ~2 Mbps, so anything below ~21 spends bytes reproducing the source's own
     compression noise (SSIM vs the master barely moves from 23 to 18, while
     the file grows by half).

     And the reel is scaled UP to 1080p with lanczos plus a light `unsharp`,
     even though the master is 720p and no real detail is gained. The hero is
     full-bleed, so on a wide or display-scaled monitor (Windows at 125% turns
     a 1920 viewport into ~2400 device pixels) a 720p frame is upscaled ~2x by
     the browser at runtime. Doing that scale offline, with a better filter and
     sharpening applied before the resample, is visibly cleaner than leaving it
     to the browser — it is the difference between a soft face and a sharp one
     at monitor sizes. The poster srcset carries a matching 1920w cut for the
     same reason. */
  "hero/home-reel-v6.mp4": "/media/hero/banner_v2.scrub.mp4",
  "hero/home-poster-v6.webp": "/media/hero/banner2-poster.webp",
  /* Other cuts of the same frame. The poster is the LCP element on mobile,
     where the full-width file is ~4x the bytes the layout can use — and on a
     wide or display-scaled monitor, where 1280w would itself be upscaled. */
  "hero/home-poster-v6-640.webp": "/media/hero/banner2-poster-640.webp",
  "hero/home-poster-v6-960.webp": "/media/hero/banner2-poster-960.webp",
  "hero/home-poster-v6-1920.webp": "/media/hero/banner2-poster-1920.webp",

  // ---- profile ----------------------------------------------------------
  "profile/rabin-hero.webp": "/media/working/hero-portrait-640.webp",
  "profile/rabin-about.webp": "/media/about/about-portrait.webp",

  // ---- services ---------------------------------------------------------
  "services/frontend-engineering.webp": "/media/service/service_1.webp",
  "services/angular-development.webp": "/media/service/service_2.webp",
  "services/react-nextjs.webp": "/media/service/service_3.webp",
  "services/ui-engineering.webp": "/media/service/service_4.webp",
  "services/performance-optimization.webp": "/media/service/service_5.webp",
  "services/mobile-development.webp": "/media/service/service_6.webp",
  "services/design-systems.webp": "/media/service/service_7.webp",
  "services/angular-development.mp4": "/media/service/angular.mp4",
  "services/react-nextjs.mp4": "/media/service/react_application.mp4",
  "services/performance-optimization.mp4": "/media/service/performance.mp4",

  // ---- projects (keyed by case-study slug) ------------------------------
  "projects/fiji-immigration-internal/hero.png": "/media/fiji_internal_application/image3.png",
  "projects/fiji-immigration-external/hero.png": "/media/fiji_external_application/image1.png",
  "projects/prims-member-portal/hero.png": "/media/prims_member_portal/image3.png",
  "projects/vnpf-blo-mi/hero.png": "/media/vnpf_mobile/composite-thumb.png",
  "projects/insuremet/hero.png": "/media/insuremet/image2.png",
  "projects/galaxy-sofas/gallery-01.webp": "/media/galaxy-sofas/1.webp",
  "projects/galaxy-sofas/gallery-02.webp": "/media/galaxy-sofas/2.webp",
  "projects/galaxy-sofas/gallery-03.webp": "/media/galaxy-sofas/3.webp",
  "projects/galaxy-sofas/gallery-04.webp": "/media/galaxy-sofas/4.webp",
  "projects/galaxy-sofas/gallery-05.webp": "/media/galaxy-sofas/5.webp",
  "projects/galaxy-sofas/gallery-06.webp": "/media/galaxy-sofas/6.webp",
  "projects/galaxy-sofas/gallery-07.webp": "/media/galaxy-sofas/7.webp",

  // ---- other (page art that belongs to no single case study) ------------
  "other/process/hero.png": "/media/process/process_hero.png",
  "other/process/discover.png": "/media/process/discover.png",
  "other/process/define.png": "/media/process/Define.png",
  "other/process/design.png": "/media/process/Design.png",
  "other/process/engineer.png": "/media/process/Engineer.png",
  "other/process/validate.png": "/media/process/Validate.png",
  "other/process/launch.png": "/media/process/Launch.png",
  "other/process/evolve.png": "/media/process/Evolve.png",
  "other/contact/hero-loop.mp4": "/media/contact/hero.mp4",
  "other/contact/hero.png": "/media/contact/hero_b.png",
  "other/contact/conversation.png": "/media/contact/intelligent.png",
  "other/contact/globe.png": "/media/contact/contact_h.png",
  "other/experience/journey.png": "/media/experience/banner_img.png",
  "other/faq/orbit.png": "/media/faq/banner_h.png",
  "other/maintenance/cover.png": "/media/under-maintain/1.png",
  "other/chatbot/mark.png": "/media/chatbot/1.png",
  "other/footer/horizon.png": "/media/footer/2.png",
} as const satisfies Record<string, string>;

/** Every migrated asset, addressable by its Blob pathname. */
export type MediaKey = keyof typeof MEDIA_MANIFEST;

/**
 * Resolve a manifest key to the URL the browser should request: the Blob CDN
 * when `NEXT_PUBLIC_BLOB_BASE_URL` is configured, the legacy local path
 * otherwise.
 */
export function media(key: MediaKey): string {
  return BLOB_BASE_URL ? `${BLOB_BASE_URL}/${BLOB_ROOT}/${key}` : MEDIA_MANIFEST[key];
}

/** The full Blob pathname an asset is (or will be) stored at. */
export function blobPath(key: string): string {
  return `${BLOB_ROOT}/${key}`;
}
