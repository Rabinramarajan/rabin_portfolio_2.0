import { profile } from "@/content/profile";
import type { ContactPayload } from "@/types/contact";

/**
 * Email markup is deliberately table-based with inline styles: Gmail, Outlook
 * and Apple Mail strip <style> rules in varying degrees, so anything that must
 * survive lives on the element. The <style> block only carries progressive
 * enhancement (responsive stacking, hover, the pulse on the CTA halo).
 */

const C = {
  bg: "#0a0a0c",
  elevated: "#101014",
  surface: "#16161b",
  surfaceSoft: "#131318",
  line: "#26262d",
  lineSoft: "#1e1e24",
  text: "#f2f1ec",
  muted: "#9a9aa3",
  faint: "#83838c",
  accent: "#c9f24d",
  accentDim: "#9ec22f",
  accentInk: "#0a0a0c",
} as const;

const FONT =
  "'Inter','Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif";

const DASH = "—";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function val(value: string | undefined | null): string {
  const trimmed = (value ?? "").trim();
  return trimmed ? esc(trimmed) : DASH;
}

/** "Aug 23, 2026  •  06:41 PM IST" — the inbox owner reads in IST. */
function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return esc(iso);
  const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
  const day = new Intl.DateTimeFormat("en-US", {
    ...opts,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    ...opts,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return `${day}&nbsp;&nbsp;•&nbsp;&nbsp;${time} IST`;
}

/** A lime-ringed glyph badge. Round on clients that honour border-radius. */
function iconBadge(glyph: string, size = 40): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td width="${size}" height="${size}" align="center" valign="middle" style="width:${size}px;height:${size}px;background:${C.surfaceSoft};border:1px solid ${C.line};border-radius:${size}px;color:${C.accent};font-family:${FONT};font-size:${Math.round(size * 0.42)}px;line-height:1;">${glyph}</td>
  </tr></table>`;
}

/** One labelled row inside the "Inquiry Details" card. */
function detailRow(glyph: string, label: string, value: string, last = false): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
    <tr>
      <td width="52" valign="top" style="padding:14px 12px 14px 0;">${iconBadge(glyph, 36)}</td>
      <td valign="middle" style="padding:14px 0;border-bottom:${last ? "none" : `1px solid ${C.lineSoft}`};">
        <div style="font-family:${FONT};font-size:11px;line-height:16px;color:${C.faint};letter-spacing:.04em;">${label}</div>
        <div style="font-family:${FONT};font-size:15px;line-height:22px;color:${C.text};font-weight:600;word-break:break-word;">${value}</div>
      </td>
    </tr>
  </table>`;
}

/** One cell of the four-up quick-facts strip. */
function factCell(glyph: string, label: string, value: string, divider: boolean): string {
  return `<td class="fact" width="25%" align="center" valign="top" style="width:25%;padding:22px 10px;${divider ? `border-right:1px solid ${C.lineSoft};` : ""}">
    <div style="padding-bottom:10px;">${iconBadge(glyph, 34)}</div>
    <div style="font-family:${FONT};font-size:11px;line-height:16px;color:${C.faint};letter-spacing:.04em;">${label}</div>
    <div style="font-family:${FONT};font-size:14px;line-height:20px;color:${C.text};font-weight:600;padding-top:2px;">${value}</div>
  </td>`;
}

function socialPill(href: string, glyph: string, label: string): string {
  return `<td style="padding-right:8px;"><a href="${esc(href)}" title="${esc(label)}" style="display:inline-block;width:32px;height:32px;line-height:30px;text-align:center;border:1px solid ${C.line};border-radius:32px;color:${C.muted};font-family:${FONT};font-size:14px;text-decoration:none;">${glyph}</a></td>`;
}

function card(inner: string, padding = "26px 28px"): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${C.elevated};border:1px solid ${C.lineSoft};border-radius:16px;">
    <tr><td style="padding:${padding};">${inner}</td></tr>
  </table>`;
}

function sectionHeading(title: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
    <tr>
      <td valign="middle" style="font-family:${FONT};font-size:16px;line-height:24px;font-weight:700;color:${C.accent};white-space:nowrap;padding-right:14px;">${title}</td>
      <td valign="middle" width="100%" style="width:100%;"><div style="height:1px;background:${C.lineSoft};font-size:0;line-height:0;">&nbsp;</div></td>
    </tr>
  </table>`;
}

export interface NotificationContext {
  payload: ContactPayload;
  referenceId: string;
  receivedAt: string;
}

/** Plain-text part. Kept in sync with the HTML for text-only clients. */
export function notificationText({ payload, referenceId, receivedAt }: NotificationContext): string {
  const line = (label: string, value?: string) => `${label}: ${value?.trim() || DASH}`;
  return [
    `NEW PORTFOLIO INQUIRY — ${payload.inquiryType}`,
    "",
    line("Reference", referenceId),
    line("Submitted", receivedAt),
    "",
    line("Name", payload.name),
    line("Email", payload.email),
    line("Company", payload.company),
    line("Website", payload.projectUrl),
    line("Role", payload.role),
    line("Inquiry", payload.inquiryType),
    line("Project type", payload.projectType),
    line("Stage", payload.projectStage),
    line("Technologies", payload.technologies?.join(", ")),
    line("Budget", payload.budget),
    line("Timeline", payload.timeline),
    line("Engagement", payload.engagement),
    line("Found me via", payload.referralSource),
    line("Preferred contact", payload.preferredContact),
    line("Attachment", payload.attachmentName),
    "",
    "Message:",
    payload.message,
    "",
    `Reply to this email to reach ${payload.name} directly.`,
  ].join("\n");
}

export function notificationHtml({ payload, referenceId, receivedAt }: NotificationContext): string {
  const year = new Date(receivedAt).getFullYear() || new Date().getFullYear();
  const replyHref = `mailto:${encodeURIComponent(payload.email)}?subject=${encodeURIComponent(
    `Re: your portfolio inquiry (${referenceId})`,
  )}`;
  const social = Object.fromEntries(profile.socials.map((s) => [s.id, s.href]));

  const messageBody = esc(payload.message).replace(/\r?\n/g, "<br />");

  const attachmentCard = payload.attachmentName
    ? `${sectionHeading("Attachment")}
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:16px;background:${C.surfaceSoft};border:1px solid ${C.lineSoft};border-radius:12px;">
         <tr>
           <td width="52" valign="middle" style="padding:14px 0 14px 14px;">
             <div style="width:38px;height:38px;line-height:38px;text-align:center;background:#2a1614;border:1px solid #4a2320;border-radius:9px;color:#ff6b5e;font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:.02em;">FILE</div>
           </td>
           <td valign="middle" style="padding:14px 14px 14px 12px;font-family:${FONT};font-size:14px;line-height:20px;color:${C.text};font-weight:600;word-break:break-word;">
             ${val(payload.attachmentName)}
             <div style="font-size:11px;line-height:16px;color:${C.faint};font-weight:400;padding-top:2px;">Attached to this email</div>
           </td>
         </tr>
       </table>`
    : `${sectionHeading("Attachment")}
       <div style="margin-top:16px;padding:22px 16px;background:${C.surfaceSoft};border:1px dashed ${C.line};border-radius:12px;font-family:${FONT};font-size:13px;line-height:20px;color:${C.faint};text-align:center;">No file was attached to this inquiry.</div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>New Portfolio Inquiry — ${esc(referenceId)}</title>
<style>
  body { margin:0; padding:0; background:${C.bg}; }
  a { text-decoration:none; }
  .cta:hover { background:#d8fb66 !important; }
  .halo { animation: pulse 3.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity:.55; } 50% { opacity:1; } }
  @media (prefers-reduced-motion: reduce) { .halo { animation:none; } }
  @media only screen and (max-width:620px) {
    .shell { width:100% !important; }
    .pad { padding-left:18px !important; padding-right:18px !important; }
    .stack { display:block !important; width:100% !important; max-width:100% !important; }
    .stack-gap { padding-top:14px !important; padding-left:0 !important; }
    .fact { display:block !important; width:100% !important; border-right:none !important; border-bottom:1px solid ${C.lineSoft} !important; }
    .h1 { font-size:28px !important; line-height:34px !important; }
    .hero-art { display:none !important; }
    .cta-wrap { display:block !important; width:100% !important; text-align:left !important; padding-top:16px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;font-size:0;line-height:0;max-height:0;overflow:hidden;opacity:0;">New inquiry from ${esc(payload.name)} — ${esc(payload.inquiryType)} · ${esc(referenceId)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${C.bg};">
<tr><td align="center" style="padding:28px 14px 40px;">
<table role="presentation" class="shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

  <!-- Header -->
  <tr><td class="pad" style="padding:0 4px 18px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
      <tr>
        <td class="stack" valign="middle" style="font-family:${FONT};">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td valign="middle" style="padding-right:14px;">
              <div style="width:46px;height:46px;line-height:46px;text-align:center;font-family:${FONT};font-size:22px;font-weight:800;color:${C.accent};border:1px solid ${C.line};border-radius:12px;background:${C.elevated};">R</div>
            </td>
            <td valign="middle">
              <div style="font-family:${FONT};font-size:19px;line-height:24px;font-weight:800;color:${C.text};letter-spacing:.06em;">${esc(profile.name.toUpperCase())}</div>
              <div style="font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};">${esc(profile.role)}</div>
            </td>
          </tr></table>
        </td>
        <td class="stack stack-gap" align="right" valign="middle" style="font-family:${FONT};">
          <div style="font-size:16px;line-height:22px;font-weight:700;color:${C.accent};">New Portfolio Inquiry</div>
          <div style="font-size:12px;line-height:18px;color:${C.muted};">You have received a new project inquiry</div>
        </td>
      </tr>
    </table>
    <div style="height:1px;background:${C.accentDim};opacity:.45;font-size:0;line-height:0;margin-top:16px;">&nbsp;</div>
  </td></tr>

  <!-- Hero -->
  <tr><td style="padding-bottom:14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${C.elevated};background-image:radial-gradient(120% 140% at 88% 45%, rgba(201,242,77,.14) 0%, rgba(201,242,77,.04) 38%, ${C.elevated} 66%);border:1px solid ${C.lineSoft};border-radius:18px;">
      <tr>
        <td class="stack pad" valign="middle" width="58%" style="width:58%;padding:34px 20px 34px 30px;">
          <div style="font-family:${FONT};font-size:11px;line-height:16px;letter-spacing:.16em;font-weight:700;color:${C.accent};text-transform:uppercase;">New Inquiry Received</div>
          <div class="h1" style="font-family:${FONT};font-size:34px;line-height:40px;font-weight:800;color:${C.text};padding:14px 0 0;">New Portfolio<br />Project Inquiry</div>
          <div style="width:46px;height:3px;background:${C.accent};border-radius:3px;font-size:0;line-height:0;margin:18px 0;">&nbsp;</div>
          <div style="font-family:${FONT};font-size:14px;line-height:22px;color:${C.muted};">Great! You have received a new inquiry through your portfolio contact form.</div>
        </td>
        <td class="hero-art" valign="middle" width="42%" align="center" style="width:42%;padding:26px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td align="center" valign="middle" class="halo" style="width:150px;height:150px;border-radius:150px;background-image:radial-gradient(circle at 50% 50%, rgba(201,242,77,.30) 0%, rgba(201,242,77,.10) 45%, rgba(10,10,12,0) 72%);">
              <div style="font-size:44px;line-height:44px;color:${C.accent};font-family:${FONT};">&#9679;</div>
              <div style="font-family:${FONT};font-size:10px;line-height:16px;letter-spacing:.18em;color:${C.accentDim};padding-top:8px;">WORLDWIDE</div>
            </td>
          </tr></table>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Meta bar -->
  <tr><td style="padding-bottom:14px;">
    ${card(
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
        <tr>
          <td class="stack" width="50%" valign="middle" style="width:50%;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td valign="middle" style="padding-right:14px;">${iconBadge("&#9776;", 42)}</td>
              <td valign="middle">
                <div style="font-family:${FONT};font-size:11px;line-height:16px;color:${C.faint};letter-spacing:.04em;">Reference ID</div>
                <div style="font-family:${FONT};font-size:15px;line-height:22px;font-weight:700;color:${C.accent};">${esc(referenceId)}</div>
              </td>
            </tr></table>
          </td>
          <td class="stack stack-gap" width="50%" valign="middle" style="width:50%;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td valign="middle" style="padding-right:14px;">${iconBadge("&#9200;", 42)}</td>
              <td valign="middle">
                <div style="font-family:${FONT};font-size:11px;line-height:16px;color:${C.faint};letter-spacing:.04em;">Submitted On</div>
                <div style="font-family:${FONT};font-size:15px;line-height:22px;font-weight:700;color:${C.accent};">${formatStamp(receivedAt)}</div>
              </td>
            </tr></table>
          </td>
        </tr>
      </table>`,
      "20px 24px",
    )}
  </td></tr>

  <!-- Inquiry details -->
  <tr><td style="padding-bottom:14px;">
    ${card(
      `${sectionHeading("Inquiry Details")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:6px;">
        <tr>
          <td class="stack" width="50%" valign="top" style="width:50%;padding-right:16px;">
            ${detailRow("&#9787;", "Name", val(payload.name))}
            ${detailRow("&#9993;", "Email", `<a href="mailto:${esc(payload.email)}" style="color:${C.text};text-decoration:none;">${val(payload.email)}</a>`)}
            ${detailRow("&#9974;", "Company", val(payload.company))}
            ${detailRow("&#9788;", "Website", val(payload.projectUrl))}
            ${detailRow("&#9873;", "Role", val(payload.role), true)}
          </td>
          <td class="stack stack-gap" width="50%" valign="top" style="width:50%;padding-left:16px;">
            ${detailRow("&#9636;", "Inquiry / Project", val(payload.inquiryType))}
            ${detailRow("&#9634;", "Project Type", val(payload.projectType))}
            ${detailRow("&#9881;", "Stage", val(payload.projectStage))}
            ${detailRow("&#8249;&#8250;", "Technologies", val(payload.technologies?.join(", ")))}
            ${detailRow("&#8377;", "Budget", val(payload.budget), true)}
          </td>
        </tr>
      </table>`,
    )}
  </td></tr>

  <!-- Quick facts -->
  <tr><td style="padding-bottom:14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${C.elevated};border:1px solid ${C.lineSoft};border-radius:16px;">
      <tr>
        ${factCell("&#9201;", "Timeline", val(payload.timeline), true)}
        ${factCell("&#9758;", "Engagement", val(payload.engagement), true)}
        ${factCell("&#9906;", "Found Me Via", val(payload.referralSource), true)}
        ${factCell("&#9787;", "Preferred Contact", val(payload.preferredContact), false)}
      </tr>
    </table>
  </td></tr>

  <!-- Message + attachment -->
  <tr><td style="padding-bottom:14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
      <tr>
        <td class="stack" width="50%" valign="top" style="width:50%;padding-right:7px;">
          ${card(
            `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td valign="top" style="padding-right:10px;font-family:Georgia,serif;font-size:30px;line-height:26px;color:${C.accent};">&#8220;</td>
              <td valign="middle" style="font-family:${FONT};font-size:15px;line-height:22px;font-weight:700;color:${C.accent};">Message from Client</td>
            </tr></table>
            <div style="font-family:${FONT};font-size:14px;line-height:23px;color:${C.text};padding-top:14px;word-break:break-word;">${messageBody}</div>`,
            "24px 24px",
          )}
        </td>
        <td class="stack stack-gap" width="50%" valign="top" style="width:50%;padding-left:7px;">
          ${card(attachmentCard, "24px 24px")}
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding-bottom:22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${C.elevated};background-image:radial-gradient(110% 200% at 8% 50%, rgba(201,242,77,.12) 0%, ${C.elevated} 55%);border:1px solid ${C.lineSoft};border-radius:16px;">
      <tr>
        <td valign="middle" style="padding:26px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            <tr>
              <td class="stack" valign="middle">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td valign="middle" style="padding-right:16px;">${iconBadge("&#10148;", 52)}</td>
                  <td valign="middle">
                    <div style="font-family:${FONT};font-size:17px;line-height:24px;font-weight:700;color:${C.text};">Respond to this inquiry</div>
                    <div style="font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted};padding-top:2px;">Reply soon and turn this opportunity into a successful collaboration.</div>
                  </td>
                </tr></table>
              </td>
              <td class="cta-wrap" align="right" valign="middle" style="padding-left:18px;">
                <a class="cta" href="${replyHref}" style="display:inline-block;background:${C.accent};color:${C.accentInk};font-family:${FONT};font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:15px 26px;border-radius:10px;white-space:nowrap;">Reply to client &#8594;</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td class="pad" style="padding:0 4px;">
    <div style="height:1px;background:${C.lineSoft};font-size:0;line-height:0;margin-bottom:18px;">&nbsp;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
      <tr>
        <td class="stack" valign="middle">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            ${socialPill(social.linkedin ?? "#", "in", "LinkedIn")}
            ${socialPill(social.github ?? "#", "&#9679;", "GitHub")}
            ${socialPill(social.website ?? "#", "&#9788;", "Website")}
            ${socialPill(`mailto:${profile.email}`, "&#9993;", "Email")}
          </tr></table>
        </td>
        <td class="stack stack-gap" align="right" valign="middle" style="font-family:${FONT};font-size:12px;line-height:19px;color:${C.faint};">
          This is an automated email from your portfolio contact form.<br />
          &copy; ${year} ${esc(profile.name)}. All rights reserved.
        </td>
      </tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export interface AcknowledgementContext {
  payload: ContactPayload;
  referenceId: string;
}

export function acknowledgementText({ payload, referenceId }: AcknowledgementContext): string {
  return [
    `Hi ${payload.name},`,
    "",
    "Your message has been received.",
    "",
    `Reference: ${referenceId}`,
    `${profile.availability.responseTime}.`,
    "",
    "If anything is urgent, reply to this email with the extra context.",
    "",
    `— ${profile.name}`,
    profile.role,
  ].join("\n");
}

export function acknowledgementHtml({ payload, referenceId }: AcknowledgementContext): string {
  const year = new Date().getFullYear();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="dark" />
<title>Message received — ${esc(referenceId)}</title>
<style>
  body { margin:0; padding:0; background:${C.bg}; }
  a { text-decoration:none; }
  @media only screen and (max-width:620px) {
    .shell { width:100% !important; }
    .pad { padding-left:20px !important; padding-right:20px !important; }
    .h1 { font-size:26px !important; line-height:32px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${C.bg};">
<tr><td align="center" style="padding:28px 14px 40px;">
<table role="presentation" class="shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

  <tr><td class="pad" style="padding:0 4px 18px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="middle" style="padding-right:14px;">
        <div style="width:46px;height:46px;line-height:46px;text-align:center;font-family:${FONT};font-size:22px;font-weight:800;color:${C.accent};border:1px solid ${C.line};border-radius:12px;background:${C.elevated};">R</div>
      </td>
      <td valign="middle">
        <div style="font-family:${FONT};font-size:19px;line-height:24px;font-weight:800;color:${C.text};letter-spacing:.06em;">${esc(profile.name.toUpperCase())}</div>
        <div style="font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};">${esc(profile.role)}</div>
      </td>
    </tr></table>
    <div style="height:1px;background:${C.accentDim};opacity:.45;font-size:0;line-height:0;margin-top:16px;">&nbsp;</div>
  </td></tr>

  <tr><td style="padding-bottom:14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${C.elevated};background-image:radial-gradient(120% 140% at 85% 40%, rgba(201,242,77,.14) 0%, ${C.elevated} 62%);border:1px solid ${C.lineSoft};border-radius:18px;">
      <tr><td style="padding:34px 30px;">
        <div style="font-family:${FONT};font-size:11px;line-height:16px;letter-spacing:.16em;font-weight:700;color:${C.accent};text-transform:uppercase;">Message Received</div>
        <div class="h1" style="font-family:${FONT};font-size:30px;line-height:38px;font-weight:800;color:${C.text};padding-top:12px;">Thanks, ${esc(payload.name)}.</div>
        <div style="width:46px;height:3px;background:${C.accent};border-radius:3px;font-size:0;line-height:0;margin:18px 0;">&nbsp;</div>
        <div style="font-family:${FONT};font-size:14px;line-height:23px;color:${C.muted};">Your inquiry landed safely and is now in my queue. ${esc(profile.availability.responseTime)}.</div>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding-bottom:14px;">
    ${card(
      `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle" style="padding-right:14px;">${iconBadge("&#9776;", 42)}</td>
        <td valign="middle">
          <div style="font-family:${FONT};font-size:11px;line-height:16px;color:${C.faint};letter-spacing:.04em;">Your reference</div>
          <div style="font-family:${FONT};font-size:15px;line-height:22px;font-weight:700;color:${C.accent};">${esc(referenceId)}</div>
        </td>
      </tr></table>`,
      "20px 24px",
    )}
  </td></tr>

  <tr><td style="padding-bottom:22px;">
    ${card(
      `<div style="font-family:${FONT};font-size:14px;line-height:23px;color:${C.text};">If anything is urgent, just reply to this email with the extra context — it reaches me directly.</div>
       <div style="font-family:${FONT};font-size:14px;line-height:23px;color:${C.muted};padding-top:18px;">— ${esc(profile.name)}<br /><span style="color:${C.faint};font-size:13px;">${esc(profile.role)}</span></div>`,
    )}
  </td></tr>

  <tr><td class="pad" style="padding:0 4px;">
    <div style="height:1px;background:${C.lineSoft};font-size:0;line-height:0;margin-bottom:18px;">&nbsp;</div>
    <div style="font-family:${FONT};font-size:12px;line-height:19px;color:${C.faint};text-align:center;">
      You are receiving this because you contacted ${esc(profile.name)} through ${esc(profile.socials.find((s) => s.id === "website")?.href ?? "the portfolio")}.<br />
      &copy; ${year} ${esc(profile.name)}. All rights reserved.
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
