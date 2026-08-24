"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";
import { inquiryFromIntent } from "@/content/contact";

/**
 * Reads `?intent=` on the client so /contact can stay statically rendered.
 *
 * The page used to take `searchParams` as a server prop, which forced the
 * whole route to render on demand for every visitor — paying a server round
 * trip on each load purely to preselect one <select> value. Reading the param
 * here keeps the HTML prerendered at build time; the deep link still works,
 * it is just applied during hydration.
 *
 * `useSearchParams` opts a static route out of prerendering unless it sits
 * under a Suspense boundary, so this component must always be wrapped in one.
 */
export function ContactFormIntent() {
  const intent = useSearchParams().get("intent") ?? undefined;
  const inquiryType = inquiryFromIntent(intent);
  // Remount when the intent changes so the form picks up new defaults.
  return <ContactForm key={inquiryType ?? "open"} defaultInquiryType={inquiryType} />;
}
