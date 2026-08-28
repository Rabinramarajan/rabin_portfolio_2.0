"use client";

/**
 * Work Motion Enhancer
 *
 * GSAP ScrollTrigger + mouse parallax enhancements for the homepage Work section:
 * - Section intro/title reveal
 * - Stage image scroll parallax (outer layer)
 * - Stage image mouse parallax (inner layer)
 * - Chapter index staggered entrance
 * - Chapter hover scale
 * - Card image scroll + mouse parallax
 * - Floating project preview with viewport boundaries
 */

import { useEffect, useRef } from "react";
import { MOTION_CONFIG } from "@/motion/config";
import { prefersReducedMotion } from "@/motion/gsap-context";

/* ============================================================
   FLOATING PROJECT PREVIEW
   Viewport-aware, smooth image switching, optional label
   ============================================================ */
function useFloatingPreview(reduce: boolean) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const currentSrc = useRef("");

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const { gsap } = require("gsap/dist/gsap");

    // Create preview element
    const el = document.createElement("div");
    el.className = "wx-preview";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `
      <img class="wx-preview__img" alt="" />
      <span class="wx-preview__label">
        <span class="wx-preview__no"></span>
        <span class="wx-preview__name"></span>
        <span class="wx-preview__cta">VIEW →</span>
      </span>
    `;
    document.body.appendChild(el);
    previewRef.current = el;

    const img = el.querySelector("img") as HTMLImageElement;
    const labelNo = el.querySelector(".wx-preview__no") as HTMLSpanElement;
    const labelName = el.querySelector(".wx-preview__name") as HTMLSpanElement;

    /** Constrain preview to viewport boundaries. */
    const constrainToViewport = (x: number, y: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pw = 300; // approximate preview width
      const ph = 220; // approximate preview height
      const offset = 20; // gap from cursor

      let px = x + offset;
      let py = y - ph / 2;

      // Right edge
      if (px + pw > vw - 16) px = x - pw - offset;
      // Left edge
      if (px < 16) px = 16;
      // Bottom edge
      if (py + ph > vh - 16) py = vh - ph - 16;
      // Top edge
      if (py < 16) py = 16;

      return { x: px, y: py };
    };

    const show = (src: string, alt: string, no: string, name: string) => {
      if (!img) return;

      // Image switching — if new source, crossfade
      if (currentSrc.current !== src && currentSrc.current !== "") {
        gsap.to(img, {
          opacity: 0,
          scale: 0.98,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            img.src = src;
            img.alt = alt;
            gsap.to(img, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" });
          },
        });
      } else {
        img.src = src;
        img.alt = alt;
      }
      currentSrc.current = src;

      if (labelNo) labelNo.textContent = no;
      if (labelName) labelName.textContent = name;

      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const hide = () => {
      currentSrc.current = "";
      gsap.to(el, {
        opacity: 0,
        scale: 0.94,
        y: 8,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
        onComplete: () => {
          gsap.set(el, { y: 0 });
        },
      });
    };

    // RAF loop for smooth position lerp with viewport constraint
    const tick = () => {
      const constrained = constrainToViewport(target.current.x, target.current.y);
      pos.current.x += (constrained.x - pos.current.x) * 0.14;
      pos.current.y += (constrained.y - pos.current.y) * 0.14;
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    };

    // Attach to all chapter buttons on the homepage
    const chapters = document.querySelectorAll("[data-work-chapter] .wx__chapter");
    const cleanups: (() => void)[] = [];

    chapters.forEach((chapter) => {
      const onEnter = () => {
        const thumb = chapter.querySelector(".wx__chapter-thumb img, .wx__chapter-thumb picture img") as HTMLImageElement;
        const no = chapter.querySelector(".wx__chapter-no")?.textContent || "";
        const name = chapter.querySelector(".wx__chapter-title")?.textContent || "";
        if (thumb?.src) show(thumb.src, thumb.alt || "", no, name);
      };
      const onLeave = () => hide();
      const onMoveHandler = (e: Event) => {
        const pe = e as PointerEvent;
        target.current = { x: pe.clientX, y: pe.clientY };
      };

      chapter.addEventListener("mouseenter", onEnter);
      chapter.addEventListener("mouseleave", onLeave);
      chapter.addEventListener("pointermove", onMoveHandler);

      cleanups.push(() => {
        chapter.removeEventListener("mouseenter", onEnter);
        chapter.removeEventListener("mouseleave", onLeave);
        chapter.removeEventListener("pointermove", onMoveHandler);
      });
    });

    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      cleanups.forEach((fn) => fn());
      el.remove();
      previewRef.current = null;
    };
  }, [reduce]);
}

/* ============================================================
   MOUSE PARALLAX
   Desktop-only cursor-based image movement within containers
   ============================================================ */
function useMouseParallax(reduce: boolean) {
  useEffect(() => {
    if (reduce || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const { gsap } = require("gsap/dist/gsap");
    const cleanups: (() => void)[] = [];

    // Stage mouse parallax
    const stageFrame = document.querySelector("[data-work-stage]") as HTMLElement | null;
    if (stageFrame) {
      const mouseLayer = stageFrame.querySelector("[data-work-mouse]") as HTMLElement;
      if (mouseLayer) {
        const onMove = (e: PointerEvent) => {
          const rect = stageFrame.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          gsap.to(mouseLayer, {
            x: x * 8,
            y: y * 6,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(mouseLayer, { x: 0, y: 0, duration: 0.8, ease: "power2.out", overwrite: "auto" });
        };

        stageFrame.addEventListener("pointermove", onMove as EventListener);
        stageFrame.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          stageFrame.removeEventListener("pointermove", onMove as EventListener);
          stageFrame.removeEventListener("pointerleave", onLeave);
          gsap.killTweensOf(mouseLayer);
        });
      }
    }

    // Card mouse parallax — all project cards on page
    const cardFrames = document.querySelectorAll("[data-motion='card-frame']");
    cardFrames.forEach((frame) => {
      const el = frame as HTMLElement;
      const mouseLayer = el.querySelector("[data-card-mouse]") as HTMLElement;
      if (!mouseLayer) return;

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        gsap.to(mouseLayer, {
          x: x * 5,
          y: y * 4,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      const onLeave = () => {
        gsap.to(mouseLayer, { x: 0, y: 0, duration: 0.7, ease: "power2.out", overwrite: "auto" });
      };

      el.addEventListener("pointermove", onMove as EventListener);
      el.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", onMove as EventListener);
        el.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf(mouseLayer);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [reduce]);
}

/* ============================================================
   MAIN ENHANCER
   ============================================================ */
export function WorkMotionEnhancer() {
  const reduce = prefersReducedMotion();
  const cleanupsRef = useRef<(() => void)[]>([]);

  // Floating preview
  useFloatingPreview(reduce);
  // Mouse parallax
  useMouseParallax(reduce);

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const workSection = document.querySelector("[data-section='work']");
    if (!workSection) return;

    const { gsap } = require("gsap/dist/gsap");
    const { ScrollTrigger } = require("gsap/dist/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const cleanups: (() => void)[] = [];

    try {
      // ========== SECTION INTRO REVEAL ==========
      const intro = workSection.querySelector("[data-work-intro]");
      if (intro) {
        const title = intro.querySelector(".wx__title");
        const lede = intro.querySelector(".wx__lede");
        const controls = intro.querySelector(".wx__controls");
        const kicker = intro.querySelector(".wx__kicker");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: workSection,
            start: "top 80%",
            once: true,
          },
        });

        if (kicker) {
          tl.from(kicker, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" }, 0);
        }
        if (title) {
          tl.from(title, { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, 0.1);
        }
        if (lede) {
          tl.from(lede, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" }, 0.2);
        }
        if (controls) {
          tl.from(controls, { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" }, 0.3);
        }
      }

      // ========== STAGE IMAGE SCROLL PARALLAX ==========
      // The frame is the scroll trigger; the shot image moves inside it
      const stageFrame = workSection.querySelector("[data-work-stage]");
      if (stageFrame) {
        const stageImage = stageFrame.querySelector("[data-work-image]");
        if (stageImage) {
          const parallaxTl = gsap.timeline({
            scrollTrigger: {
              trigger: workSection,
              start: "top bottom",
              end: "bottom top",
              scrub: MOTION_CONFIG.scroll.scrub,
            },
          });

          // Scroll parallax on the shot layer (outer)
          parallaxTl.to(stageImage, { y: -25, ease: "none" });

          // Subtle scale: slightly zoomed at top, normal at center
          parallaxTl.fromTo(stageImage,
            { scale: 1.04 },
            { scale: 1, ease: "none" },
            0
          );

          cleanups.push(() => parallaxTl.scrollTrigger?.kill());
        }
      }

      // ========== CHAPTER STAGGERED ENTRANCE ==========
      const chapters = workSection.querySelectorAll("[data-work-chapter]");
      if (chapters.length > 0) {
        const staggerTl = gsap.timeline({
          scrollTrigger: {
            trigger: workSection,
            start: "top 50%",
            once: true,
          },
        });

        staggerTl.from(chapters, {
          opacity: 0,
          y: 24,
          duration: MOTION_CONFIG.duration.standard,
          stagger: MOTION_CONFIG.stagger.item,
          ease: MOTION_CONFIG.ease.entrance,
        });

        cleanups.push(() => staggerTl.scrollTrigger?.kill());
      }

      // ========== CHAPTER HOVER SCALE ==========
      chapters.forEach((chapter) => {
        const card = chapter.querySelector(".wx__chapter") as HTMLElement;
        if (!card) return;

        const onEnter = () => {
          gsap.to(card, {
            scale: 1.02,
            duration: MOTION_CONFIG.duration.ui,
            ease: MOTION_CONFIG.ease.smooth,
          });
        };
        const onLeave = () => {
          gsap.to(card, {
            scale: 1,
            duration: MOTION_CONFIG.duration.ui,
            ease: MOTION_CONFIG.ease.smooth,
          });
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
          gsap.killTweensOf(card);
        });
      });

      // ========== CARD IMAGE SCROLL PARALLAX ==========
      const cardParallaxLayers = workSection.querySelectorAll("[data-card-parallax]");
      cardParallaxLayers.forEach((layer) => {
        const parallaxTl = gsap.timeline({
          scrollTrigger: {
            trigger: layer.closest(".pcard") || layer,
            start: "top bottom",
            end: "bottom top",
            scrub: MOTION_CONFIG.scroll.scrub,
          },
        });

        parallaxTl.to(layer, { y: -15, ease: "none" });

        cleanups.push(() => parallaxTl.scrollTrigger?.kill());
      });

      cleanupsRef.current = cleanups;
    } catch (e) {
      console.warn("Work motion enhancement error:", e);
    }

    return () => {
      cleanupsRef.current.forEach((fn) => fn());
      cleanupsRef.current = [];
    };
  }, [reduce]);

  return null;
}
