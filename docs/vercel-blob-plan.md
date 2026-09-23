# Vercel Blob — end-to-end plan

A step-by-step plan for running production media through Vercel Blob, from an
empty store to a deployed site, plus the open fixes. The reference manual is
[vercel-blob.md](./vercel-blob.md); this file is the checklist.

---

## 0. Current state

The integration is already built. Nothing below needs new architecture.

| Piece | File | Status |
| --- | --- | --- |
| Media manifest + `media(key)` resolver | `src/lib/media.ts` | Done |
| Server-only upload helper `uploadMedia()` | `src/lib/blob-server.ts` | Done (see fix F4) |
| Authenticated upload endpoint | `src/app/api/blob/upload/route.ts` | Done |
| Migration script | `scripts/migrate-media-to-blob.mjs` | Done |
| `next/image` remote pattern + CSP | `next.config.ts` | Done |
| `listMedia()` / `deleteMedia()` helpers | `src/lib/blob-server.ts` | **Missing** (fix F1) |

### Data flow

```
/public/media/*  ──(npm run blob:migrate)──►  Blob store (public)
                                                   │
src/lib/media.ts   MEDIA_MANIFEST + media(key) ────┤  builds CDN URL
                                                   ▼
<SmartImage src={media("projects/x/hero.png")} />  → next/image → Blob CDN
                                                   ▲
POST /api/blob/upload (Bearer secret) → uploadMedia() → put()
```

---

## Phase 1 — Provision the store

- [ ] Install the Vercel CLI: `npm i -g vercel`
- [ ] Link the project: `vercel link`
- [ ] Dashboard → **Storage → Create → Blob** → access **Public** → connect to this project
  - Access is fixed at creation. A private store returns 403 to the browser and to
    `next/image`. If a private one exists, create a second, public store.
- [ ] Pull credentials: `vercel env pull .env.local` (writes `BLOB_READ_WRITE_TOKEN`)

**Done when:** `.env.local` contains `BLOB_READ_WRITE_TOKEN`.

---

## Phase 2 — Upload existing media

- [ ] Preview: `npm run blob:migrate:dry`
- [ ] Upload: `npm run blob:migrate`
- [ ] Copy the store origin printed by the script:
  `https://<store-id>.public.blob.vercel-storage.com`

**Done when:** the script ends with `uploaded=N skipped=0` (or skipped only for
objects that already exist).

---

## Phase 3 — Point the app at Blob

- [ ] Add to `.env.local`:
  ```
  NEXT_PUBLIC_BLOB_BASE_URL=https://<store-id>.public.blob.vercel-storage.com
  ```
- [ ] Add the same value in **Vercel → Settings → Environment Variables** for
  Production, Preview and Development. (Setting it only locally is not enough:
  the next `vercel env pull` overwrites `.env.local`.)
- [ ] Restart `npm run dev`
- [ ] Sanity check:
  ```bash
  curl -o /dev/null -w '%{http_code}\n' \
    "$NEXT_PUBLIC_BLOB_BASE_URL/portfolio/other/faq/orbit.png"   # expect 200
  ```
- [ ] In DevTools → Network, confirm images load from
  `*.public.blob.vercel-storage.com` (via `/_next/image`)

**Done when:** every page renders with no 403/404 on media.

---

## Phase 4 — Deploy

- [ ] Confirm on Vercel: `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_BLOB_BASE_URL`
- [ ] Optional: `BLOB_UPLOAD_SECRET` (`openssl rand -base64 32`), but only if the
  upload endpoint should be reachable. When it is unset, the endpoint is disabled.
- [ ] Redeploy. `NEXT_PUBLIC_*` values are baked in at build time.
- [ ] Spot-check the home page, one case study and one service page in production

**Done when:** production serves all media from the Blob CDN.

---

## Phase 5 — Clean up local media

- [ ] Only after Phase 4 is verified: `node scripts/migrate-media-to-blob.mjs --prune`
- [ ] Commit the removal of `/public/media` files (this shrinks the repo and the Docker image)

---

## Phase 6 — Open fixes

| ID | Fix | File | Effort |
| --- | --- | --- | --- |
| F1 | Add `listMedia(prefix?)` and `deleteMedia(pathname)` helpers (wrapping `list()` / `del()`), because the reference doc already describes them | `src/lib/blob-server.ts` | S |
| F2 | Fix the folder list in the doc: there are **seven** folders (`insights` is missing) | `docs/vercel-blob.md` §3, §6 | XS |
| F3 | In the doc, §2 says "Set both" but lists three variables. Reword it. | `docs/vercel-blob.md` §2 | XS |
| F4 | Pass `token: process.env.BLOB_READ_WRITE_TOKEN` to `put()` in `uploadMedia()`. `vercel env pull` also writes `VERCEL_OIDC_TOKEN`, and `@vercel/blob` prefers it. OIDC is rejected in development, so local uploads through the endpoint fail. | `src/lib/blob-server.ts` | XS |

Sketch for F1 and F4:

```ts
import { del, list, put, type ListBlobResult, type PutBlobResult } from "@vercel/blob";

const token = () => process.env.BLOB_READ_WRITE_TOKEN;

// in uploadMedia() → put(pathname, body, { token: token(), ... })

export async function listMedia(folder?: BlobFolder): Promise<ListBlobResult["blobs"]> {
  const prefix = folder ? `${blobPath(folder)}/` : `${BLOB_ROOT}/`;
  const blobs: ListBlobResult["blobs"] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 1000, token: token() });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

export async function deleteMedia(pathname: string): Promise<void> {
  if (!pathname.startsWith(`${BLOB_ROOT}/`)) throw new Error("Refusing to delete outside BLOB_ROOT");
  await del(pathname, { token: token() });
}
```

---

## Day-to-day workflows

### Add a new asset

1. Drop the file in `/public/media/...`
2. Add one line to `MEDIA_MANIFEST` in `src/lib/media.ts`:
   `"projects/my-app/hero.webp": "/media/my-app-hero.webp",`
3. `npm run blob:migrate`. It only uploads new keys.
4. Use it: `<SmartImage src={media("projects/my-app/hero.webp")} ... />`.
   Keys are type-checked, so a typo won't compile.

### Replace an asset

Use a **new key** (`hero-v2.webp`). Don't re-upload to the same key. Blob serves
`max-age=31536000`, so returning visitors would keep the old file for up to a year.

### Upload without the script

```bash
curl -X POST https://<site>/api/blob/upload \
  -H "Authorization: Bearer $BLOB_UPLOAD_SECRET" \
  -F file=@hero.webp -F folder=projects -F name=my-app/hero
# → 201 { "url": "...", "pathname": "portfolio/projects/my-app/hero-<suffix>.webp" }
```

Accepted: webp, avif, png, jpeg, mp4, up to 25 MB. Send `overwrite=true` to replace in place.

---

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Images load from `/media/...` instead of Blob | `NEXT_PUBLIC_BLOB_BASE_URL` unset or invalid (dev console shows a `[media] Ignoring…` warning) | Set it to the exact `https://<id>.public.blob.vercel-storage.com` origin and restart or redeploy |
| 403 on every image | Store is private | Create a public store and re-run the migration |
| `Cannot use public access on a private store` | Same as above | Same as above |
| Upload endpoint returns 401 | `BLOB_UPLOAD_SECRET` unset or bearer mismatch | Set the secret and send `Authorization: Bearer <secret>` |
| Upload endpoint returns 503 | `BLOB_READ_WRITE_TOKEN` missing | `vercel env pull .env.local` |
| Upload fails locally with an OIDC error | SDK picked `VERCEL_OIDC_TOKEN` | Apply fix F4 |
| Changed env var has no effect in prod | `NEXT_PUBLIC_*` is build-time | Redeploy |
| Old image still shows after re-upload | 1-year CDN/browser cache | Use a new key |
