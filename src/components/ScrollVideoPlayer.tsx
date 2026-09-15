"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useHydrated } from "@/lib/useHydrated";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

export interface ScrollVideoPlayerProps {
  /** Video source. For mode="scroll" this MUST be keyint=1 encoded. */
  src: string;
  /** Static first frame. Shown until metadata loads, and as the whole
   *  component under prefers-reduced-motion. */
  poster?: string;
  /** Candidate widths for `poster`, as a plain srcset string. The poster is
   *  usually the LCP element, so offering narrow cuts saves the bulk of its
   *  bytes on phones. Any caller passing this must mirror it in whatever
   *  preload it emits, or the browser fetches two different files. */
  posterSrcSet?: string;
  /** `sizes` for `posterSrcSet`. Defaults to the full viewport width. */
  posterSizes?: string;
  /** Optional smaller second source, offered before the mp4. */
  webmSrc?: string;
  /** "scroll" scrubs currentTime from scroll position; "autoplay" just plays. */
  mode: "scroll" | "autoplay";
  /** Scroll distance mapped to the full duration. "scroll" mode only. */
  scrollHeight?: string;
  /** "autoplay" mode only. */
  loop?: boolean;
  /** ScrollTrigger scrub. `true` binds frames to the raw scroll position,
   *  which stutters on wheel input because one notch jumps many frames at
   *  once. A number is the seconds of catch-up smoothing. */
  scrub?: boolean | number;
  /** Aspect ratio for the "autoplay" natural-height container. */
  aspectRatio?: string;
  /** Heading / CTA content layered over the video. */
  overlay?: ReactNode;

  /* Styling hooks.
     Every structural element is separately addressable so a caller with its
     own design-system classes (gradient scrims, masks, blend layers) can drop
     them in without this component knowing anything about them. Each falls
     back to a sensible Tailwind default when omitted. */

  /** The video container. Kept as className for the common case. */
  className?: string;
  /** The tall outer track. "scroll" mode only. */
  trackClassName?: string;
  /** The element wrapping the video, poster and layers. */
  mediaClassName?: string;
  /** The video element itself. */
  videoClassName?: string;
  /** The poster image. */
  posterClassName?: string;
  /** Scrims / vignettes / masks, drawn over the video and under overlay. */
  layers?: ReactNode;
  /** Element type for the video container - "section" when it is a landmark. */
  as?: "div" | "section";
  /** Spread onto the video container (id, aria-labelledby and friends). */
  containerProps?: Record<string, unknown>;
}

/**
 * A video element in one of two mutually exclusive playback modes.
 *
 * "scroll" - the outer track is scrollHeight tall and the video container
 * sticks inside it, so the surplus height is pure scroll distance. That
 * distance is written straight onto video.currentTime; play() never drives a
 * frame, which is what makes scrolling back up rewind exactly.
 *
 * "autoplay" - no track, no ScrollTrigger, natural (or aspect-ratio) height,
 * play() called defensively on mount with a manual-play fallback.
 *
 * Under prefers-reduced-motion neither mode animates: "scroll" renders the
 * poster alone at one viewport tall, and "autoplay" holds the poster without
 * playing.
 */
export function ScrollVideoPlayer({
  src,
  poster,
  posterSrcSet,
  posterSizes = "100vw",
  webmSrc,
  mode,
  scrollHeight = "300vh",
  loop = false,
  scrub = 0.5,
  aspectRatio = "16 / 9",
  overlay,
  className,
  trackClassName,
  mediaClassName,
  videoClassName,
  posterClassName,
  layers,
  as: Container = "div",
  containerProps,
}: ScrollVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  /* Whether the video has a decoded frame to show, which is a different
     question from whether it is wired up.
     A `ready` flag used to drive the crossfade too, set the moment the
     mode's setup runs — on `loadedmetadata` in scroll mode, synchronously on
     mount in autoplay mode. Both are before a single frame exists, so the
     poster faded out and handed the largest paint on the page to an empty
     <video>. LCP then waited on the first frame of a 4.8 MB reel instead of
     resolving against the 14 KB poster the head already preloads at high
     priority — measured as the LCP element on a phone, at 2.1s on a
     connection with no throttling at all.
     Gating the swap on `loadeddata` (readyState 2, first frame decoded)
     leaves the poster as the painted pixel until the video can actually
     replace it. The swap is opacity-only either way, so nothing shifts. */
  const [painted, setPainted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  /* Gated on prefers-reduced-motion only - deliberately NOT on the site's
     motion tier, which also drops to "basic" for low core counts, low memory
     or a stored preference, any of which would silently kill the video.

     The preference reads as its SSR default on the client's first render, so
     branching markup on it directly is a hydration mismatch - and React does
     not patch up mismatched attributes, which strands the DOM with the
     server's classes. useHydrated defers the swap to an ordinary
     post-hydration re-render, which the DOM does follow. */
  const prefersReduced = useReducedMotion();
  const hydrated = useHydrated();
  const reduced = hydrated && !!prefersReduced;

  /* The reel is multi-megabyte. With preload="auto" it starts downloading
     during the initial page load and competes with the poster, the fonts and
     the JS bundle for bandwidth, which pushes LCP out. Only metadata is
     fetched up front (enough for the scrub binding); the full buffer is
     requested once the page has finished loading. */
  const [fullPreload, setFullPreload] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const boost = () => setFullPreload(true);
    if (document.readyState === "complete") {
      const id = window.setTimeout(boost, 200);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", boost, { once: true });
    return () => window.removeEventListener("load", boost);
  }, [reduced, mode]);

  /* The <source> children only mount once `fullPreload` is true, and a <video>
     ignores sources added after it has already picked one — load() is what
     makes it re-run selection against the children that now exist. Separate
     effect rather than inside `boost` so it runs after React has committed
     them. */
  useEffect(() => {
    if (!fullPreload) return;
    videoRef.current?.load();
  }, [fullPreload]);

  /* scroll mode */
  useGSAP(
    () => {
      if (mode !== "scroll" || reduced) return;
      const video = videoRef.current;
      const wrapper = wrapperRef.current;
      if (!video || !wrapper) return;

      let trigger: ScrollTrigger | null = null;

      const bind = () => {
        // iOS Safari throttles seeks on a video the decoder has never been
        // handed. One play/pause primes it; playback never advances a frame.
        video
          .play()
          .then(() => video.pause())
          .catch(() => {
            /* blocked - seeking still works on modern iOS */
          });

        trigger = ScrollTrigger.create({
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub,
          onUpdate: (self) => {
            const { duration } = video;
            if (duration) video.currentTime = self.progress * duration;
          },
        });
      };

      if (video.readyState >= 1) {
        bind();
      } else {
        video.addEventListener("loadedmetadata", bind, { once: true });
      }

      return () => {
        video.removeEventListener("loadedmetadata", bind);
        trigger?.kill();
      };
    },
    /* revertOnUpdate is required: without it useGSAP only cleans up on
       unmount, so a mode flip would leave the old ScrollTrigger alive and
       still writing currentTime. */
    { scope: wrapperRef, dependencies: [mode, reduced, scrub], revertOnUpdate: true },
  );

  /* autoplay mode */
  useEffect(() => {
    // A reduced-motion visitor gets the poster and no playback at all, rather
    // than a single non-looping pass.
    if (mode !== "autoplay" || reduced) return;
    /* Held until `fullPreload`, which is the window load event plus 200ms.
       play() is a download trigger: it makes the browser buffer the reel
       regardless of the preload attribute, so calling it on mount put the
       whole ~4.7 MB file on the wire during the exact window that decides
       LCP. On a phone that is the entire connection, and the poster — already
       decoded and waiting since ~190ms — could not get painted behind it.
       Measured as 79% of a 5.3s LCP spent in render delay.

       Deferring only moves the first frame, not the painted pixel: the poster
       IS the reel's first frame and holds at opacity 1 until `painted`, so
       there is nothing to see happen. */
    if (!fullPreload) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().then(
      () => setBlocked(false),
      () => setBlocked(true),
    );
  }, [mode, reduced, fullPreload]);

  /* One listener for both modes: the crossfade is about pixels, not playback,
     so it does not care which mode put the frame there. `loadeddata` fires
     once per source load, and the readyState check covers the case where the
     frame arrived before this effect ran. */
  useEffect(() => {
    const video = videoRef.current;
    /* Same condition as `posterOnly` below, inlined because that constant is
       declared further down with the markup it belongs to. */
    if (!video || (reduced && mode === "scroll")) return;
    if (video.readyState >= 2) {
      setPainted(true);
      return;
    }
    const onData = () => setPainted(true);
    video.addEventListener("loadeddata", onData);
    return () => video.removeEventListener("loadeddata", onData);
  }, [reduced, mode, src]);

  const playManually = () => {
    videoRef.current?.play().then(
      () => setBlocked(false),
      () => setBlocked(true),
    );
  };

  /* The reduced-motion scroll path never mounts a video element, so nothing is
     downloaded or decoded for a user who opted out. */
  const posterOnly = reduced && mode === "scroll";

  const media = (
    <div className={mediaClassName ?? "absolute inset-0 -z-[1] overflow-hidden"} aria-hidden>
      {/* The poster never fades out. It used to drop to opacity 0 once
          `painted` flipped, which handed the largest paint on the page to the
          <video> — and an element at opacity 0 is not an LCP candidate at all,
          so the poster's own paint (decoded and ready at ~190ms) was
          discarded and LCP waited on the first decoded video frame instead.
          Measured as the LCP element, at 5.3-6.7s.

          The fade bought nothing: the video is layered directly on top at the
          same size with object-cover, and the poster IS the reel's first
          frame, so the pixels underneath are identical and never visible. */}
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          srcSet={posterSrcSet}
          sizes={posterSrcSet ? posterSizes : undefined}
          alt=""
          fetchPriority="high"
          decoding="async"
          className={`${
            posterClassName ?? "absolute inset-0 h-full w-full object-cover"
          } transition-opacity duration-500 opacity-100`}
        />
      ) : null}

      {posterOnly ? null : (
        <video
          ref={videoRef}
          /* Deliberately no `poster` attribute. The <img> above already holds
             the first frame and sits at opacity 1 until `painted`, so the video's
             own poster is painted underneath it and never seen — but it is a
             separate resource fetch, and one that ignores the img's srcset, so
             it pulled the full-width file on phones on top of the narrow cut
             the img had already chosen. Two downloads of the LCP image. */
          muted
          playsInline
          /* Both modes start at "metadata" and are raised to "auto" after the
             window load event. The reel is ~4.8 MB; at "auto" from the first
             render it competes with the poster, the fonts and the JS bundle
             for the same connection during the exact window that decides FCP
             and LCP. Metadata is a few KB and is all either mode needs to get
             wired up. autoplay mode used to be exempt and so pulled the whole
             file on phones mid-paint — the one place where bandwidth is
             scarcest. Playback still starts from the buffered head; the
             poster holds the frame until it does, and the poster IS the
             reel's first frame, so there is nothing to see happen. */
          preload={fullPreload ? "auto" : "metadata"}
          tabIndex={-1}
          /* Deliberately NOT set, even in autoplay mode. The attribute makes
             the browser fetch and buffer the source as soon as the element is
             parsed, which overrides preload="metadata" above and defeats the
             point of it. Playback is started by the effect further up instead,
             after the window load event, so the reel downloads once the page
             that has to paint is done competing for the connection. */
          loop={mode === "autoplay" && loop && !reduced}
          className={`${
            videoClassName ?? "absolute inset-0 h-full w-full object-cover"
          } transition-opacity duration-500 ${painted ? "opacity-100" : "opacity-0"}`}
        >
          {/* Held back until the window load event. `preload="metadata"` is
              not a download budget: Chrome opens the source with an
              open-ended `Range: bytes=0-` and keeps streaming, so on a fast
              connection it pulled the entire ~4.7 MB reel — 82% of the page's
              transfer — while the poster, fonts and JS were still competing
              for the same pipe. Verified: the element reported
              `preload="metadata"` at the time it issued `bytes=0-` for the
              full 4,801,627 bytes.

              A <video> with no source fetches nothing at all, which is the
              only reliable way to hold it. The poster is the reel's first
              frame and stays at opacity 1 until `painted`, so deferring the
              source changes no pixel — it only stops the reel from bidding
              against the paint. */}
          {fullPreload ? (
            <>
              {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
              <source src={src} type="video/mp4" />
            </>
          ) : null}
        </video>
      )}

      {layers}
    </div>
  );

  const body = (
    <>
      {media}
      {blocked ? (
        <button
          type="button"
          onClick={playManually}
          className="absolute inset-0 z-10 grid place-items-center bg-black/30"
        >
          <span className="rounded-full border border-white/40 bg-black/60 px-5 py-2 text-sm text-white backdrop-blur">
            Play video
          </span>
        </button>
      ) : null}
      {overlay}
    </>
  );

  const isScroll = mode === "scroll";

  /* Both modes render the SAME element structure. `mode` is derived from the
     motion tier, which resolves on the client after an SSR pass, so it can
     flip on the very first commit. Returning a different tree shape per mode
     made React reconcile a <section> root into a <div><section>, which throws
     NotFoundError: insertBefore. The track stays put and goes
     `display: contents` in autoplay mode, where it has no layout role. */
  return (
    <div
      /* In scroll mode this is the measured ScrollTrigger trigger. A caller
         needing its own triggers on this range targets it via trackClassName. */
      ref={wrapperRef}
      /* A caller-supplied trackClassName is kept in BOTH modes, and that is
         load-bearing for CLS. `mode` is derived from matchMedia and
         prefers-reduced-motion, so it can flip on the commit after hydration;
         swapping the track to `display: contents` there deleted its height
         mid-load and shoved the whole page up. A caller that names its own
         track class owns that height in CSS and can express the same
         mode split as a media query, which costs nothing at hydration.
         Only the unnamed default — whose height is the inline style below —
         still collapses, and it has no stylesheet to express it in. */
      className={
        trackClassName ?? (isScroll ? "relative w-full" : "contents")
      }
      /* The reduced-motion fallback is a single static viewport, so it must
         not reserve the full scroll track it no longer uses. A caller-supplied
         trackClassName owns its own heights and opts out of this. */
      style={
        isScroll && !trackClassName
          ? { height: reduced ? "100vh" : scrollHeight }
          : undefined
      }
      data-reduced={reduced ? "true" : undefined}
    >
      <Container
        {...containerProps}
        className={
          className ??
          (isScroll
            ? "sticky top-0 z-0 h-screen w-full overflow-hidden"
            : "relative w-full overflow-hidden")
        }
        style={!isScroll && !className ? { aspectRatio } : undefined}
      >
        {body}
      </Container>
    </div>
  );
}

export default ScrollVideoPlayer;
