import type { Metadata } from "next";
import { WorkSection } from "@/components/WorkSection";
export const metadata: Metadata = { title: "Work", description: "Selected Angular and frontend case studies by Rabin R." };
export default function Page() { return <WorkSection />; }
