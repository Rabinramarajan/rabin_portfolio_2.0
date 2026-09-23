"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionTier } from "@/lib/motion-tier";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * THE CINEMATIC LAYER — one choreography for the whole site.
 *
 * /insights got its film language first (`insights/InsightsCinema.tsx`), block
 * by block, with a component wrapped around every piece of markup that moves.
 * Doing that to the other twenty routes would have meant converting a shelf of
 * server components into client components for the sake of a fade. This does
 * the same four moves by reading the DOM the server already sent:
 *
 *   1. staggered reveals   — a section's own children arrive on an 80ms beat
 *   2. word-by-word quotes — every <blockquote> assembles a word at a time
 *   3. section transitions — the outgoing section eases back as the next one
 *                            takes the screen
 *   4. image depth         — clipped media drifts against the scroll
 *
 * Why GSAP and not CSS: `base/motion-off.css` closes the cascade with
 * `* { animation: none !important; transition: none !important }`. A keyframe
 * written for any of this would be dead on arrival. GSAP writes inline style
 * properties frame by frame, which the kill-switch cannot reach.
 *
 * The rules it keeps (the same ones /insights keeps):
 *
 *   - The server HTML is the finished state. Nothing is hidden in CSS, so a
 *     reader with JavaScript off — or one who arrives before hydration — gets
 *     the page complete. `gsap.from` sets the start state at trigger time.
 *   - Reduced motion shortens and flattens; it never removes content.
 *   - Continuous work (scrub, parallax, depth) is `full` tier only. Those are
 *     the effects that cost frames on a four-core phone, and none of them
 *     carry meaning.
 *   - Reveals fire once. Re-animating on the way back up is a light show.
 *
 * Opting out: put `data-cine-skip` on anything that owns its own timeline —
 * the hero, the pinned services rail, the /insights blocks. Nothing inside it
 * is touched.
 */

const EASE = "power3.out";

/** Roots that run their own GSAP and must not be animated twice. */
const SKIP = "[data-cine-skip]";

/** Marks a section this pass has already claimed, so a nested <section> is
    not animated a second time by its parent's pass. */
const DONE = "data-cine-done";

/** How often the layer asks whether the route has finished hydrating. */
const HYDRATION_POLL_MS = 80;

/** The longest it will wait for that answer before starting anyway. */
const SETTLE_CEILING_MS = 3000;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function isSkipped(el: Element): boolean {
  return el.closest(SKIP) !== null;
}

/** Out-of-flow elements are backdrops and rails; moving them moves the page. */
function isOutOfFlow(el: Element): boolean {
  const position = getComputedStyle(el).position;
  return position === "absolute" || position === "fixed" || position === "sticky";
}

/**
 * True when the subtree parks something sticky or fixed.
 *
 * A transform on an ancestor becomes the containing block for its fixed
 * descendants and changes what a sticky one sticks to, so the section
 * transition — the one move that transforms a whole section — stays away from
 * these. The scan is capped: a section with 400 elements in it is a listing,
 * and listings are exactly where the check is cheapest to get wrong.
 */
function holdsPinnedChild(section: Element): boolean {
  const nodes = Array.from(section.querySelectorAll("*")).slice(0, 300);
  return nodes.some((node) => {
    const position = getComputedStyle(node).position;
    return position === "sticky" || position === "fixed";
  });
}

/** Containers whose children should arrive one by one rather than together. */
function isGroup(el: Element): boolean {
  if (el.children.length < 2 || el.children.length > 24) return false;
  if (el.tagName === "UL" || el.tagName === "OL" || el.tagName === "DL") return true;
  const display = getComputedStyle(el).display;
  return display === "grid" || display === "flex";
}

/**
 * The things in a section that should arrive separately.
 *
 * Nearly every section on the site is `<section><div class="shell">…</div>`,
 * so the shell's children are the section's real parts: kicker, title, lede,
 * grid. A grid or list among them hands its own children over instead, which
 * is where the stagger earns its keep — the cards land in sequence rather
 * than the box they sit in appearing all at once.
 */
function revealTargets(section: Element): HTMLElement[] {
  const shell = section.querySelector<HTMLElement>(":scope > .shell");
  const container = shell ?? section;
  const out: HTMLElement[] = [];

  for (const child of Array.from(container.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (child.hidden || isOutOfFlow(child) || isSkipped(child)) continue;
    if (isGroup(child)) {
      for (const grandchild of Array.from(child.children)) {
        if (grandchild instanceof HTMLElement && !isOutOfFlow(grandchild)) out.push(grandchild);
      }
    } else {
      out.push(child);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* 1 — staggered reveals                                               */
/* ------------------------------------------------------------------ */

function revealSection(section: HTMLElement, reduce: boolean): () => void {
  const targets = revealTargets(section);
  if (!targets.length) return () => {};

  const tween = gsap.from(targets, {
    autoAlpha: 0,
    y: reduce ? 0 : 26,
    duration: reduce ? 0.25 : 0.8,
    ease: EASE,
    /* `amount` rather than `each`: a twelve-card grid on `each` would still be
       arriving a second after the reader got there. The beat is 80ms until
       the section is big enough that the whole run has to fit in 0.9s. */
    stagger: reduce ? 0 : { each: 0.08, amount: Math.min(targets.length * 0.08, 0.9) },
    /* The tween owns `visibility` through autoAlpha, so it hands the elements
       back clean — otherwise anything left mid-tween by a filter change keeps
       an inline opacity for the rest of the session. */
    onComplete: () => gsap.set(targets, { clearProps: "visibility,opacity,transform" }),
    scrollTrigger: { trigger: section, start: "top 86%", once: true },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

/* ------------------------------------------------------------------ */
/* 2 — quotes, word by word                                            */
/* ------------------------------------------------------------------ */

/**
 * Splits a quote into words and lets them arrive in reading order.
 *
 * Only quotes that are a single run of text are split: anything carrying its
 * own markup keeps it and gets the plain reveal its section already gives it.
 * Each word is wrapped in a span that is still inline, so the quote stays one
 * selectable, copyable sentence and reads as one string to a screen reader —
 * the spans carry no roles and no aria of their own. The original text is put
 * back on cleanup, so React never finds a node it did not write.
 *
 * Reduced motion gets the line in one fade: a word-by-word reveal is exactly
 * the kind of sequential motion that request is about.
 */
function splitQuote(quote: HTMLElement, reduce: boolean): () => void {
  const text = quote.textContent?.trim();
  if (!text || quote.children.length > 0) return () => {};

  if (reduce) {
    const tween = gsap.from(quote, {
      autoAlpha: 0,
      duration: 0.25,
      onComplete: () => gsap.set(quote, { clearProps: "visibility,opacity" }),
      scrollTrigger: { trigger: quote, start: "top 88%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }

  const words = text.split(/\s+/);
  const fragment = document.createDocumentFragment();
  for (const [index, word] of words.entries()) {
    const outer = document.createElement("span");
    outer.className = "cine-w";
    const inner = document.createElement("span");
    inner.className = "cine-w__i";
    inner.textContent = word;
    outer.append(inner);
    fragment.append(outer);
    if (index < words.length - 1) fragment.append(document.createTextNode(" "));
  }
  quote.replaceChildren(fragment);

  const targets = Array.from(quote.querySelectorAll<HTMLElement>(".cine-w__i"));
  const tween = gsap.from(targets, {
    autoAlpha: 0,
    y: "0.5em",
    duration: 0.55,
    ease: EASE,
    stagger: 0.035,
    onComplete: () => gsap.set(targets, { clearProps: "visibility,opacity,transform" }),
    scrollTrigger: { trigger: quote, start: "top 88%", once: true },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    quote.textContent = text;
  };
}

/* ------------------------------------------------------------------ */
/* 3 — section transitions                                             */
/* ------------------------------------------------------------------ */

/**
 * The cut between sections: the outgoing block eases back and dims as it
 * leaves the top of the screen instead of simply scrolling off it.
 *
 * Two per cent of scale and fifteen per cent of opacity — small enough that
 * nobody reading the section notices it happening, large enough that the
 * section arriving underneath reads as the one in focus. The dimming stops at
 * 0.85, so anything still on screen is still at reading contrast.
 */
function sectionTransition(section: HTMLElement): () => void {
  if (holdsPinnedChild(section)) return () => {};

  const tween = gsap.to(section, {
    scale: 0.98,
    opacity: 0.85,
    transformOrigin: "50% 0%",
    ease: "none",
    scrollTrigger: { trigger: section, start: "bottom 70%", end: "bottom top", scrub: 0.6 },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    /* A scrubbed tween has no completion, so killing it mid-scroll would
       otherwise leave the section parked on whatever frame it was on. */
    gsap.set(section, { clearProps: "opacity,transform,transformOrigin" });
  };
}

/* ------------------------------------------------------------------ */
/* 4 — image depth                                                     */
/* ------------------------------------------------------------------ */

/**
 * Media drifting inside its frame.
 *
 * The travel is bought with scale, not with margin: the picture is pushed to
 * 112% and then moved ±6% of its own height, so the frame is never uncovered
 * at either end of the scroll. That only works where the frame clips, so a
 * frame that does not is left alone rather than being made to — an image
 * sliding out of an unclipped box is a bug, not depth.
 *
 * Small media is skipped: an avatar or a logo mark has no depth to give, and
 * a 6% drift on a 48px tile is a twitch.
 */
function imageDepth(media: HTMLElement): () => void {
  /* Cards already move under the pointer — they lift, they zoom on hover, and
     an inline transform from here would win over the CSS that does it. Depth
     is for the editorial pictures: the portrait, the case shots, the figures
     in an article. */
  if (media.closest("a, button")) return () => {};

  const frame = depthFrame(media);
  if (!frame) return () => {};
  if (frame.clientHeight < 160 || frame.clientWidth < 160) return () => {};

  const tween = gsap.fromTo(
    media,
    { yPercent: -6, scale: 1.12 },
    {
      yPercent: 6,
      scale: 1.12,
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    },
  );

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(media, { clearProps: "transform" });
    frame.removeAttribute("data-cine-depth-frame");
  };
}

/**
 * The box a picture is allowed to drift inside.
 *
 * The clip is rarely on the picture's own parent: a card cover is a full-bleed
 * span inside a rounded, clipped card two levels up, so the parent alone finds
 * almost nothing. The search walks a few levels for a real clip and stops
 * there. A <figure> or <picture> that does not clip is given the clip instead
 * — that one is a frame by definition, and `base/cinematic.css` carries the
 * rule the attribute turns on. Everything else is left alone: an image sliding
 * out of an unclipped box is a bug, not depth.
 */
function depthFrame(media: HTMLElement): HTMLElement | null {
  let node = media.parentElement;
  for (let level = 0; node && level < 4; level += 1) {
    const { overflowX, overflowY } = getComputedStyle(node);
    if (overflowX !== "visible" && overflowY !== "visible") return node;
    node = node.parentElement;
  }

  const parent = media.parentElement;
  if (parent && (parent.tagName === "FIGURE" || parent.tagName === "PICTURE")) {
    parent.setAttribute("data-cine-depth-frame", "");
    return parent;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* the layer                                                           */
/* ------------------------------------------------------------------ */

/**
 * True once React has committed every block this layer is about to touch.
 *
 * React attaches a `__reactProps$…` key to a host node when it commits it,
 * which for server markup is the moment that node is hydrated. Asking the
 * blocks themselves is what makes this precise: `__reactFiber$` appears
 * during the render pass, a third of the way into hydration (331ms against a
 * finish at 843ms on /work in development), and the deepest node in the page
 * is not the last one hydrated. Both of those read as "ready" while the
 * section this layer is about to transform was still being hydrated.
 *
 * These are private keys. They are read because React publishes no other
 * signal for "this subtree is yours now", and the caller falls back to a
 * timeout for the day they are renamed.
 */
function isCommitted(node: Element): boolean {
  return Object.keys(node).some((key) => key.startsWith("__reactProps$"));
}

function isHydrated(main: Element): boolean {
  const blocks = Array.from(main.querySelectorAll("section, [data-cine]"));
  if (!blocks.length) return isCommitted(main);
  return blocks.every(isCommitted);
}

export function CinematicLayer() {
  const pathname = usePathname();
  const reduce = useReducedMotionSafe();
  const { tier } = useMotionTier();
  /** Scrub, parallax and depth are the frame-expensive half of the language. */
  const rich = !reduce && tier === "full";
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const main = document.querySelector("main");
      if (!main) return;

      const cleanups: (() => void)[] = [];
      let claimed: HTMLElement[] = [];
      let poll: ReturnType<typeof setTimeout> | undefined;

      const scan = () => {
        /* Sections, outermost first. A nested <section> is left to its
           parent's stagger — two passes over the same copy read as a stutter,
           and two section transitions over one another multiply their dimming
           until the copy underneath is gone. querySelectorAll returns document
           order, so claiming each section as it is taken is enough to see the
           nesting; the check has to happen inside this loop rather than in a
           filter over the whole list, which would run before a single mark
           existed. */
        const sections: HTMLElement[] = [];
        for (const section of Array.from(
          main.querySelectorAll<HTMLElement>("section, [data-cine]"),
        )) {
          if (isSkipped(section)) continue;
          if (section.parentElement?.closest(`[${DONE}]`)) continue;
          section.setAttribute(DONE, "");
          sections.push(section);
          cleanups.push(revealSection(section, reduce));
          /* The transition is for real sections only. `data-cine` is how a
             route with no <section> of its own — /contact is laid out as two
             columns — asks for the stagger; scaling one column of a two-column
             page against the other is not a cut, it is a wobble. */
          if (rich && section.tagName === "SECTION") cleanups.push(sectionTransition(section));
        }
        claimed = sections;

        for (const quote of Array.from(
          main.querySelectorAll<HTMLElement>("blockquote, [data-cine-quote]"),
        )) {
          if (!isSkipped(quote)) cleanups.push(splitQuote(quote, reduce));
        }

        if (rich) {
          for (const media of Array.from(
            main.querySelectorAll<HTMLElement>("img, video, [data-cine-depth]"),
          )) {
            if (!isSkipped(media)) cleanups.push(imageDepth(media));
          }
        }
      };

      /**
       * The layer waits for the route beside it to finish hydrating.
       *
       * Writing inline transforms into markup React has not hydrated yet
       * makes React find a DOM it did not render — "a tree hydrated but some
       * attributes … didn't match", which it does not patch up, leaving the
       * page stranded on whatever GSAP had already written. Neither a frame
       * count nor a quiet MutationObserver answers this: hydrating markup
       * that matches mutates almost nothing, and a route whose client chunks
       * arrive late finishes long after the template's own effects have run —
       * measured on /work in development, the last section attaches around
       * 1250ms in. Polling is used because there is nothing to subscribe to;
       * it costs a handful of key lookups every 80ms for about a second.
       */
      const waitingSince = performance.now();
      const tick = () => {
        if (isHydrated(main) || performance.now() - waitingSince > SETTLE_CEILING_MS) {
          scan();
          return;
        }
        poll = setTimeout(tick, HYDRATION_POLL_MS);
      };
      tick();

      /* Media that decodes after the first pass changes every measurement
         under it. One refresh on load settles the triggers rather than
         leaving them keyed to a page that was 300px shorter. */
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        clearTimeout(poll);
        window.removeEventListener("load", onLoad);
        for (const cleanup of cleanups) cleanup();
        for (const section of claimed) section.removeAttribute(DONE);
      };
    },
    { scope, dependencies: [pathname, reduce, rich], revertOnUpdate: true },
  );

  /* Renders nothing visible — the ref only gives useGSAP a stable scope to
     revert against when the route changes. */
  return <div ref={scope} hidden aria-hidden />;
}
