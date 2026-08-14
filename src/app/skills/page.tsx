import type { Metadata } from "next";
import { SkillsSection } from "@/components/SkillsSection";
export const metadata: Metadata = { title: "Skills", description: "Angular, TypeScript, Signals, RxJS and supporting tools." };
export default function Page() { return <SkillsSection />; }
