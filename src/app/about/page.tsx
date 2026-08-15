import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rabin R — the engineer behind the interface. The story, the path and the thinking behind 4+ years of frontend engineering for government and enterprise clients.",
};

export default function Page() {
  return <AboutPage />;
}