"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { skillGroups } from "@/content/skills";
import { projects } from "@/content/projects";
import { experience } from "@/content/experience";
import type { SkillGroup } from "@/content/types";
import { StackTechIcon } from "@/components/StackTechIcon";
import { Magnetic } from "@/components/motion";
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
   Node layout — radial arrangement by category
------------------------------------------------------------------ */

const CATEGORY_ANGLES: Record<string, number> = {
  frontend: -90,
  mobile: -90 + 360 / 7,
  backend: -90 + (360 / 7) * 2,
  data: -90 + (360 / 7) * 3,
  design: -90 + (360 / 7) * 4,
  quality: -90 + (360 / 7) * 5,
  tooling: -90 + (360 / 7) * 6,
};

function calculatePositions(groups: SkillGroup[]): EcoNode[] {
  const cx = 500;
  const cy = 300;
  const categoryRadius = 200;
  const skillRadius = 85;
  const nodes: EcoNode[] = [];

  for (const group of groups) {
    const catAngle = ((CATEGORY_ANGLES[group.id] ?? 0) * Math.PI) / 180;
    const catX = cx + categoryRadius * Math.cos(catAngle);
    const catY = cy + categoryRadius * Math.sin(catAngle);

    const count = group.items.length;
    const spread = Math.min(count * 18, 120);
    const startAngle = catAngle - (spread * Math.PI) / 360;
    const step = count > 1 ? (spread * Math.PI) / 180 / (count - 1) : 0;

    for (let i = 0; i < count; i++) {
      const angle = count === 1 ? catAngle : startAngle + step * i;
      nodes.push({
        id: group.items[i],
        label: group.items[i],
        categoryId: group.id,
        x: catX + skillRadius * Math.cos(angle),
        y: catY + skillRadius * Math.sin(angle),
      });
    }
  }

  return nodes;
}

/* ------------------------------------------------------------------
   CategorySidebar — left sidebar with category list
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
        <h3 className="eco__sidebar-title">Categories</h3>
      </div>

      <div className="eco__sidebar-list">
        {groups.map((group) => (
          <motion.button
            key={group.id}
            className={cn("eco__sidebar-item", active === group.id && "eco__sidebar-item--active")}
            onClick={() => onSelect(active === group.id ? null : group.id)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            data-cursor="explore"
          >
            <span className="eco__sidebar-icon">
              {group.id === "frontend" && "⚛"}
              {group.id === "mobile" && "📱"}
              {group.id === "backend" && "⚙"}
              {group.id === "data" && "📊"}
              {group.id === "design" && "🎨"}
              {group.id === "quality" && "✓"}
              {group.id === "tooling" && "🔧"}
            </span>
            <span className="eco__sidebar-label">{group.label}</span>
            <span className="eco__sidebar-count">{group.items.length}</span>
          </motion.button>
        ))}
      </div>

      <div className="eco__sidebar-footer">
        <div className="eco__sidebar-stat">
          <div className="eco__sidebar-stat-value">{totalTechs}+</div>
          <div className="eco__sidebar-stat-label">and growing</div>
        </div>
      </div>

      <div className="eco__sidebar-legend">
        <h4 className="eco__sidebar-legend-title">Legend</h4>
        <div className="eco__sidebar-legend-items">
          <div className="eco__legend-item">
            <div className="eco__legend-dot eco__legend-dot--core"></div>
            <span>Core</span>
          </div>
          <div className="eco__legend-item">
            <div className="eco__legend-dot eco__legend-dot--connected"></div>
            <span>Connected</span>
          </div>
          <div className="eco__legend-item">
            <div className="eco__legend-dot eco__legend-dot--supporting"></div>
            <span>Supporting</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   CategoryFilter — magnetic pill buttons (top filter)
------------------------------------------------------------------ */

function CategoryFilter({
  groups,
  active,
  onSelect,
}: {
  groups: SkillGroup[];
  active: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="eco__filter" role="radiogroup" aria-label="Filter by category">
      <Magnetic strength={6} scale={1.03}>
        <button
          type="button"
          role="radio"
          aria-checked={active === null}
          className={cn("eco__pill", active === null && "eco__pill--active")}
          onClick={() => onSelect(null)}
          data-cursor="explore"
        >
          All
        </button>
      </Magnetic>
      {groups.map((g) => (
        <Magnetic key={g.id} strength={6} scale={1.03}>
          <button
            type="button"
            role="radio"
            aria-checked={active === g.id}
            className={cn("eco__pill", active === g.id && "eco__pill--active")}
            onClick={() => onSelect(g.id)}
            data-cursor="explore"
          >
            {g.label}
          </button>
        </Magnetic>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   EcosystemGraph — SVG-based interactive node graph
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
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const relatedSkills = useMemo(() => {
    if (!selectedSkill) return new Set<string>();
    const related = new Set<string>([selectedSkill]);
    for (const c of connections) {
      if (c.from.toLowerCase() === selectedSkill.toLowerCase()) related.add(c.to);
      if (c.to.toLowerCase() === selectedSkill.toLowerCase()) related.add(c.from);
    }
    const cat = nodes.find((n) => n.id === selectedSkill)?.categoryId;
    if (cat) {
      for (const n of nodes) {
        if (n.categoryId === cat) related.add(n.id);
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
        viewBox="0 0 1000 600"
        aria-label="Interactive technology ecosystem graph"
        role="img"
      >
        {/* Connection lines */}
        {visibleConnections.map((c) => {
          const a = nodeMap.get(c.from) ?? nodes.find((n) => n.id.toLowerCase() === c.from.toLowerCase());
          const b = nodeMap.get(c.to) ?? nodes.find((n) => n.id.toLowerCase() === c.to.toLowerCase());
          if (!a || !b) return null;
          return (
            <line
              key={`${c.from}-${c.to}`}
              className="eco__connection"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeDasharray={reduce ? undefined : "6 4"}
            />
          );
        })}

        {/* Category labels */}
        {groups.map((g) => {
          const angle = ((CATEGORY_ANGLES[g.id] ?? 0) * Math.PI) / 180;
          const lx = 500 + 255 * Math.cos(angle);
          const ly = 300 + 255 * Math.sin(angle);
          const dimmed = activeCategory && activeCategory !== g.id;
          return (
            <text
              key={g.id}
              className={cn("eco__cat-label", dimmed && "eco__cat-label--dim")}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {g.label}
            </text>
          );
        })}

        {/* Skill nodes */}
        {nodes.map((n) => {
          const dimmed =
            (activeCategory && n.categoryId !== activeCategory) ||
            (selectedSkill && !relatedSkills.has(n.id));
          const isSelected = n.id === selectedSkill;
          return (
            <g
              key={n.id}
              className={cn("eco__node", dimmed && "eco__node--dim", isSelected && "eco__node--selected")}
              transform={`translate(${n.x}, ${n.y})`}
              data-cursor="explore"
            >
              <circle
                className="eco__node-ring"
                r={isSelected ? 20 : 14}
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
              />
              <foreignObject x={-10} y={-10} width={20} height={20} className="eco__node-icon">
                <StackTechIcon label={n.label} />
              </foreignObject>
              <text className="eco__node-label" y={26} textAnchor="middle">
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
   SkillDetailPanel — shows selected skill info, related projects & experience
------------------------------------------------------------------ */

function SkillDetailPanel({
  skillId,
  nodes,
  groups,
  onClose,
  reduce,
}: {
  skillId: string;
  nodes: EcoNode[];
  groups: SkillGroup[];
  onClose: () => void;
  reduce: boolean;
}) {
  const node = nodes.find((n) => n.id === skillId);
  const group = groups.find((g) => g.id === node?.categoryId);

  const relatedProjects = useMemo(
    () =>
      projects.filter((p) =>
        p.technologies?.some((t) => t.toLowerCase() === skillId.toLowerCase()),
      ),
    [skillId],
  );

  const relatedExperience = useMemo(
    () =>
      experience.filter((e) =>
        e.technologies?.some((t) => t.toLowerCase() === skillId.toLowerCase()),
      ),
    [skillId],
  );

  if (!node) return null;

  return (
    <motion.div
      className="eco__detail"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: reduce ? 0.15 : 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <button
        type="button"
        className="eco__detail-close"
        onClick={onClose}
        aria-label="Deselect skill"
        data-cursor="explore"
      >
        ✕
      </button>

      <div className="eco__detail-head">
        <span className="eco__detail-icon" aria-hidden>
          <StackTechIcon label={node.label} />
        </span>
        <div>
          <h3 className="eco__detail-name">{node.label}</h3>
          {group && (
            <span className="eco__detail-cat">{group.label}</span>
          )}
        </div>
      </div>

      {group?.note && (
        <p className="eco__detail-note">{group.note}</p>
      )}

      {relatedProjects.length > 0 && (
        <div className="eco__detail-projects">
          <p className="eco__detail-projects-label">Related Work</p>
          <ul>
            {relatedProjects.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} data-cursor="explore">
                  <span>{p.title}</span>
                  <span className="eco__detail-arrow" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedExperience.length > 0 && (
        <div className="eco__detail-projects" style={{ marginTop: "1rem" }}>
          <p className="eco__detail-projects-label">Used In Experience</p>
          <ul>
            {relatedExperience.map((exp) => (
              <li key={exp.id}>
                <Link href="/experience#journey" data-cursor="explore">
                  <span>{exp.company} ({exp.role})</span>
                  <span className="eco__detail-arrow" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   TechEcosystem — main export
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

  const handleSelect = useCallback(
    (id: string | null) => {
      setSelectedSkill((prev) => (prev === id ? null : id));
    },
    [],
  );

  const handleCategorySelect = useCallback(
    (id: string | null) => {
      setActiveCategory(id);
      setSelectedSkill(null);
    },
    [],
  );

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
        <SectionKicker index="05" label="Technology Ecosystem" />
        <Heading className="eco__title">
          Explore the <em>ecosystem.</em>
        </Heading>
        <p className="eco__lede">
          Select a technology to see where it fits, what it connects to, and where it&apos;s been used.
        </p>
      </motion.header>

      <motion.div
        initial={fade}
        whileInView={inView}
        viewport={viewport}
        transition={{ ...enter, delay: reduce ? 0 : 0.08 }}
      >
        <CategoryFilter
          groups={groups}
          active={activeCategory}
          onSelect={handleCategorySelect}
        />
      </motion.div>

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

        {/* Center Content */}
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
            <AnimatePresence mode="wait" initial={false}>
              {selectedSkill ? (
                <SkillDetailPanel
                  key={selectedSkill}
                  skillId={selectedSkill}
                  nodes={nodes}
                  groups={groups}
                  onClose={() => setSelectedSkill(null)}
                  reduce={Boolean(reduce)}
                />
              ) : (
                <motion.div
                  key="prompt"
                  className="eco__prompt"
                  initial={reduce ? { opacity: 0 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="eco__prompt-icon" aria-hidden>◎</span>
                  <p>Select a technology to explore</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

