# Rabin R Portfolio 2.0

Premium freelancer portfolio rebuilt with Next.js 16, React 19, TypeScript and Tailwind CSS.

## Develop

```bash
npm install
vercel env pull .env.local   # or create .env.local by hand
npm run dev
```

`.env.local` is the only env file this project uses. It holds the SMTP
settings for the contact form (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`,
`SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO`, plus the optional
`CONTACT_ACK_EMAIL`, `CONTACT_PERSIST` and `CONTACT_ALLOW_UNCONFIGURED`
flags) and the assistant keys (`GEMINI_API_KEY`, `GROQ_API_KEY`,
`DEBUG_ASSISTANT`).

SMTP and GEMINI_API_KEY stay on the server. Never expose them as NEXT_PUBLIC_ vars.

## Quality

```bash
npm run lint
npm run test
npm run build
```
