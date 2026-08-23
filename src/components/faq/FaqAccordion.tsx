"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { FaqItem } from "@/content/faq";
import { duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { cn } from "@/lib/cn";

/**
 * Accordion over the FAQ list.
 *
 * Every answer stays in the server-rendered HTML — collapsing is done with a
 * `grid-template-rows: 0fr → 1fr` transition, not with `display: none` or
 * conditional rendering. That keeps the FAQPage structured data, AI-search
 * crawlers and the site's own retriever reading the same text they always did,
 * while the visible section behaves like a normal disclosure list.
 *
 * One panel is open at a time (the first by default), matching the reference:
 * the open row lifts out of the stack with an accent border and glow.
 */
export function FaqAccordion({
  items,
  headingLevel = "h3",
}: {
  items: FaqItem[];
  headingLevel?: "h2" | "h3";
}) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const reduce = useReducedMotionSafe();
  const Heading = headingLevel;

  return (
    <motion.div
      className="faqx__list"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.05 } } }}
    >
      {items.map((item, i) => {
        const open = openId === item.id;
        return (
          <motion.div
            key={item.id}
            className={cn("faqx__row", open && "is-open")}
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: reduce ? duration.micro : duration.interaction, ease },
              },
            }}
          >
            <Heading className="faqx__q">
              <button
                type="button"
                className="faqx__trigger"
                aria-expanded={open}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span className="faqx__num" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="faqx__label">{item.question}</span>
                <span className="faqx__icon" aria-hidden>
                  <svg viewBox="0 0 24 24" focusable="false">
                    <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M7 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path
                      className="faqx__icon-bar"
                      d="M12 7v10"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </Heading>

            <div
              className="faqx__panel"
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.id}`}
            >
              <div className="faqx__panel-inner">
                <p className="faqx__a">{item.answer}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
