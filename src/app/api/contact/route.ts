import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { submitContact } from "@/lib/contact/contact-service";
import { createEmailProvider } from "@/lib/contact/email-service";
import { createMessageStore } from "@/lib/contact/message-store";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 32 * 1024;

function clientKey(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const forwarded = req.headers.get("cf-connecting-ip") ?? ip;
  return `${forwarded}:${(req.headers.get("user-agent") ?? "").slice(0, 60)}`;
}

export async function POST(req: NextRequest) {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  if (!rateLimit(clientKey(req), 4, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });
  }

  const rawText = await req.text().catch(() => "");
  if (rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown = null;
  try {
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await submitContact(body, {
      email: createEmailProvider(),
      store: createMessageStore(),
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
  } catch {
    return NextResponse.json({ error: "Could not send. Please try again or email me directly." }, { status: 500 });
  }
}
