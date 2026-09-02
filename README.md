# Rabin R Portfolio 2.0

Premium freelancer portfolio rebuilt with Next.js 16, React 19, TypeScript and Tailwind CSS.

## Develop

```bash
npm install
vercel env pull .env.local   # or create .env.local by hand
npm run dev
```

`.env.local` is the only env file this project uses. It holds the mail
settings for the contact form, the envelope (`CONTACT_FROM_EMAIL`,
`CONTACT_TO_EMAIL`, `CONTACT_FROM_NAME`, plus the optional
`CONTACT_ACK_EMAIL` and `CONTACT_ALLOW_UNCONFIGURED`
flags) and the assistant keys (`GEMINI_API_KEY`, `GROQ_API_KEY`,
`DEBUG_ASSISTANT`).

### Contact mail transport

Zoho SMTP is the only mail transport. Without these variables the contact
endpoint returns 503 rather than silently dropping an enquiry.

```bash
ZOHO_SMTP_HOST=smtp.zoho.in
ZOHO_SMTP_PORT=465          # 465 = implicit TLS, 587 = STARTTLS
ZOHO_SMTP_USER=hello@rabinr.in
ZOHO_SMTP_PASSWORD=         # Zoho *app password*, never the account password
CONTACT_TO_EMAIL=hello@rabinr.in
```

Generate the app password in Zoho (Security → App Passwords); it is shown once.
Mail is always sent **from** the authenticated Zoho mailbox with the visitor's
address as `Reply-To` — spoofing the visitor as sender breaks SPF/DKIM and gets
the message rejected. Set the same variables in Vercel under
Project → Settings → Environment Variables.

SMTP credentials and `GEMINI_API_KEY` stay on the server.
Never expose them as NEXT_PUBLIC_ vars.

## Media (Vercel Blob)

Production media — project frames, case-study galleries, service art, the hero
reel and portraits — is served from Vercel Blob. `/public` keeps only the small
static assets (favicons, PWA logos).

```bash
vercel env pull .env.local     # BLOB_READ_WRITE_TOKEN
npm run blob:migrate:dry       # preview the upload
npm run blob:migrate           # upload everything in the manifest
```

Then set `NEXT_PUBLIC_BLOB_BASE_URL` (the store's public origin) locally and on
Vercel. Until it is set the app falls back to the legacy `/public/media` paths,
so a fresh clone still renders.

Assets are addressed through the type-safe manifest in `src/lib/media.ts` —
`media("projects/galaxy-sofas/gallery-02.webp")` — never by a literal URL.
`BLOB_READ_WRITE_TOKEN` is server-only (`src/lib/blob-server.ts` is marked
`server-only`). Uploads go through `POST /api/blob/upload`, which requires an
`Authorization: Bearer $BLOB_UPLOAD_SECRET` header and is disabled entirely
while that secret is unset.

Full guide: [docs/vercel-blob.md](docs/vercel-blob.md).

## Quality

```bash
npm run lint
npm run test
npm run build
```
