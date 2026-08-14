import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { profile } from "@/content/profile";
import { rateLimit } from "@/lib/rate-limit";
import { clean, isEmail } from "@/lib/sanitize";
import { contactSchema } from "@/lib/contact-schema";

const fieldLabel: Record<string, string> = {
  name: "Name",
  email: "Email",
  company: "Company / Organization",
  projectType: "Project type",
  budget: "Budget",
  timeline: "Timeline",
  message: "Message",
};

export async function POST(req: NextRequest) {
  /* Rate limit — keyed on a normalized identifier, never raw client IP alone. */
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  const key = (req.headers.get("cf-connecting-ip") ?? ip) + ":" + (req.headers.get("user-agent") ?? "").slice(0, 60);
  if (!rateLimit(key, 4, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  /* Honeypot — silently accept bots. */
  if (clean(body.website, 80)) {
    return NextResponse.json({ ok: true });
  }

  /* Server-side re-validation with the shared Zod schema. */
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string") {
        (fieldErrors[key] ??= []).push(issue.message);
      }
    }
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  /* Sanitize every output value regardless of client input. */
  const name = clean(data.name, 120);
  const email = clean(data.email, 160);
  const company = clean(data.company ?? "", 160);
  const projectType = clean(data.projectType, 120);
  const budget = clean(data.budget, 120);
  const timeline = clean(data.timeline, 120);
  const message = clean(data.message, 3000);

  if (name.length < 2 || !isEmail(email) || message.length < 30) {
    return NextResponse.json({ error: "Please complete name, email and a message of at least 30 characters." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  if (!host) {
    return NextResponse.json(
      { error: "Mail is not configured yet. Email " + profile.email + " directly." },
      { status: 503 },
    );
  }

  const submittedAt = new Date().toISOString();

  const mailBody = [
    fieldLabel.name + ": " + name,
    fieldLabel.email + ": " + email,
    fieldLabel.company + ": " + (company || "—"),
    fieldLabel.projectType + ": " + projectType,
    fieldLabel.budget + ": " + budget,
    fieldLabel.timeline + ": " + timeline,
    "",
    "Message:",
    message,
    "",
    "Submitted: " + submittedAt,
  ].join("\n");

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_TO || profile.email,
    replyTo: email,
    subject: "New Portfolio Inquiry — " + projectType,
    text: mailBody,
  });

  return NextResponse.json({ ok: true });
}