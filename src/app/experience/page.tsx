import type { Metadata } from "next";
import { ExperiencePage } from "@/components/pages/ExperiencePage";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "The career timeline of Rabin R — from first builds in 2021 to consulting on AI-driven analytics in 2026, for government and enterprise clients across three countries.",
};

export default function Page() {
  return <ExperiencePage />;
}