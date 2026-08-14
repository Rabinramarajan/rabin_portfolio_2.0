import type { Metadata } from "next";
import { ContactPage } from "@/components/ContactPage";
import { services } from "@/content/services";
import { SITE_URL } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a conversation with Rabin R — tell me what you're building and I'll reply within one business day.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: "Contact | Rabin R",
    description: "Start a conversation with Rabin R — tell me what you're building.",
    url: `${SITE_URL}/contact`,
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  const matched = services.find((s) => s.id === intent);
  return <ContactPage defaultProjectType={matched?.title} />;
}