import Image from "next/image";
import Link from "next/link";
import { isLinkLive } from "@/content/insights";
import type { InsightBlock } from "@/content/types";
import { insightSections } from "@/lib/insightSections";

/**
 * Renders an article body.
 *
 * Deliberately no syntax-highlighting library: the CSP allows scripts only
 * from a short CDN allowlist, a highlighter would run on every article view to
 * recolour text that is already legible, and `<pre><code>` is what both screen
 * readers and extraction pipelines expect to find. Colour is not carrying any
 * meaning here that the code itself does not.
 *
 * Headings render as `<h2>`, which is also what gives these pages a real
 * document outline. The slot number rendered beside each one is decoration
 * over an already-complete heading, so it is marked aria-hidden — a screen
 * reader announcing "zero two Opportunities Ahead" is worse than the heading
 * on its own.
 *
 * Ids and numbers come from `insightSections`, the same pass the contents rail
 * reads, so a heading cannot be numbered one way in the prose and another way
 * in the sidebar.
 */
export function InsightBody({ blocks }: { blocks: InsightBlock[] }) {
  const sections = insightSections(blocks);
  let headingIndex = 0;

  return (
    <>
      {blocks.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p className="insd-p" key={i}>
              {block}
            </p>
          );
        }

        if (block.type === "subheading") {
          return <h3 className="insd-h3" key={i}>{block.text}</h3>;
        }

        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return <List className="insd-list insd-p" key={i}>{block.items.map((text, index) => <li key={index}>{text}</li>)}</List>;
        }

        if (block.type === "link") {
          return <p className="insd-p" key={i}>{isLinkLive(block.href) ? <Link href={block.href}>{block.text}</Link> : block.text}</p>;
        }

        if (block.type === "heading") {
          const section = sections[headingIndex++];
          return (
            <h2
              className="insd-h2"
              key={i}
              id={section?.id}
              data-plain={section?.number ? undefined : "true"}
            >
              {section?.number ? (
                <span className="insd-h2__no" aria-hidden>
                  {section.number}
                </span>
              ) : null}
              <span className="insd-h2__text">{block.text}</span>
            </h2>
          );
        }

        if (block.type === "aside") {
          /* The author's own emphasised line. In the previous design this was
             a tinted note; here it is the article's pull quote, which is what
             it always read as. */
          return (
            <aside className="insd-quote" key={i}>
              <span className="insd-quote__mark" aria-hidden>
                &ldquo;
              </span>
              {/* The article pull quote assembles a word at a time — see
                  components/motion/CinematicLayer. It is an <aside>, not a
                  <blockquote>, so it asks for the treatment by hand. */}
              <p className="insd-quote__text" data-cine-quote>
                {block.text}
              </p>
            </aside>
          );
        }

        if (block.type === "image") {
          return (
            <figure className="insd-figure" key={i}>
              <Image
                src={block.src}
                alt={block.alt}
                width={block.width}
                height={block.height}
                priority={block.priority}
                /* These diagrams break the prose measure, so the rendered box
                   is wider than the column on desktop and full-width below.
                   Matched to `.insd-figure`'s own `min(48rem, 92vw)` — 44rem
                   understated it and cost a small upscale on every figure. */
                sizes="(max-width: 48rem) 92vw, 768px"
                quality={90}
              />
              {block.caption ? (
                <figcaption className="insd-figure__caption">{block.caption}</figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <figure className="insd-code" key={i}>
            {block.language ? (
              <span className="insd-code__lang" aria-hidden>
                {block.language}
              </span>
            ) : null}
            <pre>
              <code data-language={block.language}>{block.code}</code>
            </pre>
            {block.caption ? (
              <figcaption className="insd-code__caption">{block.caption}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </>
  );
}
