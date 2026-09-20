"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotionTier } from "@/lib/motion-tier";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * INSIGHTS — the cinematic layer.
 *
 * Every primitive here is GSAP-driven rather than CSS-driven, and that is not
 * a style preference: `base/motion-off.css` ends the cascade with
 * `* { animation: none !important; transition: none !important }`. A keyframe
 * or a transition written for these blocks would be dead on arrival. GSAP
 * writes inline style properties frame by frame, which the kill-switch cannot
 * reach — the same reason the hero and the /experience route animate the way
 * they do.
 *
 * The rules the whole layer follows:
 *
 *   - The server HTML is the finished state. Nothing is hidden in CSS, so a
 *     reader with JavaScript off, or one who arrives before hydration, gets
 *     the page complete rather than a set of empty boxes waiting for a tween.
 *     `gsap.from` sets the start state at trigger-registration time instead.
 *   - Reduced motion shortens and flattens; it never removes content. A
 *     reduced-motion reader still gets a fade, because an element that simply
 *     appears mid-scroll is more startling than one that arrives in 250ms.
 *   - Continuous work — parallax scrub, pointer tilt, magnetic pull — is for
 *     the `full` motion tier only. On a four-core phone those are the effects
 *     that cost frames, and none of them carry meaning.
 *   - Reveals fire `once`. A card that re-animates every time it crosses the
 *     viewport turns a scroll back up the page into a light show.
 */

const EASE = "power3.out";

/** Elements this layer renders as. Constrained so the JSX ref stays typed
    without a cast at every call site. */
type Tag = "div" | "section" | "header" | "ul" | "ol" | "aside" | "p" | "span";

type BoxProps = {
  as?: Tag;
  className?: string;
  id?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** True when pointer tilt, magnetism and scrub are worth running at all. */
function useCinematic() {
  const reduce = useReducedMotionSafe();
  const { tier } = useMotionTier();
  return { reduce, rich: !reduce && tier === "full" };
}

/* ====================================================================
   REVEAL — the staggered entrance every block on the route shares
   ==================================================================== */

/**
 * Fades a block up as it crosses into the viewport.
 *
 * With `stagger`, the block's own direct children arrive one after another on
 * the canonical 80ms beat — the grid of cards, the row of figures, the rail
 * of links. Without it the block moves as one piece, which is what a panel or
 * a heading wants.
 *
 * `start` is "top 86%" rather than the more usual "top 80%": these blocks are
 * tall, and a later trigger means the first row of a grid has already been
 * read by the time the last row decides to arrive.
 */
export function Reveal({
  as = "div",
  className,
  id,
  style,
  children,
  stagger = false,
  y = 26,
  delay = 0,
  start = "top 86%",
}: BoxProps & {
  stagger?: boolean;
  y?: number;
  delay?: number;
  start?: string;
}) {
  /* Cast to one tag so the ref stays typed: every option in `Tag` is an
     HTMLElement, but TypeScript will not accept a single ref across the union
     of their JSX prop types. */
  const Box = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets: Element[] = stagger ? Array.from(el.children) : [el];
      if (!targets.length) return;

      const tween = gsap.from(targets, {
        autoAlpha: 0,
        y: reduce ? 0 : y,
        duration: reduce ? 0.25 : 0.8,
        delay,
        ease: EASE,
        stagger: stagger && !reduce ? 0.08 : 0,
        /* The tween owns `visibility` through autoAlpha, so it has to hand the
           elements back clean — otherwise a card left mid-tween by a filter
           change keeps an inline opacity for the rest of the session. */
        onComplete: () => gsap.set(targets, { clearProps: "visibility,opacity,transform" }),
        scrollTrigger: { trigger: el, start, once: true },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [reduce, stagger, delay, y, start], revertOnUpdate: true },
  );

  return (
    <Box ref={ref} className={className} id={id} style={style}>
      {children}
    </Box>
  );
}

/* ====================================================================
   PARALLAX — the hero, on a scrub
   ==================================================================== */

/**
 * Scrubs every descendant carrying `data-speed` against the scene's own
 * scroll progress.
 *
 * A positive speed lags behind the page (the artwork sinks), a negative one
 * runs ahead of it (the copy lifts away). The value is a fraction of the
 * viewport height, so the same number behaves the same on a laptop and on a
 * 27-inch display.
 *
 * `scrub: 0.6` rather than `true`: the raw value pins the layers to the wheel's
 * own steps, which on a trackpad reads as judder. Six tenths of a second of
 * catch-up is the difference between a camera move and a scrollbar.
 */
export function ParallaxScene({ as = "header", className, id, style, children }: BoxProps) {
  const Box = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  const { rich } = useCinematic();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !rich) return;
      const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-speed]"));
      if (!layers.length) return;

      const tweens = layers.map((layer) =>
        gsap.to(layer, {
          /* Functional values so a resize recomputes the travel instead of
             keeping the pixel distance the first layout happened to produce. */
          y: () => Number(layer.dataset.speed ?? 0) * window.innerHeight * 0.5,
          rotate: () => Number(layer.dataset.spin ?? 0),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }),
      );

      return () => {
        for (const t of tweens) {
          t.scrollTrigger?.kill();
          t.kill();
        }
      };
    },
    { scope: ref, dependencies: [rich], revertOnUpdate: true },
  );

  return (
    <Box ref={ref} className={className} id={id} style={style}>
      {children}
    </Box>
  );
}

/**
 * The hero's opening move — the one sequence on the route that plays on load
 * rather than on scroll, because it is already in view when the page arrives.
 *
 * Order comes from `data-cue` on the descendants rather than from DOM order,
 * so the artwork can start before the lede it sits beside without the markup
 * being rearranged to say so.
 */
export function HeroEntrance({ as = "div", className, id, style, children }: BoxProps) {
  const Box = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-cue]")).sort(
        (a, b) => Number(a.dataset.cue) - Number(b.dataset.cue),
      );
      if (!steps.length) return;

      const tween = gsap.from(steps, {
        autoAlpha: 0,
        y: reduce ? 0 : 22,
        duration: reduce ? 0.25 : 0.9,
        ease: EASE,
        stagger: reduce ? 0 : 0.09,
        onComplete: () => gsap.set(steps, { clearProps: "visibility,opacity,transform" }),
      });
      return () => tween.kill();
    },
    { scope: ref, dependencies: [reduce], revertOnUpdate: true },
  );

  return (
    <Box ref={ref} className={className} id={id} style={style}>
      {children}
    </Box>
  );
}

/* ====================================================================
   TILT — pointer-driven depth on the cards
   ==================================================================== */

type TiltSetters = {
  rotateX: (v: number) => void;
  rotateY: (v: number) => void;
  lift: (v: number) => void;
  depthX?: (v: number) => void;
  depthY?: (v: number) => void;
};

/**
 * Gives every card inside the field a 3D tilt that follows the pointer, and
 * moves the card's cover image against that tilt so the artwork sits at a
 * different depth from the frame around it.
 *
 * One listener on the field, not one per card. The cards are server-rendered
 * links shared with the homepage teaser, and a per-card React wrapper would
 * mean either a client component for the whole grid or an extra element
 * between the grid and its items — the first ships the listing to the browser
 * for no reason, the second breaks `grid-template-columns`. Delegation costs
 * one `closest()` per pointer move and leaves the markup exactly as it was.
 *
 * `quickTo` rather than a tween per event: the setters are created once per
 * card and then fed a number, so a pointer moving across a card is an
 * interpolation target changing, not two hundred tweens being allocated.
 */
export function TiltField({
  as = "div",
  className,
  id,
  style,
  children,
  selector = ".inh-card",
  depthSelector = ".inh-cover",
  max = 6,
  lift = -8,
}: BoxProps & {
  selector?: string;
  /** What moves against the tilt inside each card. `null` leaves the card's
      image alone, for the one case where something else already owns its
      scale — the featured cover, which is zoomed by `ScrubZoom`. Two owners
      on one transform means the last frame written wins, which reads as a
      flicker. */
  depthSelector?: string | null;
  /** Peak rotation in degrees at the corners of a card. */
  max?: number;
  /** How far the card rises toward the reader, in pixels. */
  lift?: number;
}) {
  const Box = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  const { rich } = useCinematic();

  useGSAP(
    () => {
      const field = ref.current;
      if (!field || !rich) return;
      /* A coarse pointer has no hover state to speak of: the tilt would fire
         once on tap and stay where the thumb left it. */
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const setters = new Map<HTMLElement, TiltSetters>();
      let active: HTMLElement | null = null;

      const settersFor = (card: HTMLElement): TiltSetters => {
        const existing = setters.get(card);
        if (existing) return existing;
        gsap.set(card, { transformPerspective: 900, transformStyle: "preserve-3d" });
        const image = depthSelector ? card.querySelector<HTMLElement>(depthSelector) : null;
        const made: TiltSetters = {
          rotateX: gsap.quickTo(card, "rotationX", { duration: 0.35, ease: "power3" }),
          rotateY: gsap.quickTo(card, "rotationY", { duration: 0.35, ease: "power3" }),
          lift: gsap.quickTo(card, "y", { duration: 0.35, ease: "power3" }),
          depthX: image ? gsap.quickTo(image, "x", { duration: 0.5, ease: "power3" }) : undefined,
          depthY: image ? gsap.quickTo(image, "y", { duration: 0.5, ease: "power3" }) : undefined,
        };
        setters.set(card, made);
        return made;
      };

      const rest = (card: HTMLElement) => {
        const s = settersFor(card);
        s.rotateX(0);
        s.rotateY(0);
        s.lift(0);
        s.depthX?.(0);
        s.depthY?.(0);
        const image = depthSelector ? card.querySelector<HTMLElement>(depthSelector) : null;
        if (image) gsap.to(image, { scale: 1, duration: 0.35, ease: "power3" });
      };

      const onMove = (event: PointerEvent) => {
        const card = (event.target as HTMLElement | null)?.closest<HTMLElement>(selector) ?? null;
        if (card !== active) {
          if (active) rest(active);
          active = card;
          if (card) {
            const image = depthSelector ? card.querySelector<HTMLElement>(depthSelector) : null;
            /* The image is scaled up the moment the card takes the pointer so
               that moving it inside its frame never uncovers an edge. */
            if (image) gsap.to(image, { scale: 1.08, duration: 0.4, ease: "power3" });
          }
        }
        if (!card) return;

        const box = card.getBoundingClientRect();
        // -1 … 1 from the centre of the card, on both axes.
        const px = (event.clientX - box.left) / box.width - 0.5;
        const py = (event.clientY - box.top) / box.height - 0.5;
        const s = settersFor(card);
        // Negated on X so the card leans toward the pointer, not away from it.
        s.rotateX(-py * max * 2);
        s.rotateY(px * max * 2);
        s.lift(lift);
        s.depthX?.(-px * 14);
        s.depthY?.(-py * 12);
      };

      const onLeave = () => {
        if (active) rest(active);
        active = null;
      };

      field.addEventListener("pointermove", onMove);
      field.addEventListener("pointerleave", onLeave);
      return () => {
        field.removeEventListener("pointermove", onMove);
        field.removeEventListener("pointerleave", onLeave);
        for (const card of setters.keys()) {
          gsap.set(card, { clearProps: "transform,transformPerspective,transformStyle" });
          const image = depthSelector ? card.querySelector<HTMLElement>(depthSelector) : null;
          if (image) gsap.set(image, { clearProps: "transform" });
        }
      };
    },
    { scope: ref, dependencies: [rich, selector, depthSelector, max, lift], revertOnUpdate: true },
  );

  return (
    <Box ref={ref} className={className} id={id} style={style}>
      {children}
    </Box>
  );
}

/* ====================================================================
   MAGNETIC — the closing call to action
   ==================================================================== */

/**
 * Pulls its children a short way toward the pointer while it is over them.
 *
 * The travel is capped at a third of the distance from the centre, so the
 * button never leaves the area the reader is aiming at — a magnetic target
 * that moves further than the cursor is a target you have to chase.
 */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { rich } = useCinematic();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !rich) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

      const onMove = (event: PointerEvent) => {
        const box = el.getBoundingClientRect();
        x((event.clientX - (box.left + box.width / 2)) * 0.33);
        y((event.clientY - (box.top + box.height / 2)) * 0.33);
      };
      const onLeave = () => {
        x(0);
        y(0);
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        gsap.set(el, { clearProps: "transform" });
      };
    },
    { scope: ref, dependencies: [rich], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={"magnetic" + (className ? " " + className : "")}>
      {children}
    </span>
  );
}

/* ====================================================================
   COUNTER — the figures above the grid
   ==================================================================== */

/** Splits "8 min" into 8 and " min"; returns null for "Sep 2025" and "—". */
function splitNumber(value: string) {
  const match = /^(\d[\d,]*)(.*)$/.exec(value);
  if (!match) return null;
  return { target: Number(match[1].replace(/,/g, "")), suffix: match[2] };
}

/**
 * Counts a figure up from zero when it comes into view.
 *
 * The rendered text is the final value from the first paint, so the server
 * HTML, the no-JS reading and the screen-reader announcement all carry the
 * real number. The count is written straight to the text node afterwards
 * rather than held in state: four figures ticking at 60fps through React
 * would be roughly two hundred renders of the hub for an effect that is
 * decoration.
 *
 * Values that are not numbers — a month, an em dash — are returned untouched.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionSafe();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce) return;
      const parts = splitNumber(value);
      if (!parts || parts.target === 0) return;

      const counter = { n: 0 };
      const tween = gsap.to(counter, {
        n: parts.target,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(counter.n) + parts.suffix;
        },
        onComplete: () => {
          el.textContent = value;
        },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        el.textContent = value;
      };
    },
    { scope: ref, dependencies: [value, reduce], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

/* ====================================================================
   CHART — the cadence bars, drawn
   ==================================================================== */

/**
 * Grows the cadence bars out of the baseline, left to right, when the panel
 * arrives.
 *
 * `scaleY` from a bottom origin rather than an animated height: the bars are
 * the only thing on the route that could trigger layout on every frame, and
 * a transform composites.
 */
export function ChartDraw({
  className,
  children,
  role,
  delay = 0,
  "aria-label": ariaLabel,
}: {
  className?: string;
  children: ReactNode;
  /** Held back so the three panels in this row do not all animate at once —
      see the note on `Constellation`. */
  delay?: number;
  /* The chart is announced as one image with the whole series in its label,
     so those two attributes have to reach the element this renders. */
  role?: string;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const bars = Array.from(el.querySelectorAll<HTMLElement>(".inh-chart__bar"));
      if (!bars.length) return;

      const tween = gsap.from(bars, {
        scaleY: 0,
        transformOrigin: "50% 100%",
        duration: reduce ? 0.25 : 0.8,
        delay: reduce ? 0 : delay,
        ease: EASE,
        stagger: reduce ? 0 : 0.07,
        onComplete: () => gsap.set(bars, { clearProps: "transform,transformOrigin" }),
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [reduce, delay], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className} role={role} aria-label={ariaLabel}>
      {children}
    </div>
  );
}

/* ====================================================================
   WORD REVEAL — the pull quote
   ==================================================================== */

/**
 * Brings a quote in a word at a time.
 *
 * The words are real text nodes inside inline spans, so the quote is still
 * one selectable, copyable sentence and still reads as one string to a screen
 * reader — the spans carry no roles and no aria of their own.
 *
 * Reduced motion gets the whole line in a single fade: a word-by-word reveal
 * is exactly the kind of sequential motion that request is about.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** Held back so the three panels in this row do not all animate at once —
      see the note on `Constellation`. */
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionSafe();
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = reduce ? [el] : Array.from(el.querySelectorAll<HTMLElement>(".inh-word__w"));
      if (!targets.length) return;

      const tween = gsap.from(targets, {
        autoAlpha: 0,
        y: reduce ? 0 : "0.5em",
        duration: reduce ? 0.25 : 0.55,
        delay: reduce ? 0 : delay,
        ease: EASE,
        stagger: reduce ? 0 : 0.035,
        onComplete: () => gsap.set(targets, { clearProps: "visibility,opacity,transform" }),
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [reduce, text, delay], revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span className="inh-word" key={word + i}>
          <span className="inh-word__w">{word}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

/* ====================================================================
   CONSTELLATION — the topics panel
   ==================================================================== */

/**
 * The field of light behind the topic chips.
 *
 * One node per topic, laid out on a fixed lattice and joined into a chain, so
 * "what I write about" has a shape rather than being a bag of pills. The
 * coordinates are computed from the index alone — deterministic, so the
 * server and the client draw the same picture — and the whole thing is
 * decorative: it carries the topics' geometry, never their names.
 *
 * `lit` is the index the reader is on. Nothing is lit until they hover or
 * filter, which keeps the resting state quiet.
 *
 * This is the first of the three effects in the panel row, and it carries no
 * delay for that reason. The cadence chart and the pull quote sit beside it
 * and hold back by 150ms and 300ms, so the row reads as one move travelling
 * left to right rather than as three unrelated animations going off together
 * in one screen — which is what it looked like before, and is the fastest way
 * to make a page feel busy rather than composed.
 */
export function Constellation({
  topics,
  lit,
}: {
  /** The subjects, in order. Each node takes its own topic's hue through the
      `data-topic` attribute, so the field is a legend as well as a picture. */
  topics: readonly string[];
  lit: number | null;
}) {
  const count = topics.length;
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotionSafe();

  const points = Array.from({ length: count }, (_, i) => {
    /* A slow diagonal drift with an alternating vertical offset: enough
       irregularity to read as a constellation, no randomness to desynchronise
       hydration. */
    const t = count > 1 ? i / (count - 1) : 0.5;
    return {
      x: 4 + t * 92,
      // 4…20 inside a 24-tall box: a wandering line rather than a zigzag.
      y: 12 + Math.sin(i * 1.9) * 6 + (i % 2 === 0 ? -2 : 2),
    };
  });

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const nodes = Array.from(el.querySelectorAll<SVGElement>(".inh-const__node"));
      const links = Array.from(el.querySelectorAll<SVGElement>(".inh-const__link"));

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
      tl.from(nodes, {
        autoAlpha: 0,
        scale: reduce ? 1 : 0.2,
        transformOrigin: "50% 50%",
        duration: reduce ? 0.25 : 0.5,
        ease: "back.out(2)",
        stagger: reduce ? 0 : 0.07,
      }).from(
        links,
        {
          autoAlpha: 0,
          /* The chain draws out of the node it starts at rather than fading in
             as a finished web. Scaling from the left end is the stand-in for a
             stroke-dash draw that needs no paid plugin. */
          scaleX: reduce ? 1 : 0,
          transformOrigin: "0% 50%",
          duration: reduce ? 0.2 : 0.6,
          ease: EASE,
          stagger: reduce ? 0 : 0.05,
        },
        "-=0.3",
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: ref, dependencies: [reduce, count], revertOnUpdate: true },
  );

  /* The lit node is driven by an attribute rather than a tween: it follows the
     pointer across the chips, and a half-second interpolation on something
     that changes that often reads as lag. */
  return (
    <svg
      ref={ref}
      className="inh-const"
      viewBox="0 0 100 24"
      /* The strip stretches to the panel's width, so the nodes come out as
         slightly wide ellipses rather than circles. At this radius that is
         invisible, and it buys a chain that spans the panel at any width
         without a resize observer behind it. */
      preserveAspectRatio="none"
      aria-hidden
    >
      {points.slice(0, -1).map((p, i) => (
        <line
          className="inh-const__link"
          key={"l" + i}
          data-topic={topics[i]}
          x1={p.x}
          y1={p.y}
          x2={points[i + 1].x}
          y2={points[i + 1].y}
          data-lit={lit === i || lit === i + 1 ? "" : undefined}
        />
      ))}
      {points.map((p, i) => (
        <circle
          className="inh-const__node"
          key={"n" + i}
          cx={p.x}
          cy={p.y}
          r={lit === i ? 1.9 : 1.1}
          data-topic={topics[i]}
          data-lit={lit === i ? "" : undefined}
        />
      ))}
    </svg>
  );
}

/* ====================================================================
   SCRUBBED — motion tied to the scrollbar rather than triggered by it

   Everything above plays on a cue: it fires once when a block arrives
   and is then over. What follows is the other half of the language —
   tweens with no duration of their own, whose playhead IS the scroll
   position. The reader is driving, so these have to be honest about
   position: a scrubbed effect still running after the element it
   belongs to has left reads as lag, not as choreography.

   All of them fall back to the finished state under reduced motion or
   the basic tier, and none of them gate content: the scrubbed value is
   always a transform or a colour, never whether something is there.
   ==================================================================== */

/**
 * A heading that lights up word by word as it crosses the screen.
 *
 * The words start at the muted text colour and turn to full contrast on a
 * scrub, so the sentence is legible the whole time — the scrub moves emphasis
 * through it rather than revealing it. That distinction is what makes this
 * safe on a heading: nothing is ever invisible, so the line reads at any
 * scroll position, on any input device, and with the tween not running at all.
 */
export function ScrubText({
  text,
  as = "span",
  className,
}: {
  text: string;
  as?: "span" | "p";
  className?: string;
}) {
  const Box = as as "span";
  const ref = useRef<HTMLSpanElement>(null);
  const { rich } = useCinematic();
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !rich) return;
      const targets = Array.from(el.querySelectorAll<HTMLElement>(".inh-scrub__w"));
      if (!targets.length) return;

      const tween = gsap.fromTo(
        targets,
        /* Muted, not faint. If the block is the last thing on a short page the
           scrub can run out of scroll before the sweep finishes, and whatever
           it stops on has to be comfortable body copy — so the "before" state
           is the same colour the site sets ledes in. */
        { color: "var(--color-text-muted)" },
        {
          color: "var(--color-text)",
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: el,
            /* The sweep runs over the middle of the screen: starting at the
               bottom edge would finish the sentence before it is comfortably
               in reading position. */
            start: "top 82%",
            end: "bottom 52%",
            scrub: 0.5,
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [rich, text], revertOnUpdate: true },
  );

  return (
    <Box ref={ref} className={className}>
      {words.map((word, i) => (
        <span className="inh-scrub__w" key={word + i}>
          {word}
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Box>
  );
}

/**
 * The camera move on the featured card.
 *
 * Its cover starts pushed in and settles to its natural size as the card
 * reaches the middle of the screen — the one shot on the route that is a zoom
 * rather than a translation. Scrubbed rather than played, so scrolling back up
 * runs it backwards and the card is never caught on a frame it cannot leave.
 */
export function ScrubZoom({
  className,
  children,
  from = 1.14,
  selector,
}: {
  className?: string;
  children: ReactNode;
  /** Scale at the start of the move. */
  from?: number;
  /** What to zoom, when it is not the wrapper itself. */
  selector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { rich } = useCinematic();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !rich) return;
      const target = selector ? el.querySelector<HTMLElement>(selector) : el;
      if (!target) return;

      const tween = gsap.fromTo(
        target,
        { scale: from },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "center center",
            scrub: 0.7,
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [rich, from, selector], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * The transition between sections: a block eases back and dims as it leaves
 * the top of the screen instead of simply scrolling off it.
 *
 * Two per cent of scale and fifteen per cent of opacity — small enough that
 * nobody reading the section will notice it happening, large enough that the
 * section arriving underneath reads as the one in focus. That is the whole
 * trick: the cut is legible because the outgoing shot gives way, not because
 * the incoming one shouts. The dimming stops at 0.85, so anything still on
 * screen is still at reading contrast.
 */
export function ExitFade({ as = "div", className, id, style, children }: BoxProps) {
  const Box = as as "div";
  const ref = useRef<HTMLDivElement>(null);
  const { rich } = useCinematic();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !rich) return;

      const tween = gsap.to(el, {
        scale: 0.98,
        opacity: 0.85,
        transformOrigin: "50% 0%",
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "bottom 70%",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [rich], revertOnUpdate: true },
  );

  return (
    <Box ref={ref} className={className} id={id} style={style}>
      {children}
    </Box>
  );
}

/**
 * The spine down the side of the listing, drawn by scroll position.
 *
 * It is the one piece of chrome on the route whose only job is to say where
 * you are in the listing — the site's own progress bar is pinned to the top of
 * the window and belongs to the document, while this belongs to the grid.
 * Decorative, so it is hidden from assistive technology, and hidden outright
 * on any viewport too narrow to have a margin to put it in.
 */
export function ScrollSpine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { rich } = useCinematic();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !rich) return;
      const fill = el.querySelector<HTMLElement>(".inh-spine__fill");
      if (!fill) return;

      const tween = gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 70%", end: "bottom bottom", scrub: 0.4 },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [rich], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className="inh-spine-wrap">
      <span className="inh-spine" aria-hidden>
        <span className="inh-spine__fill" />
      </span>
      {children}
    </div>
  );
}
