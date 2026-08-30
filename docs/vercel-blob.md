# Vercel Blob — production media

All large production media (project frames, case-study galleries, service art,
hero reels, portraits) is served from **Vercel Blob**. Only small static assets
stay in `/public`: favicons, the PWA logos, and inline SVG marks.

---

## 1. Setup

1. In the Vercel dashboard → **Storage → Create → Blob**, create a store with
   **public** access and connect it to this project.

   > The store's access level is fixed at creation. A **private** store cannot
   > hold public blobs at all — `put()` fails with *"Cannot use public access on
   > a private store"*, and its `*.private.blob.vercel-storage.com` URLs return
   > 403 to both the browser and the `next/image` optimizer. Portfolio media is
   > public marketing art; it belongs in a public store. If you already made a
   > private one, create a second, public store rather than trying to convert
   > it.
2. Pull the credentials locally:

   ```bash
   vercel link          # once
   vercel env pull .env.local
   ```

   This writes `BLOB_READ_WRITE_TOKEN` into `.env.local` (git-ignored).
3. Note the store's public origin — `https://<store-id>.public.blob.vercel-storage.com`.
   It is printed by the migration script and shown on any blob in the dashboard.

## 2. Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `BLOB_READ_WRITE_TOKEN` | **Server only** | Write access. Used by the upload route and the migration script. Never imported into client code — `src/lib/blob-server.ts` is marked `server-only`, so any client import is a build error. |
| `BLOB_UPLOAD_SECRET` | **Server only** | Admin credential for `POST /api/blob/upload`. Unset → the route returns `401` for every request, which is the correct state until an upload client exists. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_BLOB_BASE_URL` | Public | Read origin of the store, and it **must** match `https://<store>.public.blob.vercel-storage.com`. Public by design: it is a read-only CDN host. When unset — or set to anything that is not a public Blob origin, such as a `.private.` host — `media()` ignores it and falls back to the legacy `/public/media` paths, so a bad value degrades instead of blanking every image. |

Set both in **Vercel → Settings → Environment Variables** for Production,
Preview and Development. `.env*` is git-ignored — never commit either value.

## 3. Folder convention

```
portfolio/
├── projects/       portfolio/projects/<project-slug>/hero.png | gallery-01.webp
├── case-studies/   portfolio/case-studies/<project-slug>/01.webp
├── services/       portfolio/services/<service-name>.webp | .mp4
├── hero/           portfolio/hero/home-reel.mp4 | home-poster.webp
├── profile/        portfolio/profile/rabin-hero.webp
└── other/          portfolio/other/<page>/<asset>.png
```

Filenames are lowercase kebab-case, extension-accurate. Project folders use the
case-study `slug` from `src/content/projects.ts`, so a frame is always findable
from its route.

## 4. Using an image in the app

Never write a Blob URL in a component. Add the asset to the manifest in
`src/lib/media.ts` and address it by key:

```ts
import { media } from "@/lib/media";

<SmartImage
  src={media("projects/galaxy-sofas/gallery-02.webp")}
  alt="Galaxy Sofas landing page"
  width={1905}
  height={941}
  sizes="(min-width: 1024px) 46vw, 92vw"
/>
```

`media()` is type-safe: only keys present in `MEDIA_MANIFEST` compile. It
returns the Blob CDN URL when `NEXT_PUBLIC_BLOB_BASE_URL` is set, and the
legacy local path otherwise.

`next.config.ts` allows `*.public.blob.vercel-storage.com` in
`images.remotePatterns`, so `next/image` optimization stays fully enabled for
Blob-hosted images (AVIF/WebP, per-width variants, year-long cache).

## 5. Migration process

`MEDIA_MANIFEST` in `src/lib/media.ts` *is* the migration map: each key is the
Blob pathname, each value is the `/public/media` file it came from.

```bash
npm run blob:migrate:dry     # list what would be uploaded
npm run blob:migrate         # upload everything in the manifest
node scripts/migrate-media-to-blob.mjs --force    # overwrite existing objects
node scripts/migrate-media-to-blob.mjs --prune    # delete the local sources after a successful upload
```

Then set `NEXT_PUBLIC_BLOB_BASE_URL` locally **and in the Vercel dashboard**,
restart `next dev`, and confirm every page renders from the CDN before pruning.
Fix it in the dashboard, not only in `.env.local` — the next `vercel env pull`
overwrites the local file with whatever Vercel holds.

Sanity-check one object before trusting the switch:

```bash
curl -o /dev/null -w '%{http_code}
'   "$NEXT_PUBLIC_BLOB_BASE_URL/portfolio/other/faq/orbit.png"   # expect 200
```

## 6. Uploading new media

`POST /api/blob/upload` (multipart/form-data). The route is a write endpoint
against a paid store, so it is authenticated and **fails closed** — without
`BLOB_UPLOAD_SECRET` set it answers `401` to everything:

```
Authorization: Bearer <BLOB_UPLOAD_SECRET>
```

The secret is compared in constant time. It is an admin credential: never ship
it to the browser. When an admin UI is added, authenticate the operator there
and call `uploadMedia()` from a server action rather than proxying this secret.


| Field | Required | Notes |
| --- | --- | --- |
| `file` | yes | webp, avif, png, jpeg or mp4; max 25 MB |
| `folder` | yes | one of the six folders above |
| `name` | no | desired name; sanitised server-side to lowercase kebab-case, traversal stripped |
| `overwrite` | no | `"true"` replaces the object instead of adding a random suffix |

Returns `201 { url, pathname }`. The write token never leaves the server: the
browser posts the file and receives only the public URL.

There is deliberately **no** admin UI — this route is the seam one would be
built on. Programmatic uploads can call `uploadMedia()` from
`src/lib/blob-server.ts` directly, alongside `listMedia()` and `deleteMedia()`.

## 7. Local development

- Without `NEXT_PUBLIC_BLOB_BASE_URL`: the app serves whatever remains under
  `/public/media`. No token needed.
- With it set: the app reads from the Blob CDN exactly as production does.
- The upload route returns `401` when `BLOB_UPLOAD_SECRET` is absent or the
  bearer token does not match, and `503` when `BLOB_READ_WRITE_TOKEN` is absent.

## 8. Production deployment

1. `BLOB_READ_WRITE_TOKEN` and `NEXT_PUBLIC_BLOB_BASE_URL` set on Vercel.
   Set `BLOB_UPLOAD_SECRET` too, but only if you intend the upload route to be
   reachable — leaving it unset keeps the endpoint disabled.
2. Blob store connected to the project.
3. Assets uploaded (`npm run blob:migrate`).
4. Deploy. `NEXT_PUBLIC_*` is inlined at build time — changing it requires a
   redeploy, not just an env update.
