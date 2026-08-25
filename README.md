# Rabin R Portfolio 2.0

Premium freelancer portfolio rebuilt with Next.js 16, React 19, TypeScript and Tailwind CSS.

## Develop

```bash
npm install
vercel env pull .env.local   # or create .env.local by hand
npm run dev
```

`.env.local` is the only env file this project uses. It holds the Resend
settings for the contact form (`RESEND_API_KEY`, `CONTACT_FROM_EMAIL`,
`CONTACT_TO_EMAIL`, `CONTACT_FROM_NAME`, plus the optional
`CONTACT_ACK_EMAIL`, `CONTACT_PERSIST` and `CONTACT_ALLOW_UNCONFIGURED`
flags) and the assistant keys (`GEMINI_API_KEY`, `GROQ_API_KEY`,
`DEBUG_ASSISTANT`).

`RESEND_API_KEY` and `GEMINI_API_KEY` stay on the server. Never expose them as NEXT_PUBLIC_ vars.

## Quality

```bash
npm run lint
npm run test
npm run build
```
