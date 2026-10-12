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
 * the Email Service binding. The recipient address never reaches the browser.
 */
import {
  ContactMessage,
  ContactRequest,
  ContactResponse,
  looksAutomated,
  validateContact,
} from '../src/app/core/contact/contact.model';

const MAX_BODY_BYTES = 16 * 1024;
/** The only host that gets the real robots.txt; previews, workers.dev and the bare apex are blocked. */
const INDEXABLE_HOSTS = new Set(['www.rabinr.in']);

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

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

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
    await env.EMAIL.send({
      from: { email: env.CONTACT_FROM_EMAIL, name: 'Portfolio contact form' },
      to: env.CONTACT_TO_EMAIL,
      replyTo: { email: message.email, name: message.name },
      subject: `[Portfolio] ${message.subject}`,
      text: toText(message),
      html: toHtml(message),
    });
  } catch (error) {
    const code = (error as { code?: string }).code ?? 'unknown';
    console.error('[contact] send failed', code, error instanceof Error ? error.message : String(error));
    return json({ ok: false, error: 'Your message could not be sent right now. Please email me directly.' }, 502);
  }

  return json({ ok: true }, 200);
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

function toHtml({ name, email, subject, message }: ContactMessage): string {
  const paragraphs = escapeHtml(message)
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<div style="font-family:system-ui,sans-serif;line-height:1.6;color:#282522">
<h2 style="margin:0 0 12px">New portfolio enquiry</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<hr style="border:0;border-top:1px solid #e0d6c6">${paragraphs}</div>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
