import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { submitContact } from "@/lib/contact/contact-service";
import { createEmailProvider } from "@/lib/contact/email-service";
import { createMessageStore } from "@/lib/contact/message-store";
import { ATTACHMENT } from "@/content/contact-fields";
import type { ContactAttachment } from "@/types/contact";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32 * 1024;
/** JSON fields plus one attachment, with headroom for multipart framing. */
const MAX_MULTIPART_BYTES = ATTACHMENT.maxBytes + MAX_BODY_BYTES;

const ALLOWED_MIME = new Set<string>(ATTACHMENT.mimeTypes);

function hasAllowedExtension(name: string) {
  const lower = name.toLowerCase();
  return ATTACHMENT.extensions.some((ext) => lower.endsWith(ext));
}

/**
 * Reads a `multipart/form-data` submission: every text part becomes a body
 * field, and the single `attachment` part is validated against the shared
 * size/type limits. Both checks matter — the browser's `accept` attribute is
 * advisory and a crafted request can claim any MIME type it likes.
 */
async function readMultipart(
  req: NextRequest,
): Promise<{ body: Record<string, unknown>; attachment?: ContactAttachment } | { error: string; status: number }> {
  const form = await req.formData().catch((error) => {
    console.error("[contact] formData parse error:", error instanceof Error ? error.message : String(error));
    return null;
  });
  if (!form) return { error: "Invalid request: failed to parse form data.", status: 400 };

  const body: Record<string, unknown> = {};
  let attachment: ContactAttachment | undefined;

  for (const [key, value] of form.entries()) {
    if (typeof value === "string") {
      // `technologies` arrives as one entry per selected chip.
      if (key === "technologies") {
        (body.technologies as string[] | undefined) ??= [];
        (body.technologies as string[]).push(value);
      } else {
        body[key] = value;
      }
      continue;
    }

    if (key !== "attachment" || value.size === 0) continue;

    if (value.size > ATTACHMENT.maxBytes) {
      return { error: `Attachment is too large. Keep it under ${ATTACHMENT.maxLabel}.`, status: 413 };
    }
    if (!ALLOWED_MIME.has(value.type) || !hasAllowedExtension(value.name)) {
      return { error: "That file type isn't supported. Use PDF, DOC/DOCX, PNG/JPG or ZIP.", status: 400 };
    }

    attachment = {
      filename: value.name.slice(0, 200),
      contentType: value.type,
      size: value.size,
      content: Buffer.from(await value.arrayBuffer()),
    };
    body.attachmentName = attachment.filename;
  }

  return { body, attachment };
}

function clientKey(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const forwarded = req.headers.get("cf-connecting-ip") ?? ip;
  return `${forwarded}:${(req.headers.get("user-agent") ?? "").slice(0, 60)}`;
}

export async function POST(req: NextRequest) {
  const isMultipart = (req.headers.get("content-type") ?? "").includes("multipart/form-data");
  const limit = isMultipart ? MAX_MULTIPART_BYTES : MAX_BODY_BYTES;

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > limit) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  if (!rateLimit(clientKey(req), 4, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });
  }

  let body: unknown = null;
  let attachment: ContactAttachment | undefined;

  if (isMultipart) {
    const parsed = await readMultipart(req);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    body = parsed.body;
    attachment = parsed.attachment;
  } else {
    const rawText = await req.text().catch(() => "");
    if (rawText.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    }
    if (!rawText) {
      console.error("[contact] Empty request body received");
      return NextResponse.json({ error: "Invalid request: body is empty." }, { status: 400 });
    }
    try {
      body = JSON.parse(rawText);
    } catch (error) {
      console.error("[contact] JSON parse error:", error instanceof Error ? error.message : String(error));
      return NextResponse.json({ error: "Invalid request: malformed JSON." }, { status: 400 });
    }
  }

  try {
    const result = await submitContact(body, {
      email: createEmailProvider(),
      store: createMessageStore(),
      attachment,
    });

    if (!result.ok) {
      const status = result.error.includes("not configured") ? 503 : 400;
      return NextResponse.json(
        { error: result.error, fieldErrors: result.fieldErrors },
        { status },
      );
    }

    return NextResponse.json({
      ok: true,
      referenceId: result.referenceId,
      responseTime: result.responseTime,
    });
  } catch (error) {
    console.error("[contact] Unhandled error in POST /api/contact:", error);

    const message =
      error instanceof Error && error.message.includes("authentication")
        ? "Email service is temporarily unavailable. Your message was saved. Please try again or email me directly."
        : "Could not send. Your message was saved and I'll get back to you soon. You can also email me directly.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
