import Image from "next/image";
import type { InsightBlock } from "@/content/types";

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
 * document outline — before this the only h2 on an article was the footer CTA.
 */
export function InsightBody({ blocks }: { blocks: InsightBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p className="ins-p" key={i}>
              {block}
            </p>
          );
        }

        if (block.type === "heading") {
          return (
            <h2 className="ins-h2" key={i} id={slugify(block.text)}>
              {block.text}
            </h2>
          );
        }

        if (block.type === "aside") {
          return (
            <aside className="ins-aside" key={i}>
              {block.text}
            </aside>
          );
        }

        if (block.type === "image") {
          return (
            <figure className="ins-figure" key={i}>
              <Image
                src={block.src}
                alt={block.alt}
                width={block.width}
                height={block.height}
                priority={block.priority}
                /* These diagrams break the 42rem measure, so the rendered box
                   is wider than the prose on desktop and full-width below it. */
                sizes="(max-width: 48rem) 100vw, 56rem"
              />
              {block.caption ? (
                <figcaption className="ins-figure__caption">{block.caption}</figcaption>
              ) : null}
            </figure>
          );
        }

        return (
          <figure className="ins-code" key={i}>
            <pre>
              <code data-language={block.language}>{block.code}</code>
            </pre>
            {block.caption ? (
              <figcaption className="ins-code__caption">{block.caption}</figcaption>
            ) : null}
          </figure>
        );
      })}
    </>
  );
}

/** Stable anchor for a heading, so sections are linkable and citable. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
