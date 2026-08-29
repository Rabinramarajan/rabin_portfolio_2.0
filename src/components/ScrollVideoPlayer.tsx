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
  const [ready, setReady] = useState(false);
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

  /* scroll mode */
  useGSAP(
    () => {
      if (mode !== "scroll" || reduced) return;
      const video = videoRef.current;
      const wrapper = wrapperRef.current;
      if (!video || !wrapper) return;

      let trigger: ScrollTrigger | null = null;

      const bind = () => {
        setReady(true);

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
    const video = videoRef.current;
    if (!video) return;
    setReady(true);
    video.play().then(
      () => setBlocked(false),
      () => setBlocked(true),
    );
  }, [mode, reduced]);

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
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className={`${
            posterClassName ?? "absolute inset-0 h-full w-full object-cover"
          } transition-opacity duration-500 ${ready && !posterOnly ? "opacity-0" : "opacity-100"}`}
        />
      ) : null}

      {posterOnly ? null : (
        <video
          ref={videoRef}
          poster={poster}
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          autoPlay={mode === "autoplay" && !reduced}
          loop={mode === "autoplay" && loop && !reduced}
          className={`${
            videoClassName ?? "absolute inset-0 h-full w-full object-cover"
          } transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
          <source src={src} type="video/mp4" />
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
      className={isScroll ? (trackClassName ?? "relative w-full") : "contents"}
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
