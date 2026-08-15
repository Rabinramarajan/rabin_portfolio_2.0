import type { Metadata } from "next";
import { WorkPage } from "@/components/pages/WorkPage";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected work by Rabin R — Fiji immigration platforms, pension portals, mobile apps and insurance consoles built for real products in production.",
};

export default function Page() {
  return <WorkPage />;
}