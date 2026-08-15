import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/ServicesPage";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Frontend engineering, Angular development, React/Next.js, UI engineering, performance optimization, mobile/Ionic and design systems — from problem to production.",
};

export default function Page() {
  return <ServicesPage />;
}