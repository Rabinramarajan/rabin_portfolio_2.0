import type { Metadata } from "next";
import { ExperiencePage } from "@/components/pages/ExperiencePage";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "The evolution of an engineer — Rabin R's career architecture from first builds in 2021 to Angular consulting and AI-driven analytics in 2026, for government and enterprise clients across three countries.",
  alternates: { canonical: "/experience" },
};

export default function Page() {
  return <ExperiencePage />;
}