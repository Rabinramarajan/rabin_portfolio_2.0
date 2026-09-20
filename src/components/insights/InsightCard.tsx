import Link from "next/link";
import { insightDate, insightReadMinutes } from "@/content/insights";
import type { Insight } from "@/content/types";
import type { SectionHeadingLevel } from "@/components/ui";
import { itemHeadingLevel } from "@/components/ui";
import { InsightCover } from "@/components/insights/InsightCover";

/**
 * One article in a grid.
 *
 * The image area takes the article's `cover` when it has one and the
 * generated plate for its topic when it does not, so the card has the same
 * shape either way. The slot number sits over the image rather than instead
 * of it.
 *
 * `headingLevel` is the level of the *section* the card sits in; the card
 * title renders one below it, so the outline stays contiguous whether the
 * grid is on the homepage (section h2) or on /insights (section h1).
 */
export function InsightCard({
  item,
  headingLevel = "h2",
  index = 0,
}: {
  item: Insight;
  headingLevel?: SectionHeadingLevel;
  index?: number;
}) {
  const minutes = insightReadMinutes(item);
  return (
    <Link
      className="inh-card"
      href={"/insights/" + item.id}
      data-topic={item.topic}
      /* Consumed by the stagger in insights-hub.css. Capped so a long list
         never ends on a card that takes a second and a half to arrive. */
      style={{ "--i": Math.min(index, 7) } as React.CSSProperties}
    >
      <span className="inh-card__plate">
        <InsightCover
          item={item}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22rem"
        />
        {/* No slot number here any more.

            It was `insightNumber`, which is an article's index in the
            date-sorted set — not a position in anything a reader follows. The
            grid is a filterable catalogue, so the figure was at best inert and
            at worst wrong: filtering to one topic left a single card labelled
            "07" with nothing on screen for that 7 to count. The ordered rail
            under "Start here" keeps its numbers, because that list really is a
            reading order. */}
      </span>
      <span className="inh-card__body">
        <span className="inh-card__meta">
          {item.topic ? <span className="inh-chip">{item.topic}</span> : null}
          <span className="inh-card__read">{minutes} min read</span>
        </span>
        {itemHeadingLevel(headingLevel) === "h2" ? (
          <h2 className="inh-card__title">{item.title}</h2>
        ) : (
          <h3 className="inh-card__title">{item.title}</h3>
        )}
        <span className="inh-card__dek">{item.dek}</span>
        <span className="inh-card__foot">
          {item.datePublished ? (
            <time className="inh-card__date" dateTime={item.datePublished}>
              {insightDate(item.datePublished)}
            </time>
          ) : (
            <span />
          )}
          <span className="inh-card__arrow" aria-hidden>
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path d="M3 13 13 3M6 3h7v7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </span>
      </span>
    </Link>
  );
}
