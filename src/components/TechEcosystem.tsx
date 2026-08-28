"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import type { SkillGroup } from "@/content/types";
import { StackTechIcon } from "@/components/StackTechIcon";
import { SectionKicker, type SectionHeadingLevel } from "@/components/ui";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------ */

interface EcoNode {
  id: string;
  label: string;
  categoryId: string;
  x: number;
  y: number;
}

interface EcoConnection {
  from: string;
  to: string;
  strength: number;
}

/* ------------------------------------------------------------------
   Data processing — build connection map from project co-occurrence
------------------------------------------------------------------ */

function buildConnectionMap(): EcoConnection[] {
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
    if (strength < 1) continue;
    const [from, to] = key.split("|||");
    connections.push({ from, to, strength });
  }
  return connections;
}

/* ------------------------------------------------------------------
   Node layout — spacious, collision-free cluster coordinates
   Canvas dimensions: 1000 x 620
------------------------------------------------------------------ */

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; color: string; cx: number; cy: number }
> = {
  frontend: { label: "Frontend", icon: "⚛", color: "#61dafb", cx: 340, cy: 145 },
  mobile: { label: "Mobile", icon: "📱", color: "#38bdf8", cx: 770, cy: 135 },
  backend: { label: "Backend", icon: "⚙", color: "#34d399", cx: 810, cy: 335 },
  data: { label: "Data & Cloud", icon: "📊", color: "#fbbf24", cx: 750, cy: 505 },
  design: { label: "Design", icon: "🎨", color: "#f472b6", cx: 410, cy: 510 },
  quality: { label: "Quality", icon: "✓", color: "#a78bfa", cx: 135, cy: 415 },
  tooling: { label: "Tooling", icon: "🔧", color: "#f97316", cx: 125, cy: 195 },
};

function calculatePositions(groups: SkillGroup[]): EcoNode[] {
  const nodes: EcoNode[] = [];

  for (const group of groups) {
    const meta = CATEGORY_META[group.id] ?? { cx: 500, cy: 300, label: group.label };
    const items = group.items;
    const count = items.length;

    if (group.id === "frontend") {
      // 11 items in 3 well-spaced rows
      // Row 1 (4 items): Angular, TypeScript, JavaScript, HTML5
      // Row 2 (4 items): CSS3, Sass, Tailwind CSS, RxJS
      // Row 3 (3 items): Signals, React, Next.js
      const rows = [
        items.slice(0, 4),
        items.slice(4, 8),
        items.slice(8, 11),
      ];
      const rowOffsetsY = [-62, 0, 62];
      rows.forEach((row, rIdx) => {
        const y = meta.cy + rowOffsetsY[rIdx];
        const rowCount = row.length;
        const spacingX = 66;
        const startX = meta.cx - ((rowCount - 1) * spacingX) / 2;
        row.forEach((item, cIdx) => {
          nodes.push({
            id: item,
            label: item,
            categoryId: group.id,
            x: startX + cIdx * spacingX,
            y,
          });
        });
      });
    } else if (count === 6) {
      // 2 rows of 3 items
      const row1 = items.slice(0, 3);
      const row2 = items.slice(3, 6);
      const spacingX = 64;
      const spacingY = 56;
      [row1, row2].forEach((row, rIdx) => {
        const y = meta.cy + (rIdx === 0 ? -spacingY / 2 : spacingY / 2);
        const startX = meta.cx - ((row.length - 1) * spacingX) / 2;
        row.forEach((item, cIdx) => {
          nodes.push({
            id: item,
            label: item,
            categoryId: group.id,
            x: startX + cIdx * spacingX,
            y,
          });
        });
      });
    } else if (count === 4) {
      // 2x2 grid
      const row1 = items.slice(0, 2);
      const row2 = items.slice(2, 4);
      const spacingX = 64;
      const spacingY = 56;
      [row1, row2].forEach((row, rIdx) => {
        const y = meta.cy + (rIdx === 0 ? -spacingY / 2 : spacingY / 2);
        const startX = meta.cx - ((row.length - 1) * spacingX) / 2;
        row.forEach((item, cIdx) => {
          nodes.push({
            id: item,
            label: item,
            categoryId: group.id,
            x: startX + cIdx * spacingX,
            y,
          });
        });
      });
    } else {
      // General arc distribution
      const radius = 55;
      for (let i = 0; i < count; i++) {
        const angle = ((2 * Math.PI) / count) * i - Math.PI / 2;
        nodes.push({
          id: items[i],
          label: items[i],
          categoryId: group.id,
          x: meta.cx + radius * Math.cos(angle),
          y: meta.cy + radius * Math.sin(angle),
        });
      }
    }
  }

  return nodes;
}

/* ------------------------------------------------------------------
   CategorySidebar — left sidebar with category list & count stats
------------------------------------------------------------------ */

function CategorySidebar({
  groups,
  active,
  onSelect,
}: {
  groups: SkillGroup[];
  active: string | null;
  onSelect: (id: string | null) => void;
}) {
  const totalTechs = useMemo(() => groups.reduce((sum, g) => sum + g.items.length, 0), [groups]);

  return (
    <div className="eco__sidebar">
      <div className="eco__sidebar-header">
        <span className="eco__sidebar-kicker">Navigation</span>
        <h3 className="eco__sidebar-title">Categories</h3>
      </div>

      <div className="eco__sidebar-list">
        <button
          type="button"
          className={cn("eco__sidebar-item", active === null && "eco__sidebar-item--active")}
          onClick={() => onSelect(null)}
          data-cursor="explore"
        >
          <span className="eco__sidebar-icon">✦</span>
          <span className="eco__sidebar-label">All Technologies</span>
          <span className="eco__sidebar-count">{totalTechs}</span>
        </button>

        {groups.map((group) => {
          const meta = CATEGORY_META[group.id];
          return (
            <motion.button
              key={group.id}
              className={cn("eco__sidebar-item", active === group.id && "eco__sidebar-item--active")}
              onClick={() => onSelect(active === group.id ? null : group.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              data-cursor="explore"
            >
              <span className="eco__sidebar-icon">{meta?.icon ?? "•"}</span>
              <span className="eco__sidebar-label">{group.label}</span>
              <span className="eco__sidebar-count">{group.items.length}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="eco__sidebar-footer">
        <div className="eco__sidebar-stat">
          <div className="eco__sidebar-stat-value">{totalTechs}+</div>
          <div className="eco__sidebar-stat-label">Technologies Mastered</div>
        </div>
      </div>

      <div className="eco__sidebar-legend">
        <h4 className="eco__sidebar-legend-title">Graph Guide</h4>
        <div className="eco__sidebar-legend-items">
          <div className="eco__legend-item">
            <span className="eco__legend-dot eco__legend-dot--core" />
            <span>Interactive Node</span>
          </div>
          <div className="eco__legend-item">
            <span className="eco__legend-dot eco__legend-dot--connected" />
            <span>Production Links</span>
          </div>
          <div className="eco__legend-item">
            <span className="eco__legend-dot eco__legend-dot--supporting" />
            <span>Sticky Note Inspector</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   EcosystemGraph — Spacious, high-fidelity SVG interactive canvas
------------------------------------------------------------------ */

function EcosystemGraph({
  nodes,
  connections,
  groups,
  activeCategory,
  selectedSkill,
  onSelect,
  reduce,
}: {
  nodes: EcoNode[];
  connections: EcoConnection[];
  groups: SkillGroup[];
  activeCategory: string | null;
  selectedSkill: string | null;
  onSelect: (id: string | null) => void;
  reduce: boolean;
}) {
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id.toLowerCase(), n])), [nodes]);

  const relatedSkills = useMemo(() => {
    if (!selectedSkill) return new Set<string>();
    const selLower = selectedSkill.toLowerCase();
    const related = new Set<string>([selLower]);
    for (const c of connections) {
      if (c.from.toLowerCase() === selLower) related.add(c.to.toLowerCase());
      if (c.to.toLowerCase() === selLower) related.add(c.from.toLowerCase());
    }
    const cat = nodes.find((n) => n.id.toLowerCase() === selLower)?.categoryId;
    if (cat) {
      for (const n of nodes) {
        if (n.categoryId === cat) related.add(n.id.toLowerCase());
      }
    }
    return related;
  }, [selectedSkill, connections, nodes]);

  const visibleConnections = useMemo(() => {
    if (!selectedSkill) return [];
    const selLower = selectedSkill.toLowerCase();
    return connections.filter(
      (c) => c.from.toLowerCase() === selLower || c.to.toLowerCase() === selLower,
    );
  }, [selectedSkill, connections]);

  return (
    <div className="eco__graph-wrap">
      <svg
        className="eco__svg"
        viewBox="0 0 1000 620"
        aria-label="Interactive technology ecosystem graph"
        role="img"
      >
        <defs>
          <radialGradient id="ecoCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
            <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="ecoNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background constellation rings */}
        <circle cx="500" cy="310" r="420" className="eco__canvas-ring" strokeDasharray="4 8" />
        <circle cx="500" cy="310" r="260" className="eco__canvas-ring eco__canvas-ring--inner" />
        <circle cx="500" cy="310" r="90" fill="url(#ecoCenterGlow)" />

        {/* Center monogram nucleus */}
        <g transform="translate(500, 310)" className="eco__nucleus">
          <circle r="26" className="eco__nucleus-bg" />
          <circle r="34" className="eco__nucleus-pulse" />
          <text textAnchor="middle" dominantBaseline="central" className="eco__nucleus-text">
            ✦
          </text>
        </g>

        {/* Category cluster zones */}
        {groups.map((g) => {
          const meta = CATEGORY_META[g.id];
          if (!meta) return null;
          const isDim = activeCategory && activeCategory !== g.id;
          const isActive = activeCategory === g.id;

          return (
            <g
              key={g.id}
              className={cn(
                "eco__cat-group",
                isDim && "eco__cat-group--dim",
                isActive && "eco__cat-group--active",
              )}
            >
              {/* Category pill header */}
              <g transform={`translate(${meta.cx}, ${meta.cy - (g.id === "frontend" ? 95 : 48)})`}>
                <rect
                  x="-62"
                  y="-12"
                  width="124"
                  height="24"
                  rx="12"
                  className="eco__cat-pill-bg"
                />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="eco__cat-pill-text"
                >
                  {meta.icon} {g.label.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}

        {/* Connection paths */}
        {visibleConnections.map((c) => {
          const a = nodeMap.get(c.from.toLowerCase());
          const b = nodeMap.get(c.to.toLowerCase());
          if (!a || !b) return null;

          // Curving bezier path between nodes
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2 - 15;
          const pathD = `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;

          return (
            <g key={`${c.from}-${c.to}`} className="eco__connection-group">
              <path d={pathD} className="eco__connection-glow" />
              <path
                d={pathD}
                className="eco__connection-line"
                strokeDasharray={reduce ? undefined : "6 4"}
              />
            </g>
          );
        })}

        {/* Skill nodes */}
        {nodes.map((n) => {
          const nLower = n.id.toLowerCase();
          const dimmed =
            (activeCategory && n.categoryId !== activeCategory) ||
            (selectedSkill && !relatedSkills.has(nLower));
          const isSelected = selectedSkill && nLower === selectedSkill.toLowerCase();
          const isRelated = selectedSkill && !isSelected && relatedSkills.has(nLower);

          return (
            <g
              key={n.id}
              className={cn(
                "eco__node",
                dimmed && "eco__node--dim",
                isRelated && "eco__node--related",
                isSelected && "eco__node--selected",
              )}
              transform={`translate(${n.x}, ${n.y})`}
              onClick={() => onSelect(isSelected ? null : n.id)}
              role="button"
              tabIndex={0}
              aria-label={`Select ${n.label}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(isSelected ? null : n.id);
                }
              }}
              data-cursor="explore"
            >
              {/* Highlight Aura */}
              {(isSelected || isRelated) && (
                <circle
                  className={cn("eco__node-aura", isSelected && "eco__node-aura--selected")}
                  r={isSelected ? 26 : 21}
                />
              )}

              {/* Node Outer Disc */}
              <circle
                className="eco__node-ring"
                r={isSelected ? 19 : 14.5}
              />

              {/* Node Icon */}
              <foreignObject
                x={isSelected ? -11 : -9}
                y={isSelected ? -11 : -9}
                width={isSelected ? 22 : 18}
                height={isSelected ? 22 : 18}
                className="eco__node-icon"
              >
                <StackTechIcon label={n.label} />
              </foreignObject>

              {/* Node Label underneath */}
              <text
                className="eco__node-label"
                y={isSelected ? 29 : 25}
                textAnchor="middle"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------
   StickyNoteDetail — Authentic Post-It Note design for technology inspector
------------------------------------------------------------------ */

function StickyNoteDetail({
  skillId,
  nodes,
  groups,
  connections,
  onSelectTech,
  onClose,
  reduce,
}: {
  skillId: string | null;
  nodes: EcoNode[];
  groups: SkillGroup[];
  connections: EcoConnection[];
  onSelectTech: (id: string) => void;
  onClose: () => void;
  reduce: boolean;
}) {
  const selectedNode = skillId
    ? nodes.find((n) => n.id.toLowerCase() === skillId.toLowerCase())
    : null;
  const group = selectedNode
    ? groups.find((g) => g.id === selectedNode.categoryId)
    : null;

  const relatedProjects = useMemo(() => {
    if (!skillId) return [];
    const sel = skillId.toLowerCase();
    return projects.filter((p) =>
      p.technologies?.some((t) => t.toLowerCase() === sel),
    );
  }, [skillId]);

  const relatedExperience = useMemo(() => {
    if (!skillId) return [];
    const sel = skillId.toLowerCase();
    return experience.filter((e) =>
      e.technologies?.some((t) => t.toLowerCase() === sel),
    );
  }, [skillId]);

  const companionTechs = useMemo(() => {
    if (!skillId) return [];
    const sel = skillId.toLowerCase();
    const matched = new Set<string>();
    for (const c of connections) {
      if (c.from.toLowerCase() === sel) matched.add(c.to);
      if (c.to.toLowerCase() === sel) matched.add(c.from);
    }
    return Array.from(matched).slice(0, 5);
  }, [skillId, connections]);

  return (
    <div className="sticky-note-wrapper">
      <AnimatePresence mode="wait" initial={false}>
        {selectedNode && group ? (
          <motion.div
            key={selectedNode.id}
            className="sticky-note sticky-note--active"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, rotate: -2, y: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.2, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, rotate: 1, y: -10 }}
            transition={{
              duration: reduce ? 0.15 : 0.35,
              ease: [0.175, 0.885, 0.32, 1.275] as [number, number, number, number],
            }}
          >
            {/* Scotch / Washi Tape Strip on Top */}
            <div className="sticky-note__tape" aria-hidden="true" />

            {/* Corner Curl Dog-Ear */}
            <div className="sticky-note__dogear" aria-hidden="true" />

            {/* Close / Unpin Button */}
            <button
              type="button"
              className="sticky-note__close"
              onClick={onClose}
              aria-label="Unpin sticky note"
              title="Close note"
              data-cursor="explore"
            >
              ✕
            </button>

            {/* Note Header */}
            <div className="sticky-note__header">
              <div className="sticky-note__badge-row">
                <span className="sticky-note__pin-icon">📌</span>
                <span className="sticky-note__category-tag">
                  {CATEGORY_META[group.id]?.icon} {group.label}
                </span>
                <span className="sticky-note__memo-num">#SPEC-0{group.items.indexOf(selectedNode.id) + 1}</span>
              </div>

              <div className="sticky-note__title-row">
                <span className="sticky-note__icon-frame">
                  <StackTechIcon label={selectedNode.label} />
                </span>
                <div>
                  <h3 className="sticky-note__title">{selectedNode.label}</h3>
                  <span className="sticky-note__role">Production Stack</span>
                </div>
              </div>
            </div>

            {/* Hand-annotated Memo Quote */}
            {group.note && (
              <div className="sticky-note__memo-box">
                <span className="sticky-note__memo-quote">“</span>
                <p className="sticky-note__memo-text">{group.note}</p>
              </div>
            )}

            {/* Projects Checklist Section */}
            {relatedProjects.length > 0 && (
              <div className="sticky-note__section">
                <p className="sticky-note__section-label">
                  <span>✓</span> Projects Delivered ({relatedProjects.length})
                </p>
                <ul className="sticky-note__checklist">
                  {relatedProjects.map((p) => (
                    <li key={p.slug} className="sticky-note__checklist-item">
                      <Link href={`/work/${p.slug}`} className="sticky-note__link" data-cursor="explore">
                        <span className="sticky-note__bullet">▪</span>
                        <span className="sticky-note__link-text">{p.title}</span>
                        <span className="sticky-note__arrow" aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Experience Checklist Section */}
            {relatedExperience.length > 0 && (
              <div className="sticky-note__section">
                <p className="sticky-note__section-label">
                  <span>💼</span> Applied In Career ({relatedExperience.length})
                </p>
                <ul className="sticky-note__checklist">
                  {relatedExperience.map((exp) => (
                    <li key={exp.id} className="sticky-note__checklist-item">
                      <Link href="/experience#journey" className="sticky-note__link" data-cursor="explore">
                        <span className="sticky-note__bullet">▪</span>
                        <span className="sticky-note__link-text">
                          {exp.company} <small>({exp.role})</small>
                        </span>
                        <span className="sticky-note__arrow" aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Companion Technologies Tags */}
            {companionTechs.length > 0 && (
              <div className="sticky-note__section">
                <p className="sticky-note__section-label">
                  <span>⚡</span> Frequently Paired With
                </p>
                <div className="sticky-note__companion-chips">
                  {companionTechs.map((companion) => (
                    <button
                      key={companion}
                      type="button"
                      className="sticky-note__chip"
                      onClick={() => onSelectTech(companion)}
                      data-cursor="explore"
                    >
                      <StackTechIcon label={companion} className="sticky-note__chip-icon" />
                      <span>{companion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sticky Note Footer Signature */}
            <div className="sticky-note__footer">
              <span className="sticky-note__stamp">✓ VERIFIED IN PRODUCTION</span>
              <span className="sticky-note__handwriting">Rabin R.</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-prompt"
            className="sticky-note sticky-note--empty"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotate: 1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, rotate: -1 }}
            transition={{ duration: 0.25 }}
          >
            {/* Top Tape */}
            <div className="sticky-note__tape" aria-hidden="true" />
            <div className="sticky-note__dogear" aria-hidden="true" />

            <div className="sticky-note__empty-content">
              <div className="sticky-note__empty-pin">📌</div>
              <span className="sticky-note__empty-tag">QUICK NOTE</span>
              <h3 className="sticky-note__empty-title">Select a technology to explore</h3>
              <p className="sticky-note__empty-desc">
                Click any node on the left constellation map to inspect real project codebases, architecture integrations, and companion tools.
              </p>

              <div className="sticky-note__empty-tips">
                <div className="sticky-note__tip-item">
                  <span className="sticky-note__tip-bullet">✦</span>
                  <span><strong>Filter categories</strong> using top pills or sidebar</span>
                </div>
                <div className="sticky-note__tip-item">
                  <span className="sticky-note__tip-bullet">✦</span>
                  <span><strong>Click nodes</strong> to inspect production notes & links</span>
                </div>
                <div className="sticky-note__tip-item">
                  <span className="sticky-note__tip-bullet">✦</span>
                  <span><strong>Trace links</strong> to related projects & experience</span>
                </div>
              </div>

              <div className="sticky-note__empty-badge">
                <span>40+ Modern Technologies Documented</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------
   TechEcosystem — main component export
------------------------------------------------------------------ */

export function TechEcosystem({
  headingLevel = "h2",
}: {
  headingLevel?: SectionHeadingLevel;
} = {}) {
  const reduce = useReducedMotion();
  const Heading = headingLevel;

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const groups = skillGroups;
  const connections = useMemo(() => buildConnectionMap(), []);
  const nodes = useMemo(() => calculatePositions(groups), [groups]);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedSkill((prev) => (prev === id ? null : id));
  }, []);

  const handleCategorySelect = useCallback((id: string | null) => {
    setActiveCategory(id);
    setSelectedSkill(null);
  }, []);

  const fade = reduce ? { opacity: 0 } : { opacity: 0, y: 20 };
  const inView = { opacity: 1, y: 0 };
  const viewport = { once: true, margin: "-10%" } as const;
  const enter = { duration: reduce ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  return (
    <div className="eco">
      <motion.header
        className="eco__header"
        initial={fade}
        whileInView={inView}
        viewport={viewport}
        transition={enter}
      >
        <SectionKicker index="05" label="Interactive Tech Ecosystem" />
        <Heading className="eco__title">
          Explore the <em>ecosystem.</em>
        </Heading>
        <p className="eco__lede">
          Interact with the live technology map below to discover stack synergies, verified real-world projects, and architectural pairings.
        </p>
      </motion.header>

      <motion.div
        className="eco__container"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{ duration: reduce ? 0.15 : 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        {/* Left Sidebar */}
        <CategorySidebar
          groups={groups}
          active={activeCategory}
          onSelect={handleCategorySelect}
        />

        {/* Center Canvas & Right Sticky Note */}
        <div className="eco__body">
          <EcosystemGraph
            nodes={nodes}
            connections={connections}
            groups={groups}
            activeCategory={activeCategory}
            selectedSkill={selectedSkill}
            onSelect={handleSelect}
            reduce={Boolean(reduce)}
          />

          <div className="eco__detail-slot">
            <StickyNoteDetail
              skillId={selectedSkill}
              nodes={nodes}
              groups={groups}
              connections={connections}
              onSelectTech={(tech) => setSelectedSkill(tech)}
              onClose={() => setSelectedSkill(null)}
              reduce={Boolean(reduce)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

