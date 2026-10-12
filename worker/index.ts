/**
 * Cloudflare Worker for the portfolio.
 *
 * Static, prerendered pages are served straight from the assets binding; only
 * /api/* reaches this script (see `run_worker_first` in wrangler.jsonc).
 *
 * GET /robots.txt blocks crawling on any host other than the canonical one.
 *
 * POST /api/contact validates the message with the same rules as the form,
 * drops obvious bots, rate-limits per IP and emails it to CONTACT_TO_EMAIL via
 * your SMTP mailbox. The recipient address never reaches the browser.
 */
import { WorkerMailer } from 'worker-mailer';
import {
  ContactMessage,
  ContactRequest,
  ContactResponse,
  looksAutomated,
  validateContact,
} from '../src/app/core/contact/contact.model';

const MAX_BODY_BYTES = 16 * 1024;
/** The only host that gets the real robots.txt; previews, workers.dev and www (which should redirect here) are blocked. */
const INDEXABLE_HOSTS = new Set(['rabinr.in']);

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'POST' });
      }
      return handleContact(request, env);
    }

    // Preview and *.workers.dev hosts serve identical HTML; keep crawlers on the canonical domain
    // Local dev (.dev.vars) mirrors production so audits measure the real robots.txt
    const indexable = INDEXABLE_HOSTS.has(url.hostname) || env.LOCAL_INDEXABLE === 'true';
    if (url.pathname === '/robots.txt' && !indexable) {
      return new Response('User-agent: *\nDisallow: /\n', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ ok: false, error: 'Not found.' }, 404);
    }

    if (url.pathname === '/.well-known/api-catalog') {
      return apiCatalog(url.origin);
    }

    return servePage(request, env, url);
  },
} satisfies ExportedHandler<Env>;

/** Discovery links sent with every HTML page (RFC 8288). */
const SITE_LINKS = [
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</.well-known/api-catalog>; rel="api-catalog"',
];

/** "/work/prims" -> "/work/prims/index.md"; "/" -> "/index.md" (written by scripts/postbuild.mjs). */
function markdownPath(pathname: string): string {
  const base = pathname.replace(/\/+$/, '');
  return `${base}/index.md`;
}

/**
 * Pages are prerendered HTML with a Markdown twin. A request that asks for
 * `Accept: text/markdown` gets the twin on the same URL; everyone else gets
 * the HTML, with `Vary: Accept` so caches keep the two apart.
 */
async function servePage(request: Request, env: Env, url: URL): Promise<Response> {
  const wantsMarkdown = request.method === 'GET' && (request.headers.get('Accept') ?? '').includes('text/markdown');

  if (wantsMarkdown) {
    const md = await env.ASSETS.fetch(new Request(new URL(markdownPath(url.pathname), url.origin), request));
    if (md.ok) {
      const headers = new Headers(md.headers);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      headers.set('Vary', 'Accept');
      headers.append('Link', `<${url.pathname}>; rel="canonical"`);
      return new Response(md.body, { status: 200, headers });
    }
  }

  const response = await env.ASSETS.fetch(request);
  if (!(response.headers.get('Content-Type') ?? '').includes('text/html')) return response;

  const headers = new Headers(response.headers);
  headers.set('Vary', 'Accept');
  for (const link of SITE_LINKS) headers.append('Link', link);
  if (response.status === 200) {
    headers.append('Link', `<${markdownPath(url.pathname)}>; rel="alternate"; type="text/markdown"`);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

/** RFC 9727 API catalog: the one public API, the contact endpoint, and its OpenAPI description. */
function apiCatalog(origin: string): Response {
  const body = {
    linkset: [
      {
        anchor: `${origin}/api/contact`,
        'service-desc': [{ href: `${origin}/openapi.json`, type: 'application/vnd.oai.openapi+json' }],
        'service-doc': [{ href: `${origin}/contact`, type: 'text/html' }],
      },
    ],
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (!isSameOrigin(request)) {
    return json({ ok: false, error: 'Forbidden.' }, 403);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await env.CONTACT_LIMITER.limit({ key: ip });
  if (!success) {
    return json({ ok: false, error: 'Too many messages. Please wait a minute and try again.' }, 429);
  }

  const body = await readJson(request);
  if (!body) {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  // Bots get a quiet success so they have no signal to adapt to
  if (looksAutomated(body)) {
    return json({ ok: true }, 200);
  }

  const errors = validateContact(body);
  const firstError = Object.values(errors)[0];
  if (firstError) {
    return json({ ok: false, error: firstError }, 422);
  }

  const message: ContactMessage = {
    name: body.name.trim(),
    email: body.email.trim(),
    subject: body.subject.trim(),
    message: body.message.trim(),
  };

  try {
    await sendMail(env, message);
  } catch (error) {
    console.error('[contact] send failed', error instanceof Error ? error.message : String(error));
    return json({ ok: false, error: 'Your message could not be sent right now. Please email me directly.' }, 502);
  }

  return json({ ok: true }, 200);
}

/**
 * Delivers the message through your own SMTP mailbox (e.g. Zoho) over TLS.
 * Credentials are Worker secrets (SMTP_USER, SMTP_PASSWORD); host, port and
 * addresses are plain vars in wrangler.jsonc.
 */
async function sendMail(env: Env, message: ContactMessage): Promise<void> {
  // Local wrangler dev only (.dev.vars): log instead of sending. Never set in production.
  if (env.CONTACT_DRY_RUN === 'true') {
    console.log('[contact] dry run, not sent:', message.subject, 'from', message.email);
    return;
  }
  if (!env.SMTP_USER || !env.SMTP_PASSWORD) throw new Error('SMTP credentials are not configured');
  const port = Number(env.SMTP_PORT);

  await WorkerMailer.send(
    {
      host: env.SMTP_HOST,
      port,
      // 465 is implicit TLS; 587 starts plain and upgrades with STARTTLS
      secure: port === 465,
      startTls: port !== 465,
      credentials: { username: env.SMTP_USER, password: env.SMTP_PASSWORD },
      authType: ['plain', 'login'],
      socketTimeoutMs: 15_000,
      responseTimeoutMs: 15_000,
    },
    {
      from: { name: 'Portfolio contact form', email: env.CONTACT_FROM_EMAIL },
      to: env.CONTACT_TO_EMAIL,
      reply: { name: message.name, email: message.email },
      subject: `[Portfolio] ${message.subject}`,
      text: toText(message),
      html: toHtml(message),
    },
  );
}

/** Browsers always send Origin on a cross-site POST; reject ones from other sites. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  return origin === null || origin === new URL(request.url).origin;
}

async function readJson(request: Request): Promise<ContactRequest | null> {
  if (!request.headers.get('Content-Type')?.includes('application/json')) return null;

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return null;

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof data !== 'object' || data === null) return null;
  const record = data as Record<string, unknown>;
  const text = (key: string) => (typeof record[key] === 'string' ? (record[key] as string) : '');

  return {
    name: text('name'),
    email: text('email'),
    subject: text('subject'),
    message: text('message'),
    website: text('website'),
    startedAt: typeof record['startedAt'] === 'number' ? record['startedAt'] : Number.NaN,
  };
}

function json(body: ContactResponse, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}

function toText({ name, email, subject, message }: ContactMessage): string {
  return `New message from the portfolio contact form\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}\n`;
}

/**
 * The notification email, laid out for mail clients: tables and inline styles only (no
 * external CSS, images or fonts), in the site's Warm Creative palette. Every visitor value
 * is escaped; the reply button is a mailto link to the visitor's own address.
 */
function toHtml({ name, email, subject, message }: ContactMessage): string {
  const body = escapeHtml(message)
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#282522">${block.replace(/\n/g, '<br>')}</p>`)
    .join('');
  const replyHref = escapeHtml(`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`);
  const preheader = escapeHtml(`${name}: ${subject}`);

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New portfolio enquiry</title></head>
<body style="margin:0;padding:0;background:#f8f1e5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f8f1e5;">${preheader}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f1e5;">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;font-family:Arial,Helvetica,sans-serif;">
      <tr><td style="padding:0 0 12px;">
        <span style="display:inline-block;padding:6px 14px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#282522;background:#a7bfa3;border:2px solid #282522;border-radius:999px;">New enquiry</span>
      </td></tr>
      <tr><td style="background:#fffaf2;border:2px solid #282522;border-radius:16px;box-shadow:6px 6px 0 #282522;padding:28px;">
        <h1 style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#282522;">${escapeHtml(subject)}</h1>
        <p style="margin:0 0 20px;font-size:14px;color:#5f5850;">From <strong style="color:#282522;">${escapeHtml(name)}</strong></p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 22px;">
          <tr>
            <td style="padding:12px 14px;background:#f8f1e5;border:1.5px solid #282522;border-radius:10px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4a6244;">Email</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#282522;word-break:break-all;">${escapeHtml(email)}</p>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#4a6244;">Message</p>
        ${body}

        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 0;">
          <tr><td style="background:#e76f51;border:2px solid #282522;border-radius:999px;box-shadow:3px 3px 0 #282522;">
            <a href="${replyHref}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:700;color:#282522;text-decoration:none;">Reply to ${escapeHtml(name)} &rarr;</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:16px 4px 0;font-size:12px;line-height:1.5;color:#5f5850;">
        Sent from the contact form on rabinr.in. Replying goes straight to ${escapeHtml(email)}.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
