"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { services } from "@/content/services";
import { engagementModels } from "@/content/engagement-models";
import { pricingPlans } from "@/content/pricing";
import { ease, duration } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { PageHero } from "./PageHero";
import { PageCta } from "./PageCta";
import { PageSectionHead } from "./PageSectionHead";
import { ArrowLink } from "./ArrowLink";
import { ServiceHeroVisual, ServiceMediaVisual } from "./ServiceVisual";

const DESKTOP_QUERY = "(min-width: 960px)";
const STEP_MS = 0.22;

export function ServicesPage() {
  const reduce = useReducedMotionSafe();

  return (
    <>
      <PageHero
        index="02"
        label="Services"
        title={["ENGINEERING", "THAT MOVES", "PRODUCTS FORWARD."]}
        lede="From complex frontend systems to polished digital experiences — each service is one stage of a journey from problem to production."
        visual={
          <>
            <div className="svc-hero-media" aria-hidden>
              <img src="/media/service/hero.png" alt="Services hero — engineering journey from idea to production" loading="eager" />
            </div>
            <ServiceHeroVisual reduce={reduce} />
          </>
        }
        meta={[
          { label: "Stack", value: "Angular · React · Next.js" },
          { label: "Output", value: "Production web & mobile" },
          { label: "Focus", value: "Performance · Accessibility" },
          { label: "Scale", value: "Government to startup" },
        ]}
      />

      <ServicesJourney reduce={reduce} />

      <EngagementSection />

      <PageCta
        kicker="02 / SERVICES"
        headline={["KNOW WHAT", "YOU NEED?"]}
        lede="Tell me where the product is and where it has to be. The right engagement becomes obvious quickly."
        actions={[{ label: "Start a Conversation", href: "/contact" }]}
      />
    </>
  );
}

function ServicesJourney({ reduce }: { reduce: boolean }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const desktopRef = useRef(false);

  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const draw = useSpring(scrollYProgress, { stiffness: 78, damping: 24, restDelta: 0.0008 });

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => {
      desktopRef.current = mq.matches && !reduce;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduce]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!desktopRef.current) return;
    const next = Math.min(services.length - 1, Math.max(0, Math.floor(v * services.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const nodes = pinRef.current?.querySelectorAll<HTMLElement>("[data-svcitem]");
    if (!nodes?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (desktopRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const i = Number((visible.target as HTMLElement).dataset.svcitem);
        if (!Number.isNaN(i)) setActive((prev) => (prev === i ? prev : i));
      },
      { threshold: [0.25, 0.6], rootMargin: "-15% 0px -35% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const candidates = pinRef.current?.querySelectorAll<HTMLElement>(`[data-svcanchor="${index}"]`);
      if (!candidates?.length) return;
      const el = Array.from(candidates).find((node) => node.offsetParent !== null);
      if (!el) return;
      const offset = el.dataset.svcoffset === "0" ? 0 : 88;
      window.scrollTo({
        top: window.scrollY + el.getBoundingClientRect().top - offset,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce],
  );

  const service = services[active];

  return (
    <section className="pf-section svc" ref={pinRef}>
      <div className="shell">
        <PageSectionHead
          index="02"
          label="The journey"
          title="From problem to production."
          lede="Seven services, one path. Scroll through the route or jump straight to the stage your product is in."
        />
      </div>

      {/* ---------- desktop: sticky journey ---------- */}
      <div className="svc__sticky">
        <div className="shell svc__sticky-inner">
          <nav className="svc__rail" aria-label="Services">
            <div className="svc__rail-line" aria-hidden>
              <motion.span className="svc__rail-fill" style={{ scaleY: reduce ? 1 : draw }} />
            </div>
            {services.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="svc__step"
                data-state={i === active ? "on" : i < active ? "past" : "next"}
                onClick={() => goTo(i)}
                aria-current={i === active ? "true" : undefined}
              >
                <span className="svc__step-num">{s.number}</span>
                <span className="svc__step-label">{s.title}</span>
              </button>
            ))}
          </nav>

          <div className="svc__content">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={service.id}
                className="svc__content-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? duration.micro : STEP_MS, ease }}
              >
                <p className="svc__num">{service.number}</p>
                <h3 className="svc__title">{service.title}</h3>
                <p className="svc__prop">{service.proposition}</p>
                <dl className="svc__meta">
                  <div className="svc__meta-item">
                    <dt>Deliverables</dt>
                    <dd>{service.deliverables.join(" · ")}</dd>
                  </div>
                  <div className="svc__meta-item">
                    <dt>Technologies</dt>
                    <dd>{service.technologies.join(" · ")}</dd>
                  </div>
                  <div className="svc__meta-item">
                    <dt>Ideal for</dt>
                    <dd>{service.idealFor}</dd>
                  </div>
                </dl>
                <ArrowLink className="svc__cta" href={`/contact?intent=${service.id}`} label={`Discuss ${service.title}`}>
                  Discuss {service.title}
                </ArrowLink>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="svc__aside">
            <div className="svc__visual" aria-hidden>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`v-${service.id}`}
                  className="svc__visual-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? duration.micro : STEP_MS, ease }}
                >
                  <ServiceMediaVisual service={service} reduce={reduce} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="svc__spacer" aria-hidden>
        <div className="svc__anchors">
          {services.map((s, i) => (
            <span
              key={s.id}
              className="svc__anchor"
              data-svcanchor={i}
              data-svcoffset="0"
              style={{ top: `${((i + 0.5) / services.length) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* ---------- mobile: dedicated vertical journey ---------- */}
      <div className="svc__mobile">
        <ol className="svc__mobile-list">
          {services.map((s, i) => (
            <li className="svc__m-item" key={s.id} data-svcitem={i} data-svcanchor={i}>
              <div className="svc__m-rail" aria-hidden>
                <span className="svc__m-marker" />
                <motion.span
                  className="svc__m-fill"
                  initial={reduce ? { opacity: 1 } : { scaleY: 0 }}
                  whileInView={reduce ? { opacity: 1 } : { scaleY: 1 }}
                  viewport={{ once: true, margin: "-20% 0px -40% 0px" }}
                  transition={{ duration: reduce ? duration.micro : 0.9, ease }}
                />
              </div>
              <div className="svc__m-body">
                <p className="svc__m-k">
                  <span>{s.number}</span>
                  <span aria-hidden>/</span>
                  <span>Service</span>
                </p>
                <h3 className="svc__m-title">{s.title}</h3>
                <p className="svc__m-prop">{s.proposition}</p>
                <div className="svc__m-visual" aria-hidden>
                  <MobileVisual service={s} reduce={reduce} />
                </div>
                <dl className="svc__meta">
                  <div className="svc__meta-item">
                    <dt>Deliverables</dt>
                    <dd>{s.deliverables.join(" · ")}</dd>
                  </div>
                  <div className="svc__meta-item">
                    <dt>Technologies</dt>
                    <dd>{s.technologies.join(" · ")}</dd>
                  </div>
                  <div className="svc__meta-item">
                    <dt>Ideal for</dt>
                    <dd>{s.idealFor}</dd>
                  </div>
                </dl>
                <ArrowLink className="svc__cta" href={`/contact?intent=${s.id}`} label={`Discuss ${s.title}`}>
                  Discuss {s.title}
                </ArrowLink>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MobileVisual({ service, reduce }: { service: (typeof services)[number]; reduce: boolean }) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={ref}>
      {shown || reduce ? <ServiceMediaVisual service={service} reduce={reduce} /> : <div className="pv pv--idle" />}
    </div>
  );
}

function EngagementSection() {
  const priceFor = (modelId: string) => {
    const match = pricingPlans
      .filter((p) => p.model === modelId)
      .sort((a, b) => (a.startingFrom ?? "999999").localeCompare(b.startingFrom ?? "999999"))[0];
    return match?.startingLabel ?? "On request";
  };

  return (
    <section className="pf-section">
      <div className="shell">
        <PageSectionHead
          index="04"
          label="Engagement"
          title="Project · Retainer · Contract"
          lede="Three ways to work together — one standard of engineering. INR pricing, confirmed before any work begins."
        />
        <div className="svc-eng">
          {engagementModels.map((m, i) => (
            <motion.div
              className="svc-eng__row"
              key={m.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: duration.section, delay: i * 0.06, ease }}
            >
              <p className="svc-eng__name">{m.title}</p>
              <div className="svc-eng__body">
                <h3>{m.description}</h3>
                <p className="svc-eng__desc">{m.idealFor}</p>
                <div className="svc-eng__meta">
                  <span data-k="Scope">{m.scope}</span>
                  <span data-k="Timeline">{m.timeline}</span>
                </div>
              </div>
              <p className="svc-eng__price">{priceFor(m.id)}</p>
            </motion.div>
          ))}
        </div>
        <p className="svc-eng__note">
          Pricing is indicative and depends on scope, complexity, integrations and timeline. International projects are
          available — USD pricing provided during consultation.
        </p>
      </div>
    </section>
  );
}