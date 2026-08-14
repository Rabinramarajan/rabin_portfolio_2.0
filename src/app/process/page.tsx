import type { Metadata } from "next";
import { ProcessSection } from "@/components/ProcessSection";
export const metadata: Metadata = { title: "Process", description: "Discover, define, design, build, test, launch and evolve." };
export default function Page() { return <ProcessSection />; }
