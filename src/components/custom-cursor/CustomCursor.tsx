"use client";

/**
 * CustomCursor — Premium animated cursor with state machine.
 * Desktop-only, reduced-motion-aware, GSAP quickTo powered.
 *
 * States: default | link | button | project | image | text | hidden
 * Labels: configured via data-cursor-label on hover targets
 * Magnetic: applied to elements with data-cursor="magnetic"
 */

import { useEffect, useRef, useCallback } from "react";

type CursorState = "default" | "link" | "button" | "project" | "image" | "text" | "hidden";

const STATE_MAP: Record<string, CursorState> = {
  link: "link",
  button: "button",
  project: "project",
  image: "image",
  text: "text",
  hidden: "hidden",
  magnetic: "button",
};

function resolveTarget(el: Element | null): { state: CursorState; label: string } {
  const htmlEl = el as HTMLElement | null;
  if (!htmlEl) return { state: "default", label: "" };

  // 1. Explicit data-cursor attribute takes precedence
  const explicit = htmlEl.closest("[data-cursor]");
  if (explicit) {
    const raw = explicit.getAttribute("data-cursor") ?? "default";
    const state = STATE_MAP[raw] ?? "default";
    const label = explicit.getAttribute("data-cursor-label") ?? "";
    return { state, label };
  }

  // 2. Fallback: detect native interactive elements
  if (htmlEl.closest("input, textarea, select, [contenteditable]")) {
    return { state: "text", label: "" };
  }
  if (htmlEl.closest("button, [role='button']")) {
    return { state: "button", label: "" };
  }
  if (htmlEl.closest("a[href]")) {
    return { state: "link", label: "" };
  }
  if (htmlEl.closest("img, video, picture, [data-cursor-image]")) {
    return { state: "image", label: "" };
  }

  return { state: "default", label: "" };
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CursorState>("default");
  const labelTextRef = useRef<string>("");
  const mouseRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const magnetRef = useRef({ active: false, el: null as HTMLElement | null, strength: 10 });

  const quickFns = useRef<{
    dotX: ((v: number) => void) | null;
    dotY: ((v: number) => void) | null;
    ringX: ((v: number) => void) | null;
    ringY: ((v: number) => void) | null;
  }>({ dotX: null, dotY: null, ringX: null, ringY: null });

  const updateState = useCallback((next: CursorState, label: string) => {
    const ring = ringRef.current;
    if (!ring) return;

    if (next !== stateRef.current) {
      stateRef.current = next;
      ring.setAttribute("data-state", next);
    }

    if (label !== labelTextRef.current) {
      labelTextRef.current = label;
      if (labelRef.current) {
        labelRef.current.textContent = label;
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Import GSAP at runtime
    if (!reduced) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const gsap = require("gsap/dist/gsap").gsap;
        quickFns.current.dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
        quickFns.current.dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
        quickFns.current.ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
        quickFns.current.ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });
      } catch {
        // GSAP not available — fall back to direct transform
      }
    }

    const magnet = magnetRef.current;
    const fns = quickFns.current;

    const onPointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      const { state, label } = resolveTarget(e.target as Element);
      updateState(state, label);

      const magnetEl = (e.target as HTMLElement)?.closest?.("[data-cursor='magnetic']") as HTMLElement | null;
      if (magnetEl && !reduced) {
        const rect = magnetEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const threshold = Math.max(rect.width, rect.height) * 0.8;

        if (dist < threshold) {
          magnet.active = true;
          magnet.el = magnetEl;
          magnet.strength = parseFloat(magnetEl.getAttribute("data-cursor-magnetic") || "") || 10;
        }
      }

      if (!magnetEl) {
        magnet.active = false;
        magnet.el = null;
      }
    };

    const onPointerLeave = () => {
      updateState("hidden", "");
    };

    const onPointerEnter = () => {
      updateState("default", "");
    };

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      let targetX = mx;
      let targetY = my;

      if (magnet.active && magnet.el) {
        const rect = magnet.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        targetX = mx - dx * 0.15;
        targetY = my - dy * 0.15;

        const elDx = dx * 0.3;
        const elDy = dy * 0.3;
        magnet.el.style.transform = `translate(${elDx}px, ${elDy}px)`;
      } else if (magnet.el) {
        magnet.el.style.transform = "";
        magnet.el = null;
      }

      if (fns.dotX && fns.dotY) {
        fns.dotX(targetX);
        fns.dotY(targetY);
      } else {
        dot.style.transform = `translate(${targetX}px, ${targetY}px)`;
      }

      if (fns.ringX && fns.ringY) {
        fns.ringX(targetX);
        fns.ringY(targetY);
      } else {
        ring.style.transform = `translate(${targetX}px, ${targetY}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Hide native cursor
    const style = document.createElement("style");
    style.id = "custom-cursor-hide";
    style.textContent = `
      @media (pointer: fine) {
        *, *::before, *::after { cursor: none !important; }
        input, textarea, select, [contenteditable] { cursor: text !important; }
      }
    `;
    document.head.appendChild(style);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerenter", onPointerEnter);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerenter", onPointerEnter);
      style.remove();
      if (magnet.el) magnet.el.style.transform = "";
    };
  }, [updateState]);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden="true"
        data-cursor-comp="dot"
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden="true"
        data-state="default"
        data-cursor-comp="ring"
      >
        <span ref={labelRef} className="cursor-label" data-cursor-comp="label" />
      </div>
    </>
  );
}
