import type { Metadata } from "next";
import { ExperienceSection } from "@/components/ExperienceSection";
export const metadata: Metadata = { title: "Experience", description: "Career timeline for Rabin R." };
export default function Page() { return <ExperienceSection />; }
