import { profile } from "@/content/profile";
import { services } from "@/content/services";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";

const choices = [
  { id: "frontend", label: "Frontend Development" },
  { id: "angular", label: "Angular Development" },
  { id: "react", label: "React / Next.js" },
  { id: "ui", label: "UI Engineering" },
  { id: "performance", label: "Performance" },
  { id: "hire", label: "Hire Rabin" },
];

export function approvedContext() {
  return {
    profile,
    services: services.map((s) => ({ title: s.title, proposition: s.proposition })),
    projects: projects.map((p) => ({ title: p.title, tagline: p.tagline, year: p.year, role: p.role })),
    experience: experience.map((e) => ({ company: e.company, role: e.role, start: e.start, end: e.end ?? "Present" })),
  };
}

export function answerFromChoice(id: string) {
  if (id === "frontend")
    return {
      title: "Frontend Development",
      body: services
        .filter((s) => ["angular", "frontend", "react"].includes(s.id))
        .map((s) => s.title + ": " + s.proposition)
        .join(" "),
      projects: projects.slice(0, 3).map((p) => p.title),
      choices,
    };
  if (id === "angular")
    return {
      title: "Angular Development",
      body: services.find((s) => s.id === "angular")?.proposition,
      projects: projects.filter((p) => p.technologies.includes("Angular")).slice(0, 3).map((p) => p.title),
      choices,
    };
  if (id === "react")
    return {
      title: "React / Next.js",
      body: services.find((s) => s.id === "react")?.proposition,
      projects: [],
      choices,
    };
  if (id === "mobile")
    return {
      title: "Mobile / Ionic",
      body: services.find((s) => s.id === "ionic")?.proposition,
      projects: projects.filter((p) => p.slug === "vnpf-blo-mi").map((p) => p.title),
      choices,
    };
  if (id === "ui")
    return { title: "UI Engineering", body: services.find((s) => s.id === "ui")?.proposition, projects: [], choices };
  if (id === "performance")
    return {
      title: "Performance",
      body: services.find((s) => s.id === "performance")?.proposition,
      projects: ["Fiji Immigration Internal Management System"],
      choices,
    };
  return {
    title: "Hire Rabin",
    body: profile.headlineRole + ". " + profile.availability.label + ". " + profile.availability.responseTime,
    projects: [],
    choices,
  };
}

export const assistantChoices = choices;
