"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useRef,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { duration, ease, stagger } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useViewportRegister } from "@/hooks/use-parallel";
import { useMotionTier } from "@/lib/motion-tier";

/* ============================================================
   PARALLEL PRIMITIVES
   SectionDance / StaggerWave / ParallaxLayers / HoverParallel
   Section-level and interaction choreography. Entrance phases run
   through the central controller; continuous scroll + hover values
   stay with motion. Everything collapses to a plain fade under
   prefers-reduced-motion.
   ============================================================ */

/* ------------------------------------------------------------------
   SectionDance — section-level parallelism. The header slides in from
   one side, the content fades up a beat later, and an optional bg layer
   drifts the opposite way. With `as` + `className` a callable grid like
   `shell contact-grid` keeps its own layout; the bg sits absolutely
   behind the two columns.
------------------------------------------------------------------ */
export function SectionDance({
  header,
  children,
  bg,
  headerFrom = "left",
  as = "div",
  className,
}: {
  header: ReactNode;
  children: ReactNode;
  bg?: ReactNode;
  headerFrom?: "left" | "right";
  as?: "div" | "section" | "article";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { tier } = useMotionTier();
  const quiet = reduce || tier === "basic";
  const { ref, phase } = useViewportRegister({ threshold: 0.2, once: true });
  const Tag = motion[as] as typeof motion.div;
  const active = phase !== "idle";
  const dir = headerFrom === "left" ? -1 : 1;

  const contentHidden = quiet ? { opacity: 0 } : { opacity: 0, y: 24 };
  const headerHidden = quiet
    ? { opacity: 0 }
    : headerFrom === "left"
      ? { opacity: 0, x: -32 }
      : { opacity: 0, x: 32 };
  const bgHidden = quiet ? { opacity: 0 } : { opacity: 0, x: dir * 24 };

  return (
    <Tag ref={ref} className={cn("sdance", className)} initial="hidden" animate={active ? "show" : "hidden"}>
      {bg ? (
        <motion.div
          className="sdance__bg"
          aria-hidden
          variants={
            quiet
              ? { hidden: bgHidden, show: { opacity: 1, transition: { duration: duration.micro } } }
              : { hidden: bgHidden, show: { opacity: 1, x: 0, transition: { duration: duration.cinematic, ease } } }
          }
        >
          {bg}
        </motion.div>
      ) : null}
      <motion.div
        className="sdance__header"
        variants={
          quiet
            ? { hidden: headerHidden, show: { opacity: 1, transition: { duration: duration.micro } } }
            : { hidden: headerHidden, show: { opacity: 1, x: 0, transition: { duration: duration.section, ease } } }
        }
      >
        {header}
      </motion.div>
      <motion.div
        className="sdance__content"
        variants={
          quiet
            ? { hidden: contentHidden, show: { opacity: 1, transition: { duration: duration.micro } } }
            : {
                hidden: contentHidden,
                show: { opacity: 1, y: 0, transition: { duration: duration.section, delay: 0.1, ease } },
              }
        }
      >
        {children}
      </motion.div>
    </Tag>
  );
}

/* ------------------------------------------------------------------
   StaggerWave — a staggered child burst. The container registers once
   with the controller; when it turns active every child animates with
   its own delay. Children must be motion elements (the wave injects
   initial / animate / transition into each one).
   - ltr:          cascade left → right (x drift)
   - ttb:          cascade top → bottom (y drift)
   - center-out:   burst from the middle (|i − mid| delay)
------------------------------------------------------------------ */
export function StaggerWave({
  children,
  direction = "ltr",
  gap = stagger,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: "ltr" | "ttb" | "center-out";
  gap?: number;
  delay?: number;
  className?: string;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const { tier } = useMotionTier();
  const quiet = reduce || tier === "basic";
  const { ref, phase } = useViewportRegister({ threshold: 0.3, once: true });
  const Tag = motion[as] as typeof motion.div;
  const items = Children.toArray(children);
  const mid = (items.length - 1) / 2;
  const active = phase !== "idle";

  const hidden =
    direction === "ltr"
      ? { opacity: 0, x: -20 }
      : direction === "ttb"
        ? { opacity: 0, y: 20 }
        : { opacity: 0, y: 12 };
  const shown = { opacity: 1, x: 0, y: 0 };

  return (
    <Tag ref={ref} className={className}>
      {items.map((child, i) => {
        if (!isValidElement(child)) return child;
        const offset = direction === "center-out" ? Math.abs(i - mid) : i;
        return cloneElement(
          child as ReactElement<Record<string, unknown>>,
          quiet
            ? {
                initial: { opacity: 0 },
                animate: active ? { opacity: 1 } : { opacity: 0 },
                transition: { duration: duration.micro },
              }
            : {
                initial: hidden,
                animate: active ? shown : hidden,
                transition: { duration: duration.section, delay: delay + offset * gap, ease },
              },
        );
      })}
    </Tag>
  );
}

/* ------------------------------------------------------------------
   ParallaxLayers — stacked scroll-linked layers with fixed relative
   speeds. One observer for the stack, then per-layer transform.
   Foreground 1.0 → background 0.2 keeps the same depth ratio wherever
   the stack is used.
------------------------------------------------------------------ */
export type PlxLayerSpec = {
  speed: number;
  className?: string;
  children?: ReactNode;
};

export function ParallaxLayers({ layers, className }: { layers: PlxLayerSpec[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <div ref={ref} className={cn("plx", className)} aria-hidden>
      {layers.map((layer) => (
        <PlxLayer
          key={layer.speed}
          speed={layer.speed}
          scrollYProgress={scrollYProgress}
          className={layer.className}
        >
          {layer.children}
        </PlxLayer>
      ))}
    </div>
  );
}

function PlxLayer({
  speed,
  scrollYProgress,
  className,
  children,
}: {
  speed: number;
  scrollYProgress: MotionValue<number>;
  className?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const { tier } = useMotionTier();
  const quiet = reduce || tier === "basic";
  const y = useTransform(scrollYProgress, [0, 1], [0, quiet ? 0 : -72 * speed]);
  return (
    <motion.div className={cn("plx__layer", className)} style={{ y }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   HoverParallel — card-scale hover with parallel states. `rest` spreads
   the entrance props (initial / whileInView / viewport / transition);
   the hover spring is applied on top. Glow, number and arrow states are
   handled in CSS (`.hpar:hover …`) since they are plain elements, not
   motion nodes. Hover is disabled under reduced motion.
------------------------------------------------------------------ */
type HoverParallelProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "figure" | "li";
  scale?: number;
} & Omit<ComponentProps<typeof motion.div>, "children" | "className">;

export function HoverParallel({ children, className, as = "article", scale = 1.02, ...rest }: HoverParallelProps) {
  const reduce = useReducedMotion();
  const { tier } = useMotionTier();
  const quiet = reduce || tier === "basic";
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      {...rest}
      whileHover={
        quiet
          ? undefined
          : {
              scale,
              transition: { type: "spring", stiffness: 260, damping: 22, mass: 0.6 },
            }
      }
    >
      {children}
    </Tag>
  );
}