import { principles } from "@/content/profile";
import { sections } from "@/content/sections";
import { SectionKicker } from "@/components/ui";

/**
 * WHY WORK WITH ME — four sentences, no elaboration.
 *
 * The long-form argument lives on /about. This block exists so the homepage
 * says something a generic portfolio cannot copy, in the gap between "here is
 * the work" and "here is the timeline".
 */
export function PrinciplesSection() {
  const intro = sections.principles;
  return (
    <section id="principles" className="section principles">
      <div className="shell">
        <SectionKicker index={intro.index} label={intro.label} />
        <h2 className="sec-title">
          {intro.title.map((line) => (
            <span key={line.text} className={line.accent ? "accent" : undefined}>
              {line.newline ? <br /> : null}
              {line.text}{" "}
            </span>
          ))}
        </h2>
        <p className="sec-lede">{intro.lede}</p>
        <ul className="principles__grid">
          {principles.map((item) => (
            <li className="principles__item" key={item.title}>
              <h3 className="principles__title">{item.title}</h3>
              <p className="principles__body">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
