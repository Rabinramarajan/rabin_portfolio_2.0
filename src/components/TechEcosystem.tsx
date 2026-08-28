"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import { StackTechIcon } from "@/components/StackTechIcon";
import { Monogram } from "@/components/Logo";
import { SectionKicker, type SectionHeadingLevel } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  ArrowRight,
  ArrowUpRight,
  X,
  CheckCircle2,
} from "lucide-react";

/* ------------------------------------------------------------------
   Ecosystem Data Definitions & Coordinates
   SVG ViewBox: 1100 x 740
   Root: (550, 700) -> Trunk: (550, 440) -> 7 Branch Hubs
------------------------------------------------------------------ */

export interface EcoBranch {
  id: string;
  label: string;
  subtitle: string;
  color: string;
  accentRgb: string;
  icon: string;
  hubX: number;
  hubY: number;
  pathD: string;
  description: string;
}

export interface EcoTechNode {
  id: string;
  label: string;
  branchId: string;
  x: number;
  y: number;
  tier?: "core" | "standard";
  specCode: string;
  role: string;
  insight: string;
}

export interface EcoConnection {
  from: string;
  to: string;
  strength: number;
}

export const ECO_BRANCHES: EcoBranch[] = [
  {
    id: "frontend",
    label: "Frontend",
    subtitle: "Modern Reactive UI & Core Systems",
    color: "#C8FF00",
    accentRgb: "200, 255, 0",
    icon: "⚛",
    hubX: 410,
    hubY: 180,
    pathD: "M 550 420 C 550 320, 440 240, 410 180",
    description: "High-performance component architecture, reactive signals, and accessible web systems.",
  },
  {
    id: "mobile",
    label: "Mobile",
    subtitle: "Cross-Platform & Hybrid Apps",
    color: "#38bdf8",
    accentRgb: "56, 189, 248",
    icon: "📱",
    hubX: 710,
    hubY: 180,
    pathD: "M 550 420 C 550 320, 680 240, 710 180",
    description: "Native-bridge mobile solutions, PWAs, and production app store deployments.",
  },
  {
    id: "backend",
    label: "Backend",
    subtitle: "Scalable APIs & Microservices",
    color: "#34d399",
    accentRgb: "52, 211, 153",
    icon: "⚙",
    hubX: 880,
    hubY: 320,
    pathD: "M 550 440 C 660 440, 800 370, 880 320",
    description: "Robust REST & GraphQL services, authentication, and secure business logic.",
  },
  {
    id: "data",
    label: "Data",
    subtitle: "Databases, Cloud & Persistence",
    color: "#fbbf24",
    accentRgb: "251, 191, 36",
    icon: "📊",
    hubX: 860,
    hubY: 530,
    pathD: "M 550 460 C 660 470, 780 520, 860 530",
    description: "Relational modeling, document storage, caching, and real-time syncing.",
  },
  {
    id: "design",
    label: "Design",
    subtitle: "Design Systems & Prototyping",
    color: "#f472b6",
    accentRgb: "244, 114, 182",
    icon: "🎨",
    hubX: 240,
    hubY: 530,
    pathD: "M 550 460 C 440 470, 320 520, 240 530",
    description: "Design-token architecture, component libraries, and interactive prototyping.",
  },
  {
    id: "quality",
    label: "Quality",
    subtitle: "Testing, Reliability & Standards",
    color: "#a78bfa",
    accentRgb: "167, 139, 250",
    icon: "✓",
    hubX: 220,
    hubY: 330,
    pathD: "M 550 440 C 440 440, 300 370, 220 330",
    description: "End-to-end automation, strict linting, unit verification, and WCAG AA accessibility.",
  },
  {
    id: "tooling",
    label: "Tooling",
    subtitle: "DevOps, Workflows & Toolchains",
    color: "#fb923c",
    accentRgb: "251, 146, 60",
    icon: "🔧",
    hubX: 270,
    hubY: 170,
    pathD: "M 550 420 C 480 340, 320 250, 270 170",
    description: "Automated pipelines, containerization, environment parity, and developer ergonomics.",
  },
];

export const ECO_NODES: EcoTechNode[] = [
  /* --- FRONTEND --- */
  {
    id: "angular",
    label: "Angular",
    branchId: "frontend",
    x: 320,
    y: 110,
    tier: "core",
    specCode: "FE-01",
    role: "Primary Enterprise Framework",
    insight: "Standalone components, signals-based reactivity, and micro-frontend scalability.",
  },
  {
    id: "typescript",
    label: "TypeScript",
    branchId: "frontend",
    x: 410,
    y: 75,
    tier: "core",
    specCode: "FE-02",
    role: "Type System & Core Language",
    insight: "Strict type boundaries across all state slices, API contracts, and domain models.",
  },
  {
    id: "react",
    label: "React",
    branchId: "frontend",
    x: 500,
    y: 80,
    tier: "core",
    specCode: "FE-03",
    role: "Component UI Library",
    insight: "Declarative UI rendering, hook architecture, and modular component systems.",
  },
  {
    id: "nextjs",
    label: "Next.js",
    branchId: "frontend",
    x: 520,
    y: 155,
    tier: "core",
    specCode: "FE-04",
    role: "Hybrid SSR & Full-Stack Platform",
    insight: "Server components, streaming layouts, and zero-CLS performance optimization.",
  },
  {
    id: "vuejs",
    label: "Vue.js",
    branchId: "frontend",
    x: 340,
    y: 185,
    tier: "standard",
    specCode: "FE-05",
    role: "Progressive Web Framework",
    insight: "Composition API state workflows and lightweight reactive interface composition.",
  },
  {
    id: "rxjs",
    label: "RxJS",
    branchId: "frontend",
    x: 425,
    y: 145,
    tier: "core",
    specCode: "FE-06",
    role: "Reactive Stream Pipeline",
    insight: "Event orchestration, switchMap cancellation, and websocket data streams.",
  },
  {
    id: "tailwindcss",
    label: "Tailwind CSS",
    branchId: "frontend",
    x: 430,
    y: 225,
    tier: "core",
    specCode: "FE-07",
    role: "Design Token Utility Engine",
    insight: "Custom design systems, dark mode palettes, and zero-runtime CSS footprint.",
  },

  /* --- MOBILE --- */
  {
    id: "ionic",
    label: "Ionic",
    branchId: "mobile",
    x: 640,
    y: 110,
    tier: "core",
    specCode: "MO-01",
    role: "Hybrid Mobile Framework",
    insight: "Cross-platform mobile apps deployed from a unified web codebase.",
  },
  {
    id: "capacitor",
    label: "Capacitor",
    branchId: "mobile",
    x: 730,
    y: 85,
    tier: "core",
    specCode: "MO-02",
    role: "Native Runtime Bridge",
    insight: "Deep device hardware access (Biometrics, Camera, Geolocation, Push Notifications).",
  },
  {
    id: "android",
    label: "Android",
    branchId: "mobile",
    x: 820,
    y: 115,
    tier: "standard",
    specCode: "MO-03",
    role: "Mobile Target Platform",
    insight: "Gradle build configs, Android SDK manifests, and Play Store release automation.",
  },
  {
    id: "pwa",
    label: "PWA",
    branchId: "mobile",
    x: 660,
    y: 185,
    tier: "core",
    specCode: "MO-04",
    role: "Progressive Web Application",
    insight: "Offline caching, background service workers, and installable web experiences.",
  },
  {
    id: "flutter",
    label: "Flutter",
    branchId: "mobile",
    x: 755,
    y: 165,
    tier: "standard",
    specCode: "MO-05",
    role: "Cross-Platform UI Kit",
    insight: "High-frame-rate widget rendering and cross-platform native compilation.",
  },

  /* --- BACKEND --- */
  {
    id: "nodejs",
    label: "Node.js",
    branchId: "backend",
    x: 840,
    y: 250,
    tier: "core",
    specCode: "BE-01",
    role: "Asynchronous JavaScript Runtime",
    insight: "Event-driven backend services, CLI toolkits, and streaming microservices.",
  },
  {
    id: "express",
    label: "Express",
    branchId: "backend",
    x: 935,
    y: 245,
    tier: "core",
    specCode: "BE-02",
    role: "RESTful HTTP Middleware",
    insight: "Clean router architectures, auth token pipelines, and rate-limiting middleware.",
  },
  {
    id: "graphql",
    label: "GraphQL",
    branchId: "backend",
    x: 1005,
    y: 300,
    tier: "standard",
    specCode: "BE-03",
    role: "Typed Schema & Query Layer",
    insight: "Single-roundtrip data resolution, custom resolvers, and type generation.",
  },
  {
    id: "restapi",
    label: "REST API",
    branchId: "backend",
    x: 875,
    y: 355,
    tier: "core",
    specCode: "BE-04",
    role: "Architectural API Standard",
    insight: "Resource-oriented endpoints, HTTP semantics, and OpenAPI contract specs.",
  },
  {
    id: "python",
    label: "Python",
    branchId: "backend",
    x: 965,
    y: 365,
    tier: "standard",
    specCode: "BE-05",
    role: "Scripting & Service Automation",
    insight: "Data manipulation, backend utilities, and AI orchestration scripts.",
  },

  /* --- DATA --- */
  {
    id: "postgresql",
    label: "PostgreSQL",
    branchId: "data",
    x: 790,
    y: 475,
    tier: "core",
    specCode: "DB-01",
    role: "Relational SQL Engine",
    insight: "ACID transactions, JSONB indexing, views, and complex relation integrity.",
  },
  {
    id: "mysql",
    label: "MySQL",
    branchId: "data",
    x: 885,
    y: 465,
    tier: "standard",
    specCode: "DB-02",
    role: "Relational Data Store",
    insight: "High-read performance, structured schema management, and query optimization.",
  },
  {
    id: "mongodb",
    label: "MongoDB",
    branchId: "data",
    x: 975,
    y: 505,
    tier: "standard",
    specCode: "DB-03",
    role: "Document / NoSQL Database",
    insight: "Flexible JSON documents, aggregation pipelines, and rapid prototyping models.",
  },
  {
    id: "supabase",
    label: "Supabase",
    branchId: "data",
    x: 825,
    y: 565,
    tier: "core",
    specCode: "DB-04",
    role: "Real-time Backend & Auth",
    insight: "Row-level security, instant Postgres subscriptions, and auth integration.",
  },
  {
    id: "firebase",
    label: "Firebase",
    branchId: "data",
    x: 920,
    y: 585,
    tier: "standard",
    specCode: "DB-05",
    role: "Real-time Cloud Database",
    insight: "Firestore document listeners, push triggers, and cloud function sync.",
  },

  /* --- DESIGN --- */
  {
    id: "figma",
    label: "Figma",
    branchId: "design",
    x: 165,
    y: 480,
    tier: "core",
    specCode: "DS-01",
    role: "Interface Design & Design Systems",
    insight: "Auto-layout components, variant design tokens, and precise developer specs.",
  },
  {
    id: "adobexd",
    label: "Adobe XD",
    branchId: "design",
    x: 255,
    y: 470,
    tier: "standard",
    specCode: "DS-02",
    role: "UI/UX Wireframing",
    insight: "Interactive prototype flows, vector artwork, and client design reviews.",
  },
  {
    id: "illustrator",
    label: "Illustrator",
    branchId: "design",
    x: 145,
    y: 565,
    tier: "standard",
    specCode: "DS-03",
    role: "Vector Graphics & Iconography",
    insight: "Scalable SVG asset creation, custom logos, and geometric brand illustrations.",
  },
  {
    id: "photoshop",
    label: "Photoshop",
    branchId: "design",
    x: 235,
    y: 575,
    tier: "standard",
    specCode: "DS-04",
    role: "Image Processing & Compositing",
    insight: "High-resolution asset optimization, texture rendering, and mock visuals.",
  },

  /* --- QUALITY --- */
  {
    id: "jest",
    label: "Jest",
    branchId: "quality",
    x: 120,
    y: 275,
    tier: "core",
    specCode: "QA-01",
    role: "Unit Testing & Assertion Suite",
    insight: "Automated regression suites, snapshot testing, and isolated mock services.",
  },
  {
    id: "playwright",
    label: "Playwright",
    branchId: "quality",
    x: 215,
    y: 255,
    tier: "core",
    specCode: "QA-02",
    role: "End-to-End Browser Automation",
    insight: "Cross-browser test execution, CI smoke tests, and user-flow verification.",
  },
  {
    id: "eslint",
    label: "ESLint",
    branchId: "quality",
    x: 105,
    y: 355,
    tier: "core",
    specCode: "QA-03",
    role: "Static Analysis & Code Quality",
    insight: "Strict linting rules, architectural boundaries, and syntax enforcement.",
  },
  {
    id: "prettier",
    label: "Prettier",
    branchId: "quality",
    x: 185,
    y: 375,
    tier: "standard",
    specCode: "QA-04",
    role: "Automated Code Formatting",
    insight: "Consistent codebase styling across multi-developer repositories.",
  },
  {
    id: "wcag",
    label: "WCAG",
    branchId: "quality",
    x: 275,
    y: 345,
    tier: "core",
    specCode: "QA-05",
    role: "Accessibility Standard (AA)",
    insight: "Semantic HTML, ARIA landmarks, keyboard traps, and contrast compliance.",
  },

  /* --- TOOLING --- */
  {
    id: "git",
    label: "Git",
    branchId: "tooling",
    x: 135,
    y: 165,
    tier: "core",
    specCode: "TL-01",
    role: "Distributed Version Control",
    insight: "Trunk-based branch workflows, clean rebasing, and atomic commit histories.",
  },
  {
    id: "github",
    label: "GitHub",
    branchId: "tooling",
    x: 210,
    y: 115,
    tier: "core",
    specCode: "TL-02",
    role: "CI/CD & Repository Management",
    insight: "Automated GitHub Actions pipelines, PR code reviews, and issue tracking.",
  },
  {
    id: "postman",
    label: "Postman",
    branchId: "tooling",
    x: 215,
    y: 215,
    tier: "core",
    specCode: "TL-03",
    role: "API Testing & Documentation",
    insight: "Environment collections, auth token automation, and endpoint mock servers.",
  },
  {
    id: "vscode",
    label: "VS Code",
    branchId: "tooling",
    x: 300,
    y: 195,
    tier: "core",
    specCode: "TL-04",
    role: "Primary IDE & Tooling Environment",
    insight: "High-productivity editor setup with customized snippets and debugging hooks.",
  },
];

/* ------------------------------------------------------------------
   Connection builder: co-occurrences in real projects & experience
------------------------------------------------------------------ */

function buildSynergyConnections(): EcoConnection[] {
  const pairStrength = new Map<string, number>();

  for (const project of projects) {
    const techs = project.technologies ?? [];
    for (let i = 0; i < techs.length; i++) {
      for (let j = i + 1; j < techs.length; j++) {
        const key = [techs[i], techs[j]].sort().join("|||");
        pairStrength.set(key, (pairStrength.get(key) ?? 0) + 1);
      }
    }
  }

  for (const exp of experience) {
    const techs = exp.technologies ?? [];
    for (let i = 0; i < techs.length; i++) {
      for (let j = i + 1; j < techs.length; j++) {
        const key = [techs[i], techs[j]].sort().join("|||");
        pairStrength.set(key, (pairStrength.get(key) ?? 0) + 1);
      }
    }
  }

  const connections: EcoConnection[] = [];
  for (const [key, strength] of pairStrength) {
    const [from, to] = key.split("|||");
    connections.push({ from, to, strength });
  }
  return connections;
}

/* ------------------------------------------------------------------
   Category Filter Pill Bar
------------------------------------------------------------------ */

function CategoryFilterBar({
  activeBranch,
  onSelectBranch,
  totalCount,
}: {
  activeBranch: string | null;
  onSelectBranch: (id: string | null) => void;
  totalCount: number;
}) {
  return (
    <div className="eco__filter-bar" role="tablist" aria-label="Ecosystem categories">
      <button
        type="button"
        role="tab"
        aria-selected={activeBranch === null}
        className={cn("eco__filter-pill", activeBranch === null && "eco__filter-pill--active")}
        onClick={() => onSelectBranch(null)}
        data-cursor="explore"
      >
        <span className="eco__pill-spark">✦</span>
        <span>All Technologies</span>
        <span className="eco__pill-badge">{totalCount}</span>
      </button>

      {ECO_BRANCHES.map((b) => {
        const count = ECO_NODES.filter((n) => n.branchId === b.id).length;
        const isActive = activeBranch === b.id;

        return (
          <button
            key={b.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn("eco__filter-pill", isActive && "eco__filter-pill--active")}
            onClick={() => onSelectBranch(isActive ? null : b.id)}
            data-cursor="explore"
          >
            <span className="eco__pill-icon">{b.icon}</span>
            <span>{b.label}</span>
            <span className="eco__pill-badge">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------
   Digital Tree SVG Visualization
------------------------------------------------------------------ */

function DigitalTreeCanvas({
  activeBranch,
  selectedTech,
  onSelectTech,
}: {
  activeBranch: string | null;
  selectedTech: EcoTechNode | null;
  onSelectTech: (tech: EcoTechNode | null) => void;
}) {
  const connections = useMemo(() => buildSynergyConnections(), []);

  // Compute related technologies based on active selection
  const relatedTechIds = useMemo(() => {
    if (!selectedTech) return new Set<string>();
    const selId = selectedTech.id.toLowerCase();
    const selLabel = selectedTech.label.toLowerCase();
    const related = new Set<string>([selId, selLabel]);

    // Add branch siblings
    for (const n of ECO_NODES) {
      if (n.branchId === selectedTech.branchId) {
        related.add(n.id.toLowerCase());
        related.add(n.label.toLowerCase());
      }
    }

    // Add project & experience co-occurrences
    for (const c of connections) {
      const fromLower = c.from.toLowerCase();
      const toLower = c.to.toLowerCase();
      if (fromLower === selId || fromLower === selLabel) {
        related.add(toLower);
      }
      if (toLower === selId || toLower === selLabel) {
        related.add(fromLower);
      }
    }
    return related;
  }, [selectedTech, connections]);

  // Determine active branch highlight
  const highlightedBranchId = selectedTech ? selectedTech.branchId : activeBranch;

  return (
    <div className="eco__canvas-wrap">
      <svg
        className="eco__tree-svg"
        viewBox="0 0 1100 740"
        aria-label="Interactive Software Engineering Tree and Technology Ecosystem"
        role="img"
      >
        <defs>
          {/* Radial Center Developer Nucleus Atmosphere */}
          <radialGradient id="devCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8FF00" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#14b8a6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0F1117" stopOpacity="0" />
          </radialGradient>

          {/* Root Foundation Glow */}
          <linearGradient id="rootFoundationGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#C8FF00" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#C8FF00" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Trunk Energy Gradient */}
          <linearGradient id="trunkEnergyGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#C8FF00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C8FF00" stopOpacity="1" />
          </linearGradient>

          {/* Electric Signal Glow Filter */}
          <filter id="electricGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Active Node Halo */}
          <filter id="nodeHalo" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Orbital Coordinates & Technical Grid Lines */}
        <g className="eco__ambient-grid" opacity="0.35">
          <circle cx="550" cy="440" r="380" className="eco__orbital-ring" strokeDasharray="3 9" />
          <circle cx="550" cy="440" r="260" className="eco__orbital-ring" strokeDasharray="2 6" />
          <circle cx="550" cy="440" r="140" className="eco__orbital-ring eco__orbital-ring--inner" />

          {/* Crosshair guidelines */}
          <line x1="550" y1="60" x2="550" y2="720" className="eco__crosshair" strokeDasharray="2 8" />
          <line x1="100" y1="440" x2="1000" y2="440" className="eco__crosshair" strokeDasharray="2 8" />
        </g>

        {/* ============================================================
           ROOT STRUCTURE — ENGINEERING FOUNDATION
           ============================================================ */}
        <g className="eco__roots-group">
          {/* Foundation Ground Arc & Aura */}
          <path
            d="M 280 710 Q 550 675 820 710"
            className="eco__root-ground"
            stroke="url(#rootFoundationGrad)"
            strokeWidth="4"
            fill="none"
          />

          {/* Splaying Root Feeder Circuits */}
          <path d="M 550 685 C 510 695, 380 705, 300 715" className="eco__root-feeder" />
          <path d="M 550 685 C 480 690, 420 700, 370 715" className="eco__root-feeder" />
          <path d="M 550 685 C 530 695, 480 710, 450 720" className="eco__root-feeder" />

          <path d="M 550 685 C 570 695, 620 710, 650 720" className="eco__root-feeder" />
          <path d="M 550 685 C 620 690, 680 700, 730 715" className="eco__root-feeder" />
          <path d="M 550 685 C 590 695, 720 705, 800 715" className="eco__root-feeder" />

          {/* Root Core Pedestal */}
          <g transform="translate(550, 695)">
            <rect
              x="-110"
              y="-14"
              width="220"
              height="28"
              rx="14"
              className="eco__root-badge-bg"
            />
            <text
              x="0"
              y="1"
              textAnchor="middle"
              dominantBaseline="middle"
              className="eco__root-badge-text"
            >
              ENGINEERING FOUNDATION
            </text>
            <circle cx="-85" cy="0" r="3" className="eco__root-dot" />
            <circle cx="85" cy="0" r="3" className="eco__root-dot" />
          </g>
        </g>

        {/* ============================================================
           MAIN TRUNK — CONNECTING ROOTS TO CENTRAL NUCLEUS
           ============================================================ */}
        <g className="eco__trunk-group">
          {/* Trunk Multi-Strand Circuit Lines */}
          <path d="M 545 680 L 545 440" className="eco__trunk-line" />
          <path d="M 550 680 L 550 440" className="eco__trunk-line eco__trunk-line--center" />
          <path d="M 555 680 L 555 440" className="eco__trunk-line" />

          {/* Animated Signal Pulses travelling up trunk */}
          <line
            x1="550"
            y1="680"
            x2="550"
            y2="440"
            className="eco__trunk-pulse"
            stroke="url(#trunkEnergyGrad)"
          />
        </g>

        {/* ============================================================
           7 MAIN TECHNICAL BRANCHES (CURVED BEZIER HIGHWAYS)
           ============================================================ */}
        <g className="eco__branches-group">
          {ECO_BRANCHES.map((branch) => {
            const isBranchHighlighted = highlightedBranchId === branch.id;
            const isBranchDimmed = highlightedBranchId !== null && !isBranchHighlighted;

            return (
              <g
                key={branch.id}
                className={cn(
                  "eco__branch",
                  isBranchHighlighted && "eco__branch--highlighted",
                  isBranchDimmed && "eco__branch--dimmed",
                )}
              >
                {/* Branch Glow Path */}
                <path
                  d={branch.pathD}
                  className="eco__branch-glow"
                  stroke={branch.color}
                />

                {/* Primary Branch Circuit Trace */}
                <path
                  d={branch.pathD}
                  className="eco__branch-path"
                  stroke={branch.color}
                />

                {/* Animated Electric Signal Packet */}
                <path
                  d={branch.pathD}
                  className="eco__branch-signal"
                  stroke={branch.color}
                  filter="url(#electricGlow)"
                />

                {/* Branch Hub Junction Terminal */}
                <g
                  transform={`translate(${branch.hubX}, ${branch.hubY})`}
                  className="eco__branch-hub"
                >
                  <circle
                    r={isBranchHighlighted ? 14 : 9}
                    className="eco__branch-hub-ring"
                    stroke={branch.color}
                  />
                  <circle
                    r="4"
                    className="eco__branch-hub-core"
                    fill={branch.color}
                  />

                  {/* Branch Name Label Tag */}
                  <g
                    transform="translate(0, -18)"
                    className="eco__branch-tag"
                  >
                    <rect
                      x="-48"
                      y="-9"
                      width="96"
                      height="18"
                      rx="9"
                      className="eco__branch-tag-bg"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="eco__branch-tag-text"
                    >
                      {branch.label.toUpperCase()}
                    </text>
                  </g>
                </g>
              </g>
            );
          })}
        </g>

        {/* ============================================================
           BRANCH TO NODE SUB-CONNECTOR STRANDS
           ============================================================ */}
        <g className="eco__sub-connectors">
          {ECO_NODES.map((node) => {
            const branch = ECO_BRANCHES.find((b) => b.id === node.branchId);
            if (!branch) return null;

            const isSelected = selectedTech?.id === node.id;
            const isBranchActive = highlightedBranchId === node.branchId;
            const isDimmed = highlightedBranchId !== null && !isBranchActive;

            // Curved bezier from branch hub to node
            const midX = (branch.hubX + node.x) / 2;
            const midY = (branch.hubY + node.y) / 2 - 8;
            const strandD = `M ${branch.hubX} ${branch.hubY} Q ${midX} ${midY} ${node.x} ${node.y}`;

            return (
              <g
                key={`strand-${node.id}`}
                className={cn(
                  "eco__node-strand",
                  isBranchActive && "eco__node-strand--active",
                  isSelected && "eco__node-strand--selected",
                  isDimmed && "eco__node-strand--dimmed",
                )}
              >
                <path
                  d={strandD}
                  className="eco__strand-path"
                  stroke={branch.color}
                />
                {isSelected && (
                  <path
                    d={strandD}
                    className="eco__strand-pulse"
                    stroke={branch.color}
                    filter="url(#electricGlow)"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* ============================================================
           CENTER DEVELOPER "R" MONOGRAM NUCLEUS
           ============================================================ */}
        <g transform="translate(550, 440)" className="eco__nucleus-group">
          {/* Subtle Ambient Atmosphere */}
          <circle r="95" fill="url(#devCenterGlow)" />

          {/* Concentric Technical Rings */}
          <circle r="44" className="eco__nucleus-ring eco__nucleus-ring--outer" />
          <circle r="36" className="eco__nucleus-ring eco__nucleus-ring--mid" />
          <circle r="26" className="eco__nucleus-core-disc" />

          {/* Subtle Developer "R" Monogram */}
          <text
            x="0"
            y="2"
            textAnchor="middle"
            dominantBaseline="middle"
            className="eco__nucleus-r-mark"
          >
            R
          </text>

          {/* Core Indicator Label */}
          <g transform="translate(0, 52)">
            <rect
              x="-46"
              y="-8"
              width="92"
              height="16"
              rx="8"
              className="eco__nucleus-label-bg"
            />
            <text
              x="0"
              y="1"
              textAnchor="middle"
              dominantBaseline="middle"
              className="eco__nucleus-label-text"
            >
              CORE ARCHITECT
            </text>
          </g>
        </g>

        {/* ============================================================
           INTERACTIVE TECHNOLOGY NODES
           ============================================================ */}
        <g className="eco__nodes-layer">
          {ECO_NODES.map((node) => {
            const branch = ECO_BRANCHES.find((b) => b.id === node.branchId);
            const isSelected = selectedTech?.id === node.id;
            const isRelated =
              selectedTech &&
              !isSelected &&
              (relatedTechIds.has(node.id.toLowerCase()) ||
                relatedTechIds.has(node.label.toLowerCase()));
            const isBranchActive = highlightedBranchId === node.branchId;
            const isDimmed =
              highlightedBranchId !== null &&
              !isBranchActive &&
              !isSelected &&
              !isRelated;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className={cn(
                  "eco__node-item",
                  isSelected && "eco__node-item--selected",
                  isRelated && "eco__node-item--related",
                  isDimmed && "eco__node-item--dimmed",
                  isBranchActive && "eco__node-item--branch-active",
                )}
                onClick={() => onSelectTech(isSelected ? null : node)}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${node.label} (${branch?.label})`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectTech(isSelected ? null : node);
                  }
                }}
                data-cursor="explore"
                data-cursor-label="EXPLORE"
              >
                {/* Aura Disc on Explore / Hover */}
                {(isSelected || isRelated) && (
                  <circle
                    r={isSelected ? 32 : 24}
                    className="eco__node-aura"
                    filter="url(#nodeHalo)"
                    stroke={branch?.color ?? "#C8FF00"}
                  />
                )}

                {/* Node Outer Disc */}
                <circle
                  r={isSelected ? 22 : 16}
                  className="eco__node-disc"
                  stroke={isSelected ? "#C8FF00" : branch?.color ?? "var(--color-line-strong)"}
                />

                {/* Node Brand Icon (via StackTechIcon) */}
                <foreignObject
                  x={isSelected ? -13 : -10}
                  y={isSelected ? -13 : -10}
                  width={isSelected ? 26 : 20}
                  height={isSelected ? 26 : 20}
                  className="eco__node-icon-foreign"
                >
                  <StackTechIcon label={node.label} />
                </foreignObject>

                {/* Technology Label */}
                <text
                  y={isSelected ? 34 : 26}
                  textAnchor="middle"
                  className="eco__node-text"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------
   Digital Sticky Note Cluster (Explore Mode)
   Sophisticated engineering sticky notes with folded corners,
   charcoal glass surfaces, electric-lime accents, and project synergies.
------------------------------------------------------------------ */

function ExploreStickyNotesMode({
  tech,
  onSelectTech,
  onClose,
  reduce,
}: {
  tech: EcoTechNode;
  onSelectTech: (id: string) => void;
  onClose: () => void;
  reduce: boolean;
}) {
  const branch = ECO_BRANCHES.find((b) => b.id === tech.branchId);
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const TOTAL_NOTES = 4;

  // Projects delivered with this technology
  const deliveredProjects = useMemo(() => {
    const term = tech.id.toLowerCase();
    const labelTerm = tech.label.toLowerCase();
    return projects.filter((p) =>
      p.technologies?.some(
        (t) => t.toLowerCase() === term || t.toLowerCase() === labelTerm,
      ),
    );
  }, [tech]);

  // Experience roles applied with this technology
  const appliedExperience = useMemo(() => {
    const term = tech.id.toLowerCase();
    const labelTerm = tech.label.toLowerCase();
    return experience.filter((e) =>
      e.technologies?.some(
        (t) => t.toLowerCase() === term || t.toLowerCase() === labelTerm,
      ),
    );
  }, [tech]);

  // Frequently paired technologies (companion stack)
  const pairedTechs = useMemo(() => {
    const branchSiblings = ECO_NODES.filter(
      (n) => n.branchId === tech.branchId && n.id !== tech.id,
    ).slice(0, 4);

    return branchSiblings;
  }, [tech]);

  // Track which note is in view using IntersectionObserver
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const noteElements = document.querySelectorAll(".eco__note-card");
    if (!noteElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) {
          const index = Array.from(noteElements).indexOf(visible.target as Element);
          if (index !== -1) {
            setActiveNoteIndex(index);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    noteElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="eco__explore-overlay"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: reduce ? 0.15 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Floating Control Bar */}
      <div className="eco__explore-header">
        <div className="eco__explore-identity">
          <span className="eco__explore-indicator" />
          <span className="eco__explore-branch-tag">
            {branch?.icon} {branch?.label.toUpperCase()} ARCHITECTURE
          </span>
          <span className="eco__explore-spec">{tech.specCode}</span>
        </div>

        <div className="eco__explore-progress" aria-hidden>
          <span className="eco__progress-counter">
            {String(activeNoteIndex + 1).padStart(2, "0")} / {String(TOTAL_NOTES).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          className="eco__explore-close-btn"
          onClick={onClose}
          aria-label="Back to ecosystem"
          data-cursor="explore"
        >
          <X size={15} />
          <span>Back to Ecosystem</span>
        </button>
      </div>

      {/* Organic Cluster of Digital Sticky Notes */}
      <div className="eco__notes-cluster">
        {/* ============================================================
           NOTE 1: ARCHITECTURAL SPECIFICATION & CORE ROLE (Angle: -2.5°)
           ============================================================ */}
        <motion.div
          className="eco__note-card eco__note-card--primary"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: -4, y: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: -2.5, y: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.4, delay: 0.05 }}
        >
          {/* Folded Corner Detail */}
          <div className="eco__note-dogear" aria-hidden="true" />
          <div className="eco__note-pin" aria-hidden="true">
            <span className="eco__note-pin-dot" />
          </div>

          <div className="eco__note-head">
            <div className="eco__note-icon-box">
              <StackTechIcon label={tech.label} />
            </div>
            <div>
              <div className="eco__note-kicker">{tech.specCode} · CORE STACK</div>
              <h3 className="eco__note-title">{tech.label}</h3>
              <p className="eco__note-role">{tech.role}</p>
            </div>
          </div>

          <div className="eco__note-body">
            <div className="eco__note-memo">
              <span className="eco__memo-quote">“</span>
              <p className="eco__memo-text">{tech.insight}</p>
            </div>

            <div className="eco__note-divider" />

            <div className="eco__note-meta-row">
              <div className="eco__meta-item">
                <span className="eco__meta-label">Domain</span>
                <span className="eco__meta-val">{branch?.label}</span>
              </div>
              <div className="eco__meta-item">
                <span className="eco__meta-label">Tier</span>
                <span className="eco__meta-val">{tech.tier === "core" ? "Primary Core" : "Active Specialization"}</span>
              </div>
            </div>
          </div>

          <div className="eco__note-footer">
            <span className="eco__verified-badge">
              <CheckCircle2 size={13} className="eco__badge-check" />
              Verified in Production
            </span>
            <span className="eco__handwriting-sign">Rabin R.</span>
          </div>
        </motion.div>

        {/* ============================================================
           NOTE 2: PROJECTS DELIVERED & CODEBASES (Angle: +2°)
           ============================================================ */}
        <motion.div
          className="eco__note-card eco__note-card--projects"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: 4, y: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: 2, y: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.4, delay: 0.1 }}
        >
          <div className="eco__note-dogear" aria-hidden="true" />
          <div className="eco__note-pin" aria-hidden="true">
            <span className="eco__note-pin-dot" />
          </div>

          <div className="eco__note-head">
            <div>
              <div className="eco__note-kicker">PRODUCTION DELIVERIES</div>
              <h4 className="eco__note-section-title">
                Verified Projects ({deliveredProjects.length})
              </h4>
            </div>
          </div>

          <div className="eco__note-body">
            {deliveredProjects.length > 0 ? (
              <ul className="eco__project-checklist">
                {deliveredProjects.slice(0, 3).map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/work/${p.slug}`}
                      className="eco__project-link"
                      data-cursor="explore"
                    >
                      <div className="eco__project-info">
                        <span className="eco__project-bullet">▪</span>
                        <div>
                          <strong className="eco__project-title">{p.title}</strong>
                          <span className="eco__project-summary">{p.tagline ?? p.overview}</span>
                        </div>
                      </div>
                      <ArrowUpRight size={14} className="eco__project-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="eco__empty-projects">
                <p className="eco__empty-text">
                  Applied across internal platform engineering, client modules, and design system foundations.
                </p>
                <Link href="/work" className="eco__view-all-work-btn" data-cursor="explore">
                  <span>Browse Full Portfolio</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>

          <div className="eco__note-footer">
            <span className="eco__note-mono-stamp">#PORTFOLIO-REF-01</span>
          </div>
        </motion.div>

        {/* ============================================================
           NOTE 3: CAREER EXPERIENCE & APPLICATION (Angle: -1.2°)
           ============================================================ */}
        <motion.div
          className="eco__note-card eco__note-card--experience"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: -3, y: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: -1.2, y: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.4, delay: 0.15 }}
        >
          <div className="eco__note-dogear" aria-hidden="true" />
          <div className="eco__note-pin" aria-hidden="true">
            <span className="eco__note-pin-dot" />
          </div>

          <div className="eco__note-head">
            <div>
              <div className="eco__note-kicker">INDUSTRY TRACK RECORD</div>
              <h4 className="eco__note-section-title">
                Career Application ({appliedExperience.length})
              </h4>
            </div>
          </div>

          <div className="eco__note-body">
            {appliedExperience.length > 0 ? (
              <ul className="eco__exp-list">
                {appliedExperience.map((exp) => (
                  <li key={exp.id}>
                    <Link
                      href="/experience#journey"
                      className="eco__exp-item"
                      data-cursor="explore"
                    >
                      <div className="eco__exp-badge">
                        <span className="eco__exp-company">{exp.company}</span>
                        <span className="eco__exp-role">{exp.role}</span>
                      </div>
                      <ArrowRight size={13} className="eco__exp-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="eco__exp-fallback">
                <p className="eco__exp-fallback-text">
                  Leveraged extensively in high-concurrency client engagements and frontend architecture reviews.
                </p>
                <Link href="/experience" className="eco__view-all-work-btn" data-cursor="explore">
                  <span>View Career Journey</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>

          <div className="eco__note-footer">
            <span className="eco__note-mono-stamp">#CAREER-EXP-TRACK</span>
          </div>
        </motion.div>

        {/* ============================================================
           NOTE 4: STACK SYNERGIES & PAIRED TOOLS (Angle: +3.5°)
           ============================================================ */}
        <motion.div
          className="eco__note-card eco__note-card--synergy"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: 5, y: 20 }}
          animate={{ opacity: 1, scale: 1, rotate: 3.5, y: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.4, delay: 0.2 }}
        >
          <div className="eco__note-dogear" aria-hidden="true" />
          <div className="eco__note-pin" aria-hidden="true">
            <span className="eco__note-pin-dot" />
          </div>

          <div className="eco__note-head">
            <div>
              <div className="eco__note-kicker">STACK SYNERGIES</div>
              <h4 className="eco__note-section-title">Companion Technologies</h4>
            </div>
          </div>

          <div className="eco__note-body">
            <p className="eco__synergy-lede">
              Seamlessly connected with sibling branch layers in full-stack solutions:
            </p>

            <div className="eco__companion-chips-grid">
              {pairedTechs.map((companion) => (
                <button
                  key={companion.id}
                  type="button"
                  className="eco__companion-chip"
                  onClick={() => onSelectTech(companion.id)}
                  data-cursor="explore"
                >
                  <StackTechIcon label={companion.label} className="eco__chip-icon" />
                  <span className="eco__chip-label">{companion.label}</span>
                  <span className="eco__chip-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="eco__note-footer">
            <span className="eco__note-hint">Click chip to explore synergy</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   Mobile Architecture Deck (Reflow for <960px)
   Vertical stacked branches + horizontal sticky note cards
------------------------------------------------------------------ */

function MobileEcosystemDeck({
  activeBranch,
  selectedTech,
  onSelectTech,
  onSelectBranch,
}: {
  activeBranch: string | null;
  selectedTech: EcoTechNode | null;
  onSelectTech: (tech: EcoTechNode | null) => void;
  onSelectBranch: (id: string | null) => void;
}) {
  return (
    <div className="eco__mobile-deck">
      {/* Central Identity Monogram Banner */}
      <div className="eco__mobile-nucleus-banner">
        <div className="eco__mobile-r-mark">
          <Monogram className="eco__mobile-mark-svg" />
        </div>
        <div>
          <span className="eco__mobile-kicker">DIGITAL ARCHITECTURE</span>
          <h3 className="eco__mobile-tree-title">Engineering Knowledge Tree</h3>
        </div>
      </div>

      {/* Branches Accordion / Vertical Tracks */}
      <div className="eco__mobile-branches-list">
        {ECO_BRANCHES.map((branch) => {
          const branchNodes = ECO_NODES.filter((n) => n.branchId === branch.id);
          const isExpanded = activeBranch === branch.id || activeBranch === null;

          return (
            <div key={branch.id} className="eco__mobile-branch-card">
              <button
                type="button"
                className="eco__mobile-branch-head"
                onClick={() => onSelectBranch(activeBranch === branch.id ? null : branch.id)}
                data-cursor="explore"
              >
                <div className="eco__mobile-branch-title-wrap">
                  <span className="eco__mobile-branch-icon">{branch.icon}</span>
                  <span className="eco__mobile-branch-name">{branch.label}</span>
                  <span className="eco__mobile-branch-count">{branchNodes.length}</span>
                </div>
                <span className="eco__mobile-branch-toggle">
                  {isExpanded ? "−" : "+"}
                </span>
              </button>

              {isExpanded && (
                <div className="eco__mobile-nodes-flex">
                  {branchNodes.map((node) => {
                    const isSelected = selectedTech?.id === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        className={cn(
                          "eco__mobile-node-btn",
                          isSelected && "eco__mobile-node-btn--active",
                        )}
                        onClick={() => onSelectTech(isSelected ? null : node)}
                        data-cursor="explore"
                      >
                        <StackTechIcon label={node.label} className="eco__mobile-node-icon" />
                        <span className="eco__mobile-node-name">{node.label}</span>
                        {isSelected && <span className="eco__mobile-active-dot" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   TechEcosystem — Main Section Export
------------------------------------------------------------------ */

export function TechEcosystem({
  headingLevel = "h2",
}: {
  headingLevel?: SectionHeadingLevel;
} = {}) {
  const reduce = useReducedMotion();
  const Heading = headingLevel;

  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<EcoTechNode | null>(null);

  const totalCount = ECO_NODES.length;

  const handleSelectTech = useCallback((tech: EcoTechNode | null) => {
    setSelectedTech(tech);
    if (tech) {
      setActiveBranch(tech.branchId);
    }
  }, []);

  const handleSelectTechById = useCallback((id: string) => {
    const target = ECO_NODES.find((n) => n.id.toLowerCase() === id.toLowerCase());
    if (target) {
      setSelectedTech(target);
      setActiveBranch(target.branchId);
    }
  }, []);

  const handleSelectBranch = useCallback((branchId: string | null) => {
    setActiveBranch(branchId);
    if (branchId === null) {
      setSelectedTech(null);
    }
  }, []);

  // Keyboard shortcut: Escape to exit explore mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedTech) {
        setSelectedTech(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTech]);

  const fade = reduce ? { opacity: 0 } : { opacity: 0, y: 20 };
  const inView = { opacity: 1, y: 0 };
  const viewport = { once: true, margin: "-10%" } as const;
  const enter = { duration: reduce ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  return (
    <section id="technology-ecosystem" className="eco" aria-label="Technology Ecosystem">
      {/* Section Header */}
      <motion.header
        className="eco__header"
        initial={fade}
        whileInView={inView}
        viewport={viewport}
        transition={enter}
      >
        <SectionKicker index="05" label="Technology Ecosystem" />
        <Heading className="eco__title">
          Explore the <em>ecosystem.</em>
        </Heading>
        <p className="eco__lede">
          Select a technology to explore how it connects, where it fits, and what I&apos;ve built with it.
        </p>
      </motion.header>

      {/* Category Filter Pills Bar */}
      <motion.div
        className="eco__controls-row"
        initial={fade}
        whileInView={inView}
        viewport={viewport}
        transition={{ ...enter, delay: 0.1 }}
      >
        <CategoryFilterBar
          activeBranch={activeBranch}
          onSelectBranch={handleSelectBranch}
          totalCount={totalCount}
        />
      </motion.div>

      {/* Main Interactive Ecosystem Tree Area */}
      <motion.div
        className="eco__stage-container"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{ duration: reduce ? 0.15 : 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        {/* Desktop Interactive SVG Tree */}
        <DigitalTreeCanvas
          activeBranch={activeBranch}
          selectedTech={selectedTech}
          onSelectTech={handleSelectTech}
        />

        {/* Mobile Reflow Vertical Tree Deck (Hidden >= 960px) */}
        <MobileEcosystemDeck
          activeBranch={activeBranch}
          selectedTech={selectedTech}
          onSelectTech={handleSelectTech}
          onSelectBranch={handleSelectBranch}
        />

        {/* Digital Sticky Notes Explore Mode Overlay */}
        <AnimatePresence>
          {selectedTech && (
            <ExploreStickyNotesMode
              tech={selectedTech}
              onSelectTech={handleSelectTechById}
              onClose={() => setSelectedTech(null)}
              reduce={Boolean(reduce)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
