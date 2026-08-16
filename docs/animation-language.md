# Animation Language — Rabin Portfolio

> Companion to [`animation-system.md`](./animation-system.md) (the technical spec / tokens).
> This document defines the **emotional language**: the arc, the choreography per section,
> and the style guide. Everything maps to the existing primitives in
> `src/components/motion.tsx` and the tokens in `src/lib/motion.ts`.
>
> **Legend:** ✅ EXISTS (shipped today) · 🔶 PROPOSED (designed here)

---

## 0. Brand thesis

> "I work at the intersection of interface design and frontend architecture. My focus is
> building digital products that are visually precise, technically sound, and designed for
> maximum performance."

The animation language is **blueprint-accurate**: no decorative drift, every pixel of motion
is a measured, engineered transition. The emotional arc is a handshake:

1. **The First Impression** — you are competent.
2. **The Confidence** — you have receipts.
3. **The Proof** — the work speaks.
4. **The Journey** — you did the work the hard way.
5. **The Conclusion** — let's build together.

Each beat opens with a **distinct signature** and closes handing off to the next. One
signature per section — never two sections animating the same way.

---

## 1. The emotional arc

### Beat 1 — The First Impression (Hero)

| # | Move | Status | Design |
|---|---|---|---|
| 1.1 | Typing effect | 🔶 | A JetBrains Mono terminal line types the thesis under the cinematic headline (after the headline's mask reveal, `delay ≈ 1.0s`). Blinking `▌` caret in `--color-accent`. Typing runs on `setInterval` + rAF; **reduced-motion → static full line**. Keeps the existing `cinematic 0.85` masked-line reveal — the typewriter is a supporting voice, not a replacement. |
| 1.2 | Particle / code background w/ parallax | 🔶 | Reuse the `JourneyParticles` pattern (`src/components/journey/JourneyParticles.tsx`) as a hero `aria-hidden` layer of `{ }`, `( )`, `< >` mono glyphs at 5% opacity, driven by the existing `useMouseParallax` at **strength 2** (slow, ≤6px drift). Reduced-motion → render nothing. |
| 1.3 | "Available for select projects" reveal | 🔶 | Gradient sweep across the `hero__status` pill: a lime `linear-gradient(120deg, transparent → rgba(201,242,77,.35) → transparent)` sweeps `background-position` once on load (1.1s), while the existing `.hero__pulse` dot stays. Reduced-motion → fade-in only. |
| 1.4 | Nav fade-in w/ hierarchy | ✅ | Navbar already reveals with a slight `y:-10` fade; links stagger after (delay). Keep as-is. |

**Signature:** *the masked line + the terminal echo.* Headline reveals top-down, then the
typewriter "answers" beneath it — precision, then execution.

---

### Beat 2 — The Confidence (About & Services)

| # | Move | Status | Design |
|---|---|---|---|
| 2.1 | Number counters | 🔶 | New `useCountUp(target, inView)` hook: rAF-driven, eased with the expo-out `ease` token, `~0.8s` from trigger. Fires from the existing `whileInView` wrapper (`AboutSection` `rise()`, `viewport amount 0.2`). Values are strings today (`metric.value`) — parse numeric prefix, keep suffixes ("10,000+ users", "4+ years"). Reduced-motion → snap to final value. |
| 2.2 | Split-text section titles | 🔶 | New `WordReveal` primitive: per-word masked slide-up (`y: 110% → 0%`), `stagger = 0.08` per word, clip wrapper watched by the observer (never the word). For title lines where words ≤ 6; larger lines keep `TextReveal`. Reduced-motion → opacity fade. |
| 2.3 | Service card entrances | ✅/🔶 | Cards already fade-up staggered (`ServicesSection` `reveal(i * 0.08)`). Add a **3-beat alternation** in a row: `[fade-up, scale 0.96→1, slide-right]` cycling, so no two adjacent cards animate identically. All within `duration.section`. |
| 2.4 | Section scroll progress rail | ✅ | `ScrollProgress` (top bar) is global. Add a slim vertical rail on the About/Services section edge that fills with the section's `useScroll()` progress (reuse `ProcessSpine` pattern). Reduced-motion → static rail. |

**Signature:** *measured proof.* Numbers count up like a spec sheet; titles resolve word-by-word.

---

### Beat 3 — The Proof (Selected Work)

| # | Move | Status | Design |
|---|---|---|---|
| 3.1 | Hover "open" cards | 🔶 | On hover/focus of `wrk-item` (desktop, `:hover` only — keep `@media (hover:hover)`): media scales `1.04`, body slides up `12px`, and a lime rule draws left→right across the card top (`scaleX 0→1`, `duration.ui`). `AnimatePresence` optional for a shared layout on filter change (already keyed by filter). Reduced-motion → scale only, no slide. |
| 3.2 | Central-project emphasis | 🔶 | The featured (first) `wrk-item--featured` already gets a larger media + stronger `ImageReveal` parallax (20px). Formalize: featured card `scale 1`, siblings `scale 0.98` at `amount 0.12` — a subtle depth hierarchy instead of a true carousel. |
| 3.3 | Thumbnail parallax speeds | ✅ | `ImageReveal parallax={20}` already scroll-drifts thumbnails. Vary speed by layout: featured `30`, medium `16`, flip `12` — foreground fast, background slow. |
| 3.4 | Code decorations on load | 🔶 | Mono `{ }` / `[ ]` / `</>` brackets float at the card corners (5% opacity), drawing in with `clip-path` + `opacity` when the card enters (`duration.section`, `stagger 0.08`). Matches the existing blueprint motif (`EST. 2021`, mono captions). Reduced-motion → static glyphs. |

**Signature:** *the expanding case file.* Cards breathe open on touch, glints of code at the seams.

---

### Beat 4 — The Journey (Experience & Process)

| # | Move | Status | Design |
|---|---|---|---|
| 4.1 | Timeline node pulse | ✅/🔶 | `JourneyRoute` milestone dots already scale-reveal (`scale 0.5→1`). Add a **pulse ring**: a lime ring `scale 1→1.8`, `opacity .5→0` repeating (2.4s) on the active dot only, paused for reduced-motion. |
| 4.2 | Process circles 01–07 light up | 🔶 | `ProcessJourney` already steps 01→07 on a timer (`STEP_MS`). When a step activates: circle fills `--color-accent`, connecting line `scaleX 1`; on deactivate returns to `--color-line`. Driven by the existing step state machine. |
| 4.3 | Current-chapter indicator | ✅/🔶 | `ProcessNav` already marks the active chapter on `/process`. Add a shared `layout` pill/underline that slides between chapters (`motion.layoutId="chapter-rail"`) — position animated by layout, not JS. |

**Signature:** *the route is drawn as you walk it.* Nothing pre-illuminated; progress is earned.

---

### Beat 5 — The Conclusion (Contact)

| # | Move | Status | Design |
|---|---|---|---|
| 5.1 | "Let's build" submit animation | 🔶 | On submit success, after the existing success card fades in, a mono `// let's build →` line types beneath "MESSAGE RECEIVED." (reuse typewriter from 1.1). Reduced-motion → static line. |
| 5.2 | Label-up + border glow | ✅/🔶 | MUI `TextField` already floats labels on focus. Add a lime focus glow: `box-shadow: 0 0 0 1px rgba(201,242,77,.4)` transitioned over `duration.ui`. Single paint property on focus — safe at 60fps. |
| 5.3 | Success celebration | ✅/🔶 | Existing success state (`Check` scale-in + `scaleX` line) is already subtle. Add one lime ring pulse on the icon (single repeat) — no confetti. Matches the "effortless" brand. |

**Signature:** *the handshake.* One clean confirmation — no spectacle.

---

## 2. Style guide

### 2.1 Easing by mood

| Mood | Curve | Where | Notes |
|---|---|---|---|
| Professional / smooth | `cubic-bezier(0.16, 1, 0.3, 1)` (the `ease` token) | default everywhere | expo-out: fast start, long settle |
| Enthusiasm / bouncy | spring `{ stiffness: 260, damping: 14 }` (or `cubic-bezier(0.34, 1.56, 0.64, 1)`) | success check, pulses, magnetic hover | overshoot ≤ 6% — restraint |
| Calm / deceleration | `cubic-bezier(0.165, 0.84, 0.44, 1)` | counters, progress fills | quart-out, no overshoot |
| Technical / precise | `cubic-bezier(0.215, 0.61, 0.355, 1)` | typewriter caret, code glyphs, mono reveals | tight, mechanical |

Easing is a **mood**, not a micro-decision: pick by beat (1–5), then apply consistently.

### 2.2 Duration presets

Already tokens in `src/lib/motion.ts` / `globals.css`:

| Token | Seconds | Beat |
|---|---|---|
| `micro` 0.18 / `ui` 0.28 | hover, focus glow, caret | all |
| `interaction` 0.38 | card open, dismiss | 3, 5 |
| `section` 0.6 | counters, card/code entrances | 2, 3, 4 |
| `cinematic` 0.85 | hero headline, loader | 1 |

### 2.3 Movement distances

| Size | Distance | Where |
|---|---|---|
| Small | **20px** | card hover slide, nav reveal, status pill, focus glow |
| Medium | **50px** | section reveals, milestone card rise (`y: 40–50`), parallax bg |
| Large | **100px** | hero layer scroll depth (34/14/20px today — may widen to 100 for the far layer), full-section drift |

Keep foreground motion ≤ 20px, background drift up to 100px — depth without vertigo.

### 2.4 Color transition palettes

Base **paper `#f2f1ec` on near-black `#0a0a0c`**; the only animated accent is **Rabin lime `#c9f24d`** (dim `#9ec22f`, contrast `#0a0a0c`).

| Purpose | From → To | Use |
|---|---|---|
| Emphasis sweep | `transparent → rgba(201,242,77,.35) → transparent` | badge sweep, code glint, title underline |
| State | `--color-line` (white 9%) → `--color-text` → `--color-accent` | active dot, process circle, progress fill |
| Focus | `rgba(255,255,255,.16) → rgba(201,242,77,.4)` ring | input glow, card hover rule |
| Error | `--color-danger #ff6b6b` (static, **no shake**) | validation — respect reduced motion |

Rule: **white = structure, lime = life.** The palette never animates hue — only opacity,
scale, and position of the lime layer.

### 2.5 The signature element — *the reticle*

A blueprint crosshair in lime at ~25% opacity, `+`-shaped (1px strokes, 12px arms), recurring
across every section — the visual signature of "engineered to a grid."

- **Desktop:** `SignatureReticle` follows the cursor at `useMouseParallax` strength 4 (≈ 8px
  lag); scales to `1.15` and brightens to 35% over interactive elements (`:hover`), returns
  on leave.
- **Mobile:** static reticle pinned to a section corner — no tracking.
- **Reduced-motion:** static, 25% opacity, never moves.
- **Where:** near the current section's heading kicker; hero + contact use it most.

Implementation: new `SignatureReticle` component in `src/components/motion.tsx` (reuses
`useMouseParallax`), positioned absolutely in section shells. Same glyph family as the 3.4
code brackets, so the language stays one: *the grid is alive.*

---

## 3. Reduced motion (non-negotiable)

Every proposed move has a collapse:

| Feature | Reduced-motion fallback |
|---|---|
| Typewriter (1.1, 5.1) | full line, static |
| Particles (1.2) | render nothing |
| Gradient sweep (1.3) | plain fade-in |
| Counters (2.1) | snap to final value |
| WordReveal (2.2) | opacity fade |
| Card hover (3.1) | scale only, no slide/rule |
| Node pulse (4.1) | static filled dot |
| Reticle (2.5) | static, never moves |

**Rule:** if reduced motion, the user loses *motion*, never *information*.

---

## 4. Where it lives (implementation map)

| New piece | File | Reuses |
|---|---|---|
| `WordReveal`, `SignatureReticle`, `useCountUp` | `src/components/motion.tsx` | `useReducedMotion`, `ease`, `stagger`, `useMouseParallax` |
| Hero particles + typewriter | `src/components/Hero.tsx` | `JourneyParticles` pattern, `hero__pulse`, `--font-mono` |
| Card hover + code glint | `src/components/pages/WorkPage.tsx` + `globals.css` | `ImageReveal`, `Magnetic` |
| Node pulse | `src/components/journey/JourneyRoute.tsx` | existing dot reveal |
| Chapter rail | `src/components/process/ProcessNav.tsx` | `motion.layoutId` |
| Focus glow | `globals.css` (`--duration-ui`, lime ring) | MUI TextField |
| Counter hook | `src/components/about/AboutSection.tsx` | `rise()`, `whileInView` |

No new dependencies — this is all `motion/react` + existing primitives.
