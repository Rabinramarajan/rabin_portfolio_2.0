"use client";

import { motion, useReducedMotion } from "motion/react";
import { Btn, SectionKicker } from "@/components/ui";
import { pricingDisclaimer, pricingPlans } from "@/content/pricing";
import { duration, ease } from "@/lib/motion";
import { TextReveal } from "@/components/motion";

const models = [
  { id: "project" as const, title: "Project", summary: "A defined product, shipped on a timeline." },
  { id: "retainer" as const, title: "Retainer", summary: "Ongoing care after launch." },
  { id: "contract" as const, title: "Contract", summary: "Embedded frontend engineering inside your team." },
];

export function PricingSection() {
  const reduce = useReducedMotion();

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
          <SectionKicker index="07" label="Engagement" />
          <TextReveal lines={["How the work", "is structured."]} className="sec-title" as="h2" />
          <p className="sec-lede">INR first. Indicative starting points — scope decides the rest.</p>
        </motion.div>

        <div className="eng-list">
          {models.map((model, i) => {
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
                  <h3>{model.summary}</h3>
                  <div className="eng-row__details">
                    <span>Scope: {lead?.scope}. Timeline: {lead?.timeline}.</span>
                    <span>Includes: {lead?.deliverables.slice(0, 5).join(" · ")}.</span>
                    <span>Ideal for: {lead?.idealClient}</span>
                  </div>
                </div>
                <div>
                  <p className="eng-row__price">{lead?.startingLabel ?? "Starting from — Let's discuss"}</p>
                  <Btn href="/contact" variant="line">
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