/**
 * Central animation controller.
 *
 * The whole site shares ONE IntersectionObserver, ONE rAF loop, and a single
 * idle → active → complete phase machine. Components register elements (or
 * frame callbacks) instead of each spinning up their own observer. All access
 * to the DOM is guarded so the module is safe to import during SSR.
 *
 * Phase contract:
 *   - idle    → below threshold (or never entered yet)
 *   - active  → element ratio ≥ threshold; for `once` targets this fires a
 *               `completeDelay` timer so the state machine keeps ticking.
 *   - complete→ `once` targets that have played and are released from the
 *               observer (cheap — the observer never watches them again).
 */
export type Phase = "idle" | "active" | "complete";

export type RegisterOptions = {
  /** Intersection ratio that flips a target to active. */
  threshold?: number;
  /** When true the target plays once and is then unobserved. */
  once?: boolean;
  /** ms between active and complete for `once` targets. */
  completeDelay?: number;
  onPhase?: (phase: Phase) => void;
};

type Target = {
  el: HTMLElement;
  threshold: number;
  once: boolean;
  completeDelay: number;
  phase: Phase;
  onPhase?: (phase: Phase) => void;
  timer?: ReturnType<typeof setTimeout>;
};

/** Shared ratio grid — every target's threshold is compared against these. */
const THRESHOLDS = [0, 0.15, 0.3, 0.5, 0.7, 1] as const;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class AnimationController {
  private io: IntersectionObserver | null = null;
  private targets = new Map<HTMLElement, Target>();
  private frames = new Set<(now: number) => void>();
  private rafId: number | null = null;
  private running = false;
  private visibilityCleanup: (() => void) | null = null;

  /* ------------------------------ observer ------------------------------ */

  private ensureIo() {
    if (this.io || typeof window === "undefined") return;
    this.io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const target = this.targets.get(el);
          if (!target) continue;

          /* Detached elements (route change removed the section) are released
             instead of left lingering in the observer. */
          if (!el.isConnected) {
            this.release(target);
            continue;
          }

          if (entry.intersectionRatio >= target.threshold) {
            this.toPhase(target, "active");
          } else if (target.phase === "active") {
            this.toPhase(target, target.once ? "active" : "idle");
          }
        }
      },
      { threshold: THRESHOLDS as unknown as number[] },
    );
  }

  private release(target: Target) {
    if (target.timer) clearTimeout(target.timer);
    if (target.phase !== "idle") {
      target.phase = "idle";
      target.onPhase?.("idle");
    }
    this.io?.unobserve(target.el);
    this.targets.delete(target.el);
  }

  private toPhase(target: Target, next: Phase) {
    if (target.phase === next) return;
    if (next === "complete" && !target.once) return;
    if (target.timer) {
      clearTimeout(target.timer);
      target.timer = undefined;
    }
    target.phase = next;
    if (next === "active" && target.once) {
      target.timer = setTimeout(() => this.toPhase(target, "complete"), target.completeDelay);
    }
    if (next === "complete") {
      this.io?.unobserve(target.el);
      this.targets.delete(target.el);
    }
    target.onPhase?.(next);
  }

  /** Register an element with the shared observer. Returns an unsubscribe. */
  register(el: HTMLElement, options: RegisterOptions = {}): () => void {
    if (this.targets.has(el)) return () => {};
    const target: Target = {
      el,
      threshold: options.threshold ?? 0.3,
      once: options.once ?? true,
      completeDelay: options.completeDelay ?? 900,
      onPhase: options.onPhase,
      phase: "idle",
    };
    this.ensureIo();
    this.ensureVisibilityGuard();
    this.targets.set(el, target);
    this.io?.observe(el);
    return () => this.release(target);
  }

  /* ------------------------- background hygiene ------------------------- */

  /* The rAF loop must not burn cycles (or battery) while the tab is hidden.
     Browsers throttle rAF anyway, but pausing the loop explicitly keeps the
     frame callbacks from piling up when the tab comes back. */
  private ensureVisibilityGuard() {
    if (typeof window === "undefined" || this.visibilityCleanup) return;
    const onVisibility = () => {
      if (document.hidden) this.pause();
      else this.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    this.visibilityCleanup = () => document.removeEventListener("visibilitychange", onVisibility);
  }

  /* ------------------------------- frames -------------------------------- */

  /** Subscribe a per-frame callback to the shared rAF loop. Returns an unsubscribe. */
  addFrame(cb: (now: number) => void): () => void {
    this.frames.add(cb);
    this.ensureLoop();
    let cancelled = false;
    return () => {
      if (cancelled) return;
      cancelled = true;
      this.frames.delete(cb);
      if (this.frames.size === 0) this.stopLoop();
    };
  }

  private ensureLoop() {
    if (typeof window === "undefined" || this.rafId !== null || this.running) return;
    this.running = true;
    const step = (now: number) => {
      if (!this.running) {
        this.rafId = null;
        return;
      }
      for (const cb of this.frames) cb(now);
      this.rafId = this.frames.size ? requestAnimationFrame(step) : null;
      if (!this.frames.size) this.running = false;
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stopLoop() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.running = false;
  }

  /** Pause the shared loop (e.g. the tab went to the background). */
  pause() {
    this.stopLoop();
  }

  /** Resume the shared loop if there are live subscribers. */
  play() {
    if (this.frames.size > 0) this.ensureLoop();
  }

  /* ---------------------------- utility helpers --------------------------- */

  /** Leading-edge throttle. */
  throttle<A extends unknown[]>(fn: (...args: A) => void, ms: number): (...args: A) => void {
    let last = 0;
    return (...args: A) => {
      const now = Date.now();
      if (now - last < ms) return;
      last = now;
      fn(...args);
    };
  }

  /** Trailing-edge debounce. */
  debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number): (...args: A) => void {
    let id: ReturnType<typeof setTimeout> | undefined;
    return (...args: A) => {
      if (id) clearTimeout(id);
      id = setTimeout(() => fn(...args), ms);
    };
  }

  get reducedMotion() {
    return prefersReducedMotion();
  }
}

export const animationController = new AnimationController();