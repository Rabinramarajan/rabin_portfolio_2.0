import { TextReveal } from "@/components/motion";
import { MagneticButton } from "@/components/pages/MagneticButton";
import { contactCopy } from "@/content/contact";

export function ContactCta() {
  const { cta } = contactCopy;
  return (
    <section className="cp-cta">
      <div className="shell">
        <TextReveal lines={[...cta.title]} as="h2" className="cp-cta__title" accentIndex={1} />
        <div className="pf-cta__actions">
          <MagneticButton href={cta.primary.href}>{cta.primary.label}</MagneticButton>
          <MagneticButton href={cta.secondary.href} variant="line">
            {cta.secondary.label}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
