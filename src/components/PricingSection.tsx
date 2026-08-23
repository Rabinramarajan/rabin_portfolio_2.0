"use client";

import { motion, useReducedMotion } from "motion/react";
import { Btn, SectionKicker, itemHeadingLevel } from "@/components/ui";
import type { SectionHeadingLevel } from "@/components/ui";
import { pricingDisclaimer, pricingPlans } from "@/content/pricing";
import { engagementModels } from "@/content/engagement-models";
import { accentIndex, sections, titleLines } from "@/content/sections";
import { duration, ease } from "@/lib/motion";
import { TextReveal } from "@/components/motion";

export function PricingSection({ headingLevel = "h2" }: { headingLevel?: SectionHeadingLevel } = {}) {
  const ItemHeading = itemHeadingLevel(headingLevel);
  const reduce = useReducedMotion();
  const intro = sections.engagement;

  const view = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : delay, ease },
  });

  return (
    <section id="engagement" className="section">
      <div className="shell">
        <motion.div {...view(0)}>
          <SectionKicker index={intro.index} label={intro.label} />
          <TextReveal
            lines={titleLines(intro)}
            className="sec-title"
            as={headingLevel}
            accentIndex={accentIndex(intro)}
          />
          <p className="sec-lede">{intro.lede}</p>
        </motion.div>

        <div className="eng-list">
          {engagementModels.map((model, i) => {
            const plans = pricingPlans.filter((p) => p.model === model.id);
            const lead = plans[0];
            return (
              <motion.article
                key={model.id}
                className="eng-row"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduce ? duration.micro : duration.section, delay: reduce ? 0 : i * 0.05, ease }}
              >
                <p className="eng-row__name">{model.title}</p>
                <div>
                  <ItemHeading>{model.summary}</ItemHeading>
                  <div className="eng-row__details">
                    <span>Scope: {lead?.scope}. Timeline: {lead?.timeline}.</span>
                    <span>Includes: {lead?.deliverables.slice(0, 5).join(" · ")}.</span>
                    <span>Ideal for: {lead?.idealClient}</span>
                  </div>
                </div>
                <div>
                  <p className="eng-row__price">{lead?.startingLabel ?? "Starting from — Let's discuss"}</p>
                  <Btn href="/#contact" variant="line">
                    Discuss {model.title}
                  </Btn>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.p className="eng-disclaimer" {...view(0.15)}>
          {pricingDisclaimer}
        </motion.p>
      </div>
    </section>
  );
}