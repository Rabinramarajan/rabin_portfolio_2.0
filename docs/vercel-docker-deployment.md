# Vercel Docker deployment

How this portfolio is built and served: `Dockerfile.vercel` → OCI image → Vercel
Container Registry → Vercel Function on Fluid Compute.

Written 2026-09-09, for release **v1.0.3**. Companion to
[deploy/README.md](../deploy/README.md), which covers the separate
Kubernetes/ArgoCD path.

---

## 1. Architecture

```
vercel deploy
   └─ Vercel reads vercel.json  ──►  services.rabin_portfolio_prod.entrypoint
        └─ buildah builds Dockerfile.vercel (linux/amd64)
             └─ pushes to vcr.vercel.com/rabin-projects/rabin-portfolio-2-0/rabin_portfolio_prod
                  └─ Vercel Function (Fluid Compute) runs the image, pinned by digest
                       └─ rewrites: /(.*) → service
```

Inside the image:

```
builder (node:24-alpine)   npm ci → next build → .next/standalone
runner  (node:24-alpine)   node server.js, USER node, PORT 80
```

### Why `vercel.json` is required

Vercel's automatic `Dockerfile.vercel` detection **does not fire on this
project**. The Next.js framework preset wins, and the platform runs its own
`next build` instead of building the image. `Dockerfile.vercel` sat in the repo
unused for days before this was found.

Declaring the service with an explicit `entrypoint` is what switches the build
over. Confirm from the build log which path ran:

| Build log line | Meaning |
| --- | --- |
| `Build Completed in /vercel/output [37s]` | ❌ framework preset — image not used |
| `Building image vcr.vercel.com/… (buildah)` | ✅ container build |

### The service key is the registry repository name

The key under `services` becomes the VCR repository name. It is deliberately
`rabin_portfolio_prod` — the repository that already holds `v1.0.1` and
`v1.0.2`. Renaming that key silently creates a **second** repository rather
than reusing the existing one. (This happened once during setup with a key of
`web`, which created a stray `web` repository.)

---

## 2. Files changed

| File | Change |
| --- | --- |
| [Dockerfile.vercel](../Dockerfile.vercel) | `node:22-alpine` → `node:24-alpine`; `PORT` 3000 → **80**; `setcap` so non-root can bind 80; architecture notes |
| [vercel.json](../vercel.json) | **New.** Declares the container service and the catch-all rewrite |
| [.dockerignore](../.dockerignore) | Added `deploy`, `e2e`, `docs`, `media-src`, `.vercel`, `tsconfig.tsbuildinfo`, `playwright.config.ts`, `vitest.config.mts` |
| [next.config.ts](../next.config.ts) | Comments only — the `output: "standalone"` logic was already correct |
| [publish/config.json](../publish/config.json) | `prod.version` 1.0.2 → 1.0.3 |
| [package.json](../package.json) | `version` 1.0.2 → 1.0.3 |
| [src/generated/version.json](../src/generated/version.json) | 1.0.3 release record |

---

## 3. Configuration

### `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "rabin_portfolio_prod": {
      "root": ".",
      "entrypoint": "Dockerfile.vercel"
    }
  },
  "rewrites": [{ "source": "/(.*)", "destination": { "service": "rabin_portfolio_prod" } }]
}
```

`vercel.json` is strict — a `"//"` comment key is rejected with
`should NOT have additional property`. Rationale lives in the
`Dockerfile.vercel` header instead.

### Port binding

Vercel routes container traffic to **port 80** unless a `PORT` environment
variable is set in project settings. The image defaults to 80 so it satisfies
that contract on its own, with no out-of-band project setting to keep in sync.

Port 80 is privileged and the container must not run as root, so the runner
grants the Node binary `CAP_NET_BIND_SERVICE`:

```dockerfile
RUN apk add --no-cache libcap \
    && setcap 'cap_net_bind_service=+ep' /usr/local/bin/node \
    && apk del libcap
USER node
```

**Trade-off:** `setcap` rewrites the ~110 MB Node binary, adding a 131 MB
layer. The alternative — a high port plus a `PORT` project setting — is smaller
but fails hard if that setting is ever removed. Correctness-by-default was
chosen.

### Build-time environment variables

Vercel translates project environment variables into Docker **build arguments**
during the image build, and exposes them as ordinary environment variables at
run time.

`NEXT_PUBLIC_*` values are inlined into the client bundle by the compiler, so
they must exist at build time — setting them only at run time ships a bundle
that ignores them. They are declared as `ARG` in `Dockerfile.vercel`:

```
NEXT_PUBLIC_BLOB_BASE_URL   NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_GTM_ID          NEXT_PUBLIC_COOKIESCRIPT_ID
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
NEXT_PUBLIC_BING_SITE_VERIFICATION
```

**No server-side secret is ever an `ARG`.** SMTP passwords, Blob tokens and AI
keys are read from the runtime environment by server code only, and are never
baked into the image.

### Standalone output

`next.config.ts` sets:

```ts
output: process.env.DOCKER_BUILD ? "standalone" : process.env.VERCEL ? undefined : "standalone",
```

`Dockerfile.vercel` sets `DOCKER_BUILD=1`. This is load-bearing: Vercel sets
`VERCEL=1` inside its own container build, so without the flag the build would
take the `undefined` branch, never emit `.next/standalone`, and fail the
runner's `COPY`. A guard step fails loudly rather than with a bare `ENOENT`:

```dockerfile
RUN test -f .next/standalone/server.js || (echo "ERROR: …" && exit 1)
```

### Graceful shutdown

Vercel sends `SIGTERM` with a **30-second** grace period on scale-in. Next's
standalone server registers its own `SIGINT`/`SIGTERM` handlers
(`next/dist/server/lib/start-server.js`), so `node server.js` runs directly as
PID 1 with no init shim.

**Do not set `NEXT_MANUAL_SIG_HANDLE`** — it disables those handlers.

Measured: `docker stop` → exit code **143** (128+15) in **495 ms**.

---

## 4. Commands

```bash
# Local gate
npm install
npm run lint          # 0 errors, 2 pre-existing <img> warnings
npm run typecheck
npm test              # 141 tests / 9 files
npm run build

# Container
docker build -f Dockerfile.vercel -t rabin-portfolio:test .
docker run -d --name rabin-test -p 8080:80 rabin-portfolio:test
docker logs rabin-test
docker stop -t 30 rabin-test

# Deploy
vercel deploy --yes            # preview
vercel deploy --prod --yes     # production

# Inspect
vercel ls
vercel inspect --logs <deployment-url>
vercel logs <deployment-url>
vercel vcr ls
vercel vcr tag ls rabin_portfolio_prod
```

---

## 5. Release v1.0.3

| | |
| --- | --- |
| Production deployment | `https://rabin-portfolio-2-0-q9g4gh04x-rabin-projects.vercel.app` |
| Production URL | https://www.rabinr.in |
| Image | `vcr.vercel.com/rabin-projects/rabin-portfolio-2-0/rabin_portfolio_prod:08d1304afbea` |
| Digest (short) | `a8b08cbca8e2` |
| Architecture | `linux/amd64` |
| Size | 162.5 MB compressed · 592 MB local uncompressed |
| Vercel build time | ~115 s |

`v1.0.1` and `v1.0.2` remain in the repository, untouched.

### Versioning model

Vercel tags each image with the **git commit SHA** (`08d1304afbea` =
commit `08d1304`). Nothing depends on a mutable `:latest`.

⚠️ **The tag is not a unique release identifier.** Two builds from the same
commit produce the same tag, and the second overwrites the first. That happened
here: the preview pushed digest `cbd656f882ca`, then the production build
overwrote the tag with `a8b08cbca8e2`. Deployments pin by **digest**, so this is
safe — but the tag alone should not be trusted. Production's tag reads
`08d1304` while its content corresponds to commit `fa53bef`.

The `v1.0.x` semver tags are a **separate series** pushed by
`npm run publish prod` for the ArgoCD/K8s path. They are not used by Vercel.

---

## 6. Verification

All checks below were run against the live production deployment.

### Routes — 24/24 `200`

`/` `/about` `/work` `/work/[slug]` `/services` + 3 service pages `/experience`
`/skills` `/process` `/pricing` `/insights` `/insights/[slug]` `/contact`
`/resume` `/version` `/robots.txt` `/sitemap.xml` `/manifest.webmanifest`
`/api/health` `/opengraph-image` `/llms.txt` `/icon.png`

### Behaviour

| Check | Result |
| --- | --- |
| Health | `{"status":"ok","version":"1.0.3"}` |
| Apex → www | `308` → `https://www.rabinr.in/` |
| HTTP → HTTPS | `308` |
| Legacy redirects | `/projects`, `/case-studies`, `/case-studies/:slug` → `308` |
| Image optimizer | `200 image/avif` — `sharp` works on musl/Node 24 |
| Fonts | `200 font/woff2` |
| Video range request | `206 Partial Content` |
| Unknown path | `404` |
| `POST /api/contact` (invalid) | `400` with field errors |
| `POST /api/chat` | `400` |
| `POST /api/blob/upload` | `401` |
| Runtime logs | clean — no errors, warnings or 500s |

### Security headers

`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` ·
`X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` ·
`Referrer-Policy: strict-origin-when-cross-origin` ·
`Permissions-Policy: camera=(), microphone=(), geolocation=()`

### SEO

- `<title>` and meta description present
- `<link rel="canonical" href="https://www.rabinr.in">`
- `og:title`, `og:url`, `og:image`, `twitter:card=summary_large_image`
- 4 JSON-LD blocks
- `sitemap.xml` — 23 URLs, all canonical `https://www.rabinr.in`
- `robots.txt` — `Allow: /`, `Disallow: /api/`, correct `Host` and `Sitemap`

### Performance

| Condition | TTFB |
| --- | --- |
| Cold start (after 5.5 min idle, `uptime: 1.39s`) | **263 ms** |
| Warm | 121–174 ms |

Fluid Compute scales to zero after 5 minutes idle in production, 30 seconds in
preview.

---

## 7. Environment variables

### Build time — must exist for a correct client bundle

| Variable | In Vercel? | Effect if missing |
| --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | ✅ | — |
| `NEXT_PUBLIC_BLOB_BASE_URL` | ❌ | Media falls back to `/public/media` (46 MB shipped in image) |
| `NEXT_PUBLIC_GTM_ID` | ❌ | Tag Manager / consent mode inactive |
| `NEXT_PUBLIC_COOKIESCRIPT_ID` | ❌ | Cookie banner inactive |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | ❌ | Verification meta tag absent |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | ❌ | Verification meta tag absent |

The five missing values match current production behaviour, so this release is
not a regression — but those features are silently inactive.

### Runtime — server-side only, never in the image

`ZOHO_SMTP_HOST` · `ZOHO_SMTP_PORT` · `ZOHO_SMTP_USER` · `ZOHO_SMTP_PASSWORD` ·
`ZOHO_SMTP_SECURE` · `CONTACT_TO_EMAIL` · `CONTACT_FROM_EMAIL` ·
`CONTACT_FROM_NAME` · `CONTACT_ACK_EMAIL` · `CONTACT_ALLOW_UNCONFIGURED` ·
`AI_PROVIDER` · `AI_MODEL` · `NVIDIA_API_KEY` · `CHAT_RATE_LIMIT` · `DEBUG_CHAT` · `BLOB_READ_WRITE_TOKEN` ·
`BLOB_UPLOAD_SECRET`

See [.env.example](../.env.example). Manage with `vercel env ls|add|pull`.

---

## 8. Rollback

**On Vercel you roll back by deployment, not by image tag.** There is no
supported way to point a Vercel deployment at an arbitrary VCR tag such as
`rabin_portfolio_prod:v1.0.2`.

### Revert to the previous release (instant, no rebuild)

```bash
vercel rollback https://rabin-portfolio-2-0-er0ufwgy7-rabin-projects.vercel.app
vercel rollback status
```

That deployment is `● Ready` and reports `{"version":"1.0.2"}`. Note it is the
last **framework-preset** build, so rolling back also leaves the container
architecture — usually what you want in an incident.

### Abandon the container architecture entirely

Delete `vercel.json` and redeploy. `next.config.ts` keeps the non-container
branch (`process.env.VERCEL ? undefined : …`) as the escape hatch.

### Kubernetes / ArgoCD path

Tag-based, and unrelated to Vercel. `git revert` the bump commit and let ArgoCD
sync — never `kubectl set image`, which `selfHeal: true` undoes within minutes.
See [deploy/README.md](../deploy/README.md).

---

## 9. Changing the version number

Three files must agree or CI's `version-record` job fails:

| File | Field |
| --- | --- |
| [publish/config.json](../publish/config.json) | `prod.version` |
| [package.json](../package.json) | `version` |
| [src/generated/version.json](../src/generated/version.json) | `version`, `releasedAt`, `releases[]` |

Edit all three by hand, then redeploy.

> ⚠️ **Do not use `npm run version:sync` for this.** See the known issue below.

---

## 10. Known issues

1. **`version:sync` destroys release history.**
   `publish/build-log-prod.txt` is gitignored (`.gitignore:59`) and not present
   in the repo, so `scripts/generate-version.mjs` rebuilds `releases[]` from an
   empty log and collapses it — 3 entries → 1. This means the committed
   `src/generated/version.json` is **not reproducible on any machine or in CI**,
   so the CI `version-record` job (regenerate-and-diff) cannot pass as written.
   The history has to be restored by hand after any sync.
   *As of this writing `src/generated/version.json` is again showing a single
   release entry.*

2. **Image tags are mutable across rebuilds of the same commit** — see §5.

3. **`setcap` costs 131 MB** — see §3.

4. **Stray VCR repository `web`** exists from initial setup. It holds one image
   and is referenced by preview `qoei6esnc`. Safe to delete once that preview
   ages out: `vercel vcr rm web`.

5. **`MAINTENANCE_MODE`** is configured in Vercel but referenced nowhere in the
   codebase.

6. **Two production deployments were canceled** during this work (`ou6yyl5f5`,
   `gz1aeuf3v`) by concurrent Git-triggered builds. Harmless, but concurrent
   pushes during a CLI deploy will cancel one another.

7. **Secure Compute and Static IPs are not supported** with custom container
   images.
