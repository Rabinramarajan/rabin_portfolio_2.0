/**
 * Custom Cursor Motion
 * Desktop-only interactive cursor following pointer movement
 */

import { useEffect, useRef } from "react";
import { hasPointerFine, prefersReducedMotion } from "./gsap-context";
import { MOTION_CONFIG } from "./config";

const gsap = require("gsap/dist/gsap");

interface CursorState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  type: "default" | "link" | "button" | "project" | "drag";
}

/**
 * useCursorMotion — Custom cursor with state tracking
 * Desktop only, disabled with reduced motion or touch devices
 *
 * Usage:
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useCursorMotion(ref);
 *
 * // Mark interactive elements:
 * <a data-cursor="link">Link</a>
 * <button data-cursor="button">Button</button>
 * <div data-cursor="project">Project</div>
 * ```
 */
export function useCursorMotion(ref: React.RefObject<HTMLElement>) {
  const reduce = prefersReducedMotion();
  const hasPointer = hasPointerFine();
  const stateRef = useRef<CursorState>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    type: "default",
  });

  useEffect(() => {
    // Disable on reduced motion or touch devices
    if (reduce || !hasPointer) return;

    const container = ref.current;
    if (!container) return;

    // Create cursor element
    const cursor = document.createElement("div");
    cursor.className = "cursor cursor--default";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);

    const cursorDot = document.createElement("div");
    cursorDot.className = "cursor__dot";
    cursor.appendChild(cursorDot);

    const onMouseMove = (e: MouseEvent) => {
      stateRef.current.targetX = e.clientX;
      stateRef.current.targetY = e.clientY;

      // Check cursor type on elements
      const target = e.target as HTMLElement;
      let cursorType = "default";

      if (target.closest("[data-cursor='link']")) {
        cursorType = "link";
      } else if (target.closest("[data-cursor='button']")) {
        cursorType = "button";
      } else if (target.closest("[data-cursor='project']")) {
        cursorType = "project";
      } else if (target.closest("[data-cursor='drag']")) {
        cursorType = "drag";
      }

      stateRef.current.type = cursorType as typeof stateRef.current.type;
      cursor.className = `cursor cursor--${cursorType}`;
    };

    // Animate cursor following with lag
    const animate = () => {
      const state = stateRef.current;

      // Smooth interpolation
      state.x += (state.targetX - state.x) * 0.2;
      state.y += (state.targetY - state.y) * 0.2;

      gsap.set(cursor, {
        x: state.x,
        y: state.y,
        xPercent: -50,
        yPercent: -50,
      });

      requestAnimationFrame(animate);
    };

    // Hide native cursor
    container.style.cursor = "none";

    window.addEventListener("mousemove", onMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cursor.remove();
      container.style.cursor = "auto";
    };
  }, [reduce, hasPointer, ref]);
}

/**
 * Utility: Mark elements as interactive for cursor state changes
 */
export function makeCursorInteractive(
  element: HTMLElement,
  type: "link" | "button" | "project" | "drag" = "link"
) {
  element.setAttribute("data-cursor", type);
}
