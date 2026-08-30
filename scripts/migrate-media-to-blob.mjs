#!/usr/bin/env node
/**
 * One-shot migration: upload every asset listed in the media manifest from
 * /public/media to Vercel Blob, at the manifest's Blob pathname.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... node scripts/migrate-media-to-blob.mjs
 *   ... --dry-run     list what would be uploaded, upload nothing
 *   ... --force       overwrite objects that already exist
 *   ... --prune       delete the local /public/media source files afterwards
 *                     (only the files that uploaded successfully)
 *
 * The manifest is read straight out of src/lib/media.ts so the script and the
 * application can never drift apart.
 */
import { readFile, stat, unlink, readdir, rmdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { put, list } from "@vercel/blob";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry-run");
const FORCE = args.has("--force");
const PRUNE = args.has("--prune");

const CONTENT_TYPES = {
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
};

/** Parse `BLOB_ROOT` and `MEDIA_MANIFEST` out of src/lib/media.ts. */
async function readManifest() {
  const source = await readFile(path.join(ROOT, "src/lib/media.ts"), "utf8");
  const root = source.match(/export const BLOB_ROOT = "([^"]+)"/)?.[1];
  const block = source.match(/export const MEDIA_MANIFEST = \{([\s\S]*?)\n\} as const/)?.[1];
  if (!root || !block) throw new Error("Could not parse src/lib/media.ts");

  const entries = [...block.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map(([, key, local]) => ({
    key,
    local,
  }));
  return { root, entries };
}

async function main() {
  // Passed explicitly on every call. `vercel env pull` also writes a
  // VERCEL_OIDC_TOKEN, and @vercel/blob prefers OIDC over the read-write token
  // when it resolves credentials itself -- which fails outright, because OIDC
  // is not permitted for the "development" environment.
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token && !DRY) {
    console.error("BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env.local` first.");
    process.exit(1);
  }

  const { root, entries } = await readManifest();

  const existing = new Set();
  if (!DRY) {
    let cursor;
    do {
      const page = await list({ prefix: `${root}/`, cursor, limit: 1000, token });
      for (const blob of page.blobs) existing.add(blob.pathname);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
  }

  let uploaded = 0;
  let skipped = 0;
  const pruneable = [];

  for (const { key, local } of entries) {
    const pathname = `${root}/${key}`;
    const file = path.join(ROOT, "public", local.replace(/^\//, ""));

    let size;
    try {
      size = (await stat(file)).size;
    } catch {
      console.warn(`! missing source, skipped: ${local}`);
      skipped += 1;
      continue;
    }

    if (existing.has(pathname) && !FORCE) {
      console.log(`= exists   ${pathname}`);
      pruneable.push(file);
      skipped += 1;
      continue;
    }

    const contentType = CONTENT_TYPES[path.extname(file).toLowerCase()];
    if (!contentType) {
      console.warn(`! unsupported type, skipped: ${local}`);
      skipped += 1;
      continue;
    }

    if (DRY) {
      console.log(`~ would upload ${local} -> ${pathname} (${(size / 1024).toFixed(0)} KB)`);
      continue;
    }

    const blob = await put(pathname, createReadStream(file), {
      token,
      access: "public",
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
      multipart: size > 8 * 1024 * 1024,
    });

    console.log(`+ uploaded ${pathname}\n           ${blob.url}`);
    uploaded += 1;
    pruneable.push(file);
  }

  if (PRUNE && !DRY) {
    for (const file of pruneable) {
      await unlink(file).catch(() => {});
    }
    // Drop the directories left empty by the prune.
    const mediaRoot = path.join(ROOT, "public", "media");
    for (const dir of await readdir(mediaRoot).catch(() => [])) {
      const full = path.join(mediaRoot, dir);
      if ((await readdir(full).catch(() => ["keep"])).length === 0) await rmdir(full);
    }
    console.log(`- pruned ${pruneable.length} local file(s) from /public/media`);
  }

  console.log(`\nDone. uploaded=${uploaded} skipped=${skipped} total=${entries.length}`);
  if (uploaded > 0) {
    console.log(
      "\nSet NEXT_PUBLIC_BLOB_BASE_URL to the store origin above " +
        "(https://<id>.public.blob.vercel-storage.com) in .env.local and on Vercel.",
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
