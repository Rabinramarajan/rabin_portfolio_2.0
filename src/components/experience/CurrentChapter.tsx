"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { formatRoleDates, getCurrentRoles } from "@/content/experience";
import { profile } from "@/content/profile";
import { ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * CURRENT CHAPTER — the present state of the journey, given more room than
 * any single timeline stage.
 *
 * Three scroll-linked depth layers move at most 4 / 8 / 12px. That is
 * deliberately small: the composition should feel like it has depth, not like
 * it is sliding apart.
 */

export function CurrentChapter() {
  const reduce = useReducedMotionSafe();
  const roles = getCurrentRoles();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [4, -4]);
  const archY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [8, -8]);
  const metaY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [12, -12]);

  const pointer = usePointerDrift(reduce);

  return (
    <div className="xcur" ref={ref}>
      <motion.div className="xcur__grid" style={{ y: bgY }} aria-hidden />

      <div className="xcur__inner">
        <div className="xcur__copy">
          <p className="xcur__kicker">
            <span className="xcur__dot" aria-hidden />
            Current chapter · 2026
          </p>

          {/* observed on the list — a clipped item cannot observe itself */}
          <motion.ul
            className="xcur__roles"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -8% 0px" }}
          >
            {roles.map((role, i) => (
              <motion.li
                className="xcur__role"
                key={role.id}
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" },
                  show: reduce
                    ? { opacity: 1, transition: { duration: 0.2 } }
                    : {
                        opacity: 1,
                        clipPath: "inset(0 0 0% 0)",
                        transition: { duration: 0.7, delay: i * 0.12, ease },
                      },
                }}
              >
                <h3 className="xcur__title">{role.role}</h3>
                <p className="xcur__company">{role.company}</p>
                <dl className="xcur__facts">
                  <div>
                    <dt>Type</dt>
                    <dd>{role.type}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{role.location}</dd>
                  </div>
                  <div>
                    <dt>Period</dt>
                    <dd>{formatRoleDates(role)}</dd>
                  </div>
                </dl>
                <p className="xcur__desc">{role.description}</p>
                <ul className="xcur__resp">
                  {role.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <ul className="xcur__tech">
                  {role.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="xcur__aside">
          {/* scroll depth on the outer layer, pointer drift on the inner one —
              they are the same transform channel, so they cannot share a node */}
          <motion.div className="xcur__arch" style={{ y: archY }}>
            <motion.div className="xcur__arch-drift" style={{ x: pointer.x, y: pointer.y }}>
              <LiveArchitecture reduce={reduce} />
            </motion.div>
          </motion.div>
          <motion.dl className="xcur__meta" style={{ y: metaY }}>
            <div>
              <dt>Based in</dt>
              <dd>{profile.locationShort}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{profile.focus}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{profile.availability.label}</dd>
            </div>
          </motion.dl>
        </div>
      </div>
    </div>
  );
}

/**
 * Pointer parallax, capped at ±5px on each axis.
 *
 * Only the architecture diagram moves — never the timeline, the headings or
 * the page. It is off entirely for reduced motion, for coarse pointers, and
 * on narrow viewports, so no touch device pays for a listener it can't use.
 * A spring smooths the raw pointer so the drift trails the cursor instead of
 * snapping to it.
 */
const DRIFT = 5;

function usePointerDrift(reduce: boolean) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 20, restDelta: 0.01 });
  const y = useSpring(my, { stiffness: 60, damping: 20, restDelta: 0.01 });

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: PointerEvent) => {
      /* normalised to −1…1 across the viewport, then scaled to the cap */
      mx.set(((e.clientX / window.innerWidth) * 2 - 1) * DRIFT);
      my.set(((e.clientY / window.innerHeight) * 2 - 1) * DRIFT);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return { x, y };
}

/**
 * A system that keeps forming — a slow, finite-feeling drift rather than a
 * particle field. Under reduced motion it renders as a static diagram.
 */
function LiveArchitecture({ reduce }: { reduce: boolean }) {
  const nodes = [
    { x: 130, y: 110, r: 8, accent: true, phase: 0 },
    { x: 52, y: 52, r: 4.5, phase: 1.4 },
    { x: 208, y: 46, r: 4.5, phase: 2.6 },
    { x: 40, y: 168, r: 4.5, phase: 3.8 },
    { x: 220, y: 172, r: 4.5, phase: 1.9 },
    { x: 130, y: 26, r: 3.5, phase: 3.1 },
    { x: 132, y: 194, r: 3.5, phase: 0.7 },
    { x: 236, y: 112, r: 3.5, phase: 2.2 },
  ];
  const links = [
    "M130 110L52 52",
    "M130 110L208 46",
    "M130 110L40 168",
    "M130 110L220 172",
    "M130 110V26",
    "M130 110V194",
    "M130 110H236",
    "M52 52L130 26",
    "M208 46L236 112",
  ];

  return (
    <svg className="xcur__svg" viewBox="0 0 260 220" role="presentation" focusable="false">
      <g className="xcur__links">
        {links.map((d, i) => (
          <motion.path
            key={d}
            className={i < 2 ? "xv__accent-stroke" : "xv__stroke"}
            d={d}
            fill="none"
            initial={reduce ? { opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
            whileInView={reduce ? { opacity: 0.5 } : { pathLength: 1, opacity: 0.72 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.2 : 0.8, delay: reduce ? 0 : 0.1 + i * 0.06, ease }}
          />
        ))}
      </g>
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          className={n.accent ? "xv__accent-fill" : "xv__fill"}
          cx={n.x}
          cy={n.y}
          r={n.r}
          initial={reduce ? { opacity: 1 } : { scale: 0, opacity: 0 }}
          whileInView={
            reduce
              ? { opacity: 1 }
              : { scale: 1, opacity: [0.55, 1, 0.55], transition: { opacity: { duration: 9, repeat: Infinity, delay: n.phase, ease: "easeInOut" }, scale: { duration: 0.5, delay: 0.2 + i * 0.06, ease } } }
          }
          viewport={{ once: true, amount: 0.4 }}
          style={{ transformOrigin: `${n.x}px ${n.y}px` }}
        />
      ))}
    </svg>
  );
}
