"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { contactCopy } from "@/content/contact";
import { duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { cn } from "@/lib/cn";

export function ContactWorkflow() {
  const reduce = useReducedMotionSafe();
  const { workflow } = contactCopy;
  const [active, setActive] = useState(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = nodes.indexOf(visible.target as HTMLLIElement);
        if (index >= 0) setActive(index);
      },
      { threshold: [0.35, 0.6], rootMargin: "-12% 0px -35% 0px" },
    );
    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, []);

  const progress = ((active + 1) / workflow.steps.length) * 100;

  return (
    <section id="cp-flow" className="cp-flow" aria-labelledby="cp-flow-title">
      <div className="shell">
        <p className="pf-sec-label">
          <span className="pf-sec-label__index">09</span>
          Process
        </p>
        <h2 id="cp-flow-title" className="cp-flow__title">
          {workflow.title}
        </h2>
        <p className="cp-flow__lede">{workflow.lede}</p>

        <ol className="cp-flow__list">
          <span className="cp-flow__track" aria-hidden>
            <span className="cp-flow__progress" style={{ ["--flow-progress" as string]: `${progress}%` }} />
          </span>
          {workflow.steps.map((step, index) => (
            <motion.li
              key={step.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={cn("cp-flow__step", index <= active && "is-active")}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : index * 0.05, ease }}
            >
              <span className="cp-flow__num" aria-hidden>
                {step.number}
              </span>
              <h3>{step.label}</h3>
              <p>{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
