import { TextReveal } from "@/components/motion";
import { MagneticButton } from "./MagneticButton";
export interface PageCtaAction {
  label: string;
  href: string;
  variant?: "solid" | "line";
}

export function PageCta({
  kicker,
  headline,
  lede,
  actions,
}: {
  kicker?: string;
  headline: string[];
  lede?: string;
  actions: PageCtaAction[];
}) {
  return (
    <section className="pf-cta">
      <div className="shell">
        {kicker ? <p className="pf-cta__kicker">{kicker}</p> : null}
        <TextReveal lines={headline} as="h2" className="pf-cta__title" accentIndex={headline.length - 1} />
        {lede ? <p className="pf-cta__lede">{lede}</p> : null}
        <div className="pf-cta__actions">
          {actions.map((a) => (
            <MagneticButton key={a.label} href={a.href} variant={a.variant ?? "solid"}>
              {a.label}
            </MagneticButton>
          ))}
        </div>
      </div>
    </section>
  );
}
