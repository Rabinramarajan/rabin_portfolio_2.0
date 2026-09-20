"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useHydrated } from "@/lib/useHydrated";
import { media } from "@/lib/media";

/**
 * JOURNEY BACKDROP — the cinematic plate behind the home page section.
 *
 * Three rules, all of them about not paying for the background twice:
 *
 * 1. The <source> is held out of the DOM until the window load event. A
 *    <video> with no source fetches nothing, and `preload="metadata"` is not
 *    a download budget — Chrome opens the file with an open-ended Range and
 *    keeps streaming. The reel is ~3 MB and must not bid against the hero
 *    artwork, which is the LCP element on the home page.
 * 2. Playback is bound to visibility. The reel only advances while the hero
 *    tab is actually being looked at, so a backgrounded tab stops the decode
 *    instead of leaving a 3 MB loop running against the battery.
 * 3. prefers-reduced-motion suppresses PLAYBACK, not the element. The video
 *    still loads and holds its first frame, so those visitors get the plate
 *    as a still image. An earlier version skipped the element entirely, which
 *    meant anyone with Windows' "show animations" switched off saw no
 *    background at all and had no way to tell why.
 */
export function JourneyBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [painted, setPainted] = useState(false);
  const [source, setSource] = useState(false);

  /* The preference reads as its SSR default on the first client render, so
     branching behaviour on it before hydration would be a mismatch.
     useHydrated defers the read to an ordinary post-hydration re-render.
     Nothing here branches the MARKUP on it — only whether play() is called. */
  const prefersReduced = useReducedMotion();
  const hydrated = useHydrated();
  const reduced = hydrated && !!prefersReduced;

  /* (1) mount the source once the page has stopped competing for bandwidth */
  useEffect(() => {
    const boost = () => setSource(true);
    if (document.readyState === "complete") {
      const id = window.setTimeout(boost, 200);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", boost, { once: true });
    return () => window.removeEventListener("load", boost);
  }, []);

  /* A <video> ignores sources added after it has already run selection, so
     load() is what makes it look at the children that now exist. Separate
     effect so it runs after React has committed them. */
  useEffect(() => {
    if (!source) return;
    videoRef.current?.load();
  }, [source]);

  /* (2) play only while the section is on screen, and never under reduced
     motion. The plate is scoped to this one section rather than fixed to the
     viewport, so scrolling past it is exactly when a 3 MB loop should stop
     decoding. Tab visibility is handled for free: a hidden tab stops
     compositing, and the observer fires again on the way back. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source || reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — the first frame still holds the plate */
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: '15% 0px' },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced, source]);

  /* Crossfade only once a frame is actually decoded (readyState 2), so the
     gradient plate underneath stays the painted pixel until the video can
     replace it. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 2) {
      setPainted(true);
      return;
    }
    const onData = () => setPainted(true);
    video.addEventListener("loadeddata", onData);
    return () => video.removeEventListener("loadeddata", onData);
  }, [source]);

  return (
    <div className="jbg" aria-hidden>
      {/* The stage is what sticks. The video cannot stick on its own: a
          sticky box is offset within its containing block, and the video's
          own height would have to be the section's for that to work. */}
      <div className="jbg__stage">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          className={`jbg__video${painted ? " is-painted" : ""}`}
        >
          {source ? <source src={media("other/experience/hero-reel-v2.mp4")} type="video/mp4" /> : null}
        </video>
        <div className="jbg__scrim" />
      </div>
    </div>
  );
}
