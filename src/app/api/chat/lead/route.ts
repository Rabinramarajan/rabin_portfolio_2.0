import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { submitContact } from "@/lib/contact/contact-service";
import { createEmailProvider } from "@/lib/contact/email-service";
import { logChatEvent } from "@/chat/analytics";
import { chatConfig } from "@/chat/config";
import { chatLeadSchema } from "@/chat/schema";

/**
 * POST /api/chat/lead — chat-captured enquiries.
 *
 * Deliberately a thin adapter over the existing contact pipeline rather than a
 * second delivery path: validation and email delivery stay in one place, so a
 * chat lead and a contact-form lead arrive identically.
 */

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;

function clientKey(req: NextRequest): string {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "anon";
  return `chat-lead:${ip}`;
}

export async function POST(req: NextRequest) {
  if (!chatConfig.enabled || !chatConfig.allowLeadCapture) {
    return NextResponse.json({ error: "Enquiries are not available right now." }, { status: 503 });
  }

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  if (!rateLimit(clientKey(req), 3, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many enquiries. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const rawText = await req.text().catch(() => "");
  if (rawText.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = chatLeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the details and try again." },
      { status: 400 },
    );
  }

  const lead = parsed.data;
  logChatEvent("lead_submitted", { projectType: lead.projectType.slice(0, 40) });

  try {
    const result = await submitContact(
      {
        name: lead.name,
        email: lead.email,
        company: lead.company || "",
        inquiryType: "Project",
        projectType: lead.projectType,
        preferredContact: "Email",
        // The contact schema requires 30+ characters; the project type is
        // prepended so a terse brief still carries its own context.
        message: `[Sent from Ask Rabin]\nProject type: ${lead.projectType}\n\n${lead.message}`,
      },
      { email: createEmailProvider() },
    );

    if (!result.ok) {
      const status = result.error.includes("not configured") ? 503 : 400;
      return NextResponse.json({ error: result.error, fieldErrors: result.fieldErrors }, { status });
    }

    return NextResponse.json({
      ok: true,
      referenceId: result.referenceId,
      responseTime: result.responseTime,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not send that enquiry. Please use the contact page instead." },
      { status: 500 },
    );
  }
}
