import "server-only";

import { put, del, list, type PutBlobResult } from "@vercel/blob";

import { BLOB_FOLDERS, BLOB_ROOT, blobPath, type BlobFolder } from "@/lib/media";

/**
 * Server-only Vercel Blob helpers.
 *
 * `BLOB_READ_WRITE_TOKEN` is read by `@vercel/blob` from the server
 * environment — it is never imported into, or referenced from, client code.
 * The `server-only` import makes that a build error rather than a convention.
 */

/** What the upload endpoint accepts. Everything else is rejected outright. */
export const ALLOWED_MEDIA_TYPES = {
  "image/webp": "webp",
  "image/avif": "avif",
  "image/png": "png",
  "image/jpeg": "jpg",
  "video/mp4": "mp4",
} as const satisfies Record<string, string>;

export type AllowedMediaType = keyof typeof ALLOWED_MEDIA_TYPES;

/** 25 MB — comfortably above any frame the portfolio ships, below the cap. */
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export function isAllowedMediaType(type: string): type is AllowedMediaType {
  return type in ALLOWED_MEDIA_TYPES;
}

export function isBlobFolder(value: string): value is BlobFolder {
  return (BLOB_FOLDERS as readonly string[]).includes(value);
}

/**
 * Reduce an arbitrary caller-supplied name to a safe lowercase kebab-case
 * segment path. Traversal (`..`), absolute paths, backslashes, whitespace and
 * every non `[a-z0-9-/]` character are stripped, so no upload can escape its
 * folder or collide with the site's own structure.
 */
export function safeName(input: string, extension: string): string {
  const segments = input
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) =>
      segment
        .normalize("NFKD")
        .toLowerCase()
        .replace(/\.[a-z0-9]+$/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    )
    .filter((segment) => segment.length > 0 && segment !== "." && segment !== "..");

  const name = segments.join("/") || "asset";
  return `${name}.${extension}`;
}

export interface UploadMediaInput {
  folder: BlobFolder;
  /** Caller-supplied name; sanitised before use. May contain `/` sub-folders. */
  name: string;
  contentType: AllowedMediaType;
  body: ArrayBuffer | Buffer | Blob | ReadableStream;
  /**
   * Overwrite the existing object at this pathname instead of appending a
   * random suffix. Off by default so an accidental upload never replaces a
   * live asset.
   */
  overwrite?: boolean;
}

/**
 * Upload one asset into `portfolio/<folder>/<safe-name>` and return the Blob
 * result (its `url` is the public CDN URL).
 */
export async function uploadMedia({
  folder,
  name,
  contentType,
  body,
  overwrite = false,
}: UploadMediaInput): Promise<PutBlobResult> {
  const pathname = blobPath(`${folder}/${safeName(name, ALLOWED_MEDIA_TYPES[contentType])}`);

  return put(pathname, body, {
    access: "public",
    contentType,
    addRandomSuffix: !overwrite,
    allowOverwrite: overwrite,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  });
}

/** List everything stored under the site's prefix (or one folder of it). */
export function listMedia(folder?: BlobFolder) {
  return list({ prefix: folder ? `${BLOB_ROOT}/${folder}/` : `${BLOB_ROOT}/` });
}

/** Delete one or more assets by their public Blob URL. */
export function deleteMedia(urls: string | string[]) {
  return del(urls);
}
