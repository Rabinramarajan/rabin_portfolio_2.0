import type { ReactNode } from "react";
import { TextReveal } from "@/components/motion";
import { SectionKicker } from "@/components/ui";

export interface PageMetaItem {
  label: string;
  value: string;
}

export function PageHero({
  index,
  label,
  title,
  lede,
  visual,
  meta,
  className,
}: {
  index: string;
  label: string;
  title: string[];
  lede?: string;
  visual?: ReactNode;
  meta?: PageMetaItem[];
  className?: string;
}) {
  return (
    <header className={"pf-hero" + (className ? " " + className : "")}>
      <div className="shell">
        <div className="pf-hero__grid">
          <div className="pf-hero__copy">
            <SectionKicker index={index} label={label} />
            <TextReveal lines={title} as="h1" className="pf-title" delay={0.05} accentIndex={title.length - 1} />
            {lede ? <p className="pf-lede">{lede}</p> : null}
          </div>
          {visual ? <div className="pf-hero__visual">{visual}</div> : null}
        </div>
        {meta?.length ? (
          <dl className="pf-hero__meta">
            {meta.map((m) => (
              <div className="pf-hero__meta-item" key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </header>
  );
}