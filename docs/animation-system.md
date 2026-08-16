# Animation System — Technical Specification

> **Stack note:** this project is **React 19 + Next.js 16 + `motion`** (`motion/react`, the
> Framer Motion successor), not Angular. Requirement #5 ("Integrates with Angular") maps as
> follows: `@angular/animations` → `motion/react`'s `initial`/`animate`/`whileInView` variants;
> Angular signals → React state + `useReducedMotion()` + IntersectionObserver. GSAP is not used;
> all choreography lives on the existing `motion` primitives to keep one vocabulary.

## 1. Principles

| Principle | Implementation |
|---|---|
| **Animate with purpose** — guide attention, indicate state, reinforce hierarchy. No decorative loops. | Every primitive in `src/components/motion.tsx` exists because a section needs it (`Parallax`, `TextReveal`, `ImageReveal`, `Magnetic`, `useMouseParallax`, `ScrollProgress`). Loader, scroll bar, hover spring, depth parallax — all functional. |
| **60fps** — hardware-accelerated `transform`/`opacity`/`clip-path` only, no layout props; IntersectionObserver for scroll triggers, rAF/springs for continuous effects. | All transitions animate only `y`, `x`, `scale`, `scaleX/Y`, `clipPath`, `pathLength`, `opacity`. Scroll state flows through `useScroll` → `useSpring` → `useTransform`. |
| **Respects `prefers-reduced-motion`** | Every primitive branches on `useReducedMotion()` and collapses to opacity-only or static. CSS fallbacks in `src/app/globals.css` (`@media (prefers-reduced-motion: reduce)`). |
| **Tells a story** — each section has a distinct entrance signature. | See §7. |
| **Framework integration** | React + `motion/react` (see stack note). |

Single source of truth: `src/lib/motion.ts`.

```ts
export const ease = [0.16, 1, 0.3, 1] as const;   // the one easing, site-wide
export const stagger = 0.08;                      // 80ms per sibling child
export const duration = {
  micro: 0.18,        // hover/active, reduced-motion fallback
  ui: 0.28,           // small UI transitions
  interaction: 0.38,  // dismissals, buttons/links
  section: 0.6,       // standard block entrance
  cinematic: 0.85,    // hero, page-level choreography
} as const;
```

## 2. Timing curves

- **Primary** — `cubic-bezier(0.16, 1, 0.3, 1)` (the `ease` token): fast start, long deceleration ("expo-out"). Used for every `duration`-based transition.
- **Micro-interactions** — physics springs for weighted feedback:
  - `Magnetic` / button hover: `{ stiffness: 160, damping: 16, mass: 0.35 }`
  - `useMouseParallax` (hero layers): `{ stiffness: 90, damping: 18, mass: 0.6 }`
- **Scroll-follow** — spring-damped to kill jitter:
  - `ScrollProgress`: `{ stiffness: 120, damping: 28 }`
  - `ImageReveal`/`Parallax`: `{ stiffness: 70, damping: 22 }`
- **Rule:** exits are faster than entrances — dismissals stay ≤ `duration.ui`.

## 3. Duration presets

| Token | Seconds | Requested tier | Use |
|---|---|---|---|
| `micro` | 0.18 | ~150ms | hover/active, reduced-motion fallbacks |
| `ui` | 0.28 | 400ms tier | small transitions |
| `interaction` | 0.38 | 400ms tier | buttons, loader exit |
| `section` | 0.6 | standard | block entrances, path draws |
| `cinematic` | 0.85 | ~800ms | hero, page intro |

## 4. Stagger delays

Canonical: **`stagger = 0.08` (80ms per child)**, defined as a token and consumed by
`TextReveal` (`delay + i * stagger`). Intentional per-section variation (all ≤ 120ms):

| Component | Stagger |
|---|---|
| `TextReveal` (all sections) | `i * 0.08` |
| Hero headline lines | `0.2 + i * 0.09` |
| `ServicesSection` visualizer | `i * 0.06` / `0.08` / `0.09` |
| `JourneyMilestones` | `0.15 + index * 0.1` |
| `JourneyRoute` milestone dots | `i * 0.1` |
| `StackEvolution` | `0.08 + i * 0.045` |

Keep child counts ≤ 8–10 so the full cascade stays under ~800ms; above that, group-stagger
whole blocks instead of individual items.

## 5. Scroll trigger thresholds

| Primitive | Config |
|---|---|
| `TextReveal` | `{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }` |
| `ImageReveal` | `{ once: true, amount: 0.35, margin: "-8%" }` |
| `Parallax` | element-relative `offset: ["start end", "end start"]` |
| `ScrollProgress` | full-page `useScroll()` |
| `JourneyMilestones` | `IntersectionObserver` thresholds `[0.1, 0.3, 0.5, 0.7]`, `rootMargin: "-20%"` |

Effective threshold ≈ **15–35% of viewport** with a `-8%` bottom margin so sections trigger
just before fully entering. Critical invariant: the observer watches the **un-clipped wrapper**,
never the clipped inner line/panel (a clipped target reports intersection ratio 0 and never fires).

## 6. State machine

`whileInView` implements an implicit machine; a named hook is available for programmatic control:

```ts
export type RevealState = "idle" | "active" | "complete";

/** Reference implementation — explicit state machine for scroll-revealed content. */
export function useRevealState<T extends HTMLElement>(
  ref: React.RefObject<T>,
  threshold = 0.15,
  once = true
): RevealState {
  const [state, setState] = useState<RevealState>("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState((s) => (s === "idle" ? "active" : s));
          if (once) io.disconnect();
        } else if (!once) {
          setState((s) => (s === "complete" ? s : "idle"));
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return state;
}
```

States:

```
idle ──(viewport ≥ threshold, once: true)──▶ active ──(animation completes)──▶ complete
```

| State | Meaning | Current implementation |
|---|---|---|
| `idle` | off-screen, before threshold | `initial` props (`opacity: 0`, `y`, masked `clip-path`) |
| `active` | threshold crossed | `whileInView="show"` / `viewport={{ once: true }}` |
| `complete` | at rest, never re-enters | final variants (`opacity: 1`, `y: 0`) |
| `reduced` (cross-cutting) | system preference | `useReducedMotion()` → opacity-only or static |

Continuous effects (`Parallax`, `useMouseParallax`, `ScrollProgress`) live outside the machine
— they only switch between `active`/`reduced`.

## 7. Entrance signatures (per-section rhythm)

| Section | Signature |
|---|---|
| Hero | Cinematic `0.85` masked headline lines (`0.2 + i * 0.09`) + clip-path `inset()` visual reveal + `Magnetic` CTA + layered `useMouseParallax` (scroll depth 34/14/20px) |
| About | `TextReveal` heading + `ImageReveal` portrait + stats `rise(0.08)` stagger |
| Services | Auto-choreographed visualizer: token/block/node/stage reveal at `i * 0.06–0.09` + scroll-driven progress spine |
| Journey | Scroll-linked route draw (`useScroll` + springs) + milestone cards gated by `IntersectionObserver` thresholds |
| Experience | `TextReveal` headers + per-chapter directional reveals (from-left/right/bottom) |
| Skills | `staggerChildren: 0.08` on grouped variant containers |
| Process | `LineReveal` masked lines + `ProcessSpine` rail + `ProcessJourney` step machine |
| Page chrome | `ScrollProgress` top bar + `PageLoader` intro (`160ms → 420ms → 950ms` phase machine, `pathLength` monogram draw) |

Each section owns **one** signature — no two home sections animate the same way.

## 8. Reduced-motion behavior

| Primitive | Collapse |
|---|---|
| `TextReveal` | lines fade only, no mask travel (`duration.micro`) |
| `ImageReveal` / `Parallax` | `y` forced to `0` |
| `ScrollProgress` | renders `null` |
| `Magnetic` / `useMouseParallax` | pointer tracking disabled |
| `PageLoader` | skipped entirely (repeat-visit flag via `sessionStorage`) |
| CSS | `@media (prefers-reduced-motion: reduce)` blocks in `globals.css` |

## 9. Anti-patterns (do not add)

- Animating `width`/`height`/`top`/`margin` (layout thrash).
- Decorative loops (infinite spin, floating) not tied to state.
- Stagger > 120ms per item or full cascades > 800ms.
- Observing a `clip-path`-masked element for in-view triggers.
- New easing curves — everything routes through the `ease` token or the spring presets above.

## 10. Delivery checklist

- [x] transform/opacity/clip-path only — no layout thrash
- [x] single `ease` + `duration` + `stagger` token scale (`src/lib/motion.ts`)
- [x] 80ms stagger default (token consumed by `TextReveal`)
- [x] IntersectionObserver / `whileInView` for all scroll triggers
- [x] `useReducedMotion()` + CSS fallbacks everywhere
- [x] distinct entrance signature per section
- [x] state machine (`idle → active → complete`) documented + `useRevealState` reference
