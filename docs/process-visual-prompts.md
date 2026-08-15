# Process Section — Premium Image / Video Prompts

Visual system locked to the site tokens so every asset feels like one family.

## Master style block (paste into every prompt)

```
STYLE: Ultra-premium dark editorial tech visual. Near-black background #0a0a0c with a
subtle #16161b surface plane. Single accent: acid lime #c9f24d, used sparingly (5–10%
of frame) as light, edge-glow or a single element. Off-white #f2f1ec for structure lines.
No other hues. Thin 1px hairline geometry at 9–16% white opacity. Soft volumetric haze,
gentle film grain, shallow depth of field. Studio product-shot lighting, one key light
from upper-left, cool rim light. Abstract and architectural — no faces, no text, no logos,
no UI screenshots, no stock-photo people. Centred composition with generous negative space.
Rendered like Octane / Blender cycles, 8k, physically based materials: matte anodised
aluminium, smoked glass, brushed graphite.
FORMAT: 16:9, cinematic.
NEGATIVE: text, letters, watermark, logo, people, hands, faces, clutter, rainbow colours,
blue tech cliché, neon cyberpunk, lens flare spam, low contrast mush.
```

For each step below: use the master block + the STEP line. For **video**, append the MOTION line.

---

## 00 — Hero: "From idea to production"

**Image**
> A single luminous lime particle at the far left of frame travelling along a razor-thin
> hairline path that passes through seven translucent smoked-glass gates, each gate slightly
> more structured than the last — the first a formless mist, the final one a precise machined
> lattice. The trail behind the particle solidifies from vapour into a solid lime filament.

**Motion (6–8s loop)**
> Slow left-to-right dolly following the particle. Each gate lights up on pass-through with a
> 0.2s lime bloom, then dims. Ends on the final lattice holding a steady glow. Ease-out-expo
> timing, no cuts, locked-off horizon, 24fps with subtle motion blur.

---

## 01 — Discover · *Understand before building*

**Image**
> Dozens of faint scattered white points suspended in dark haze, with a few lime threads
> beginning to connect three of them into a triangle. Most of the field is still unresolved
> fog. A single shaft of light picks out the connected cluster. Sense of listening, of pattern
> just starting to emerge from noise.

**Motion**
> Points drift slowly in parallax. Lime connection lines draw themselves one by one, 3 total,
> each over 0.6s with a soft leading glow. Camera pushes in 5% over 8 seconds. Loop by fading
> lines back out.

---

## 02 — Define · *Turn ambiguity into direction*

**Image**
> A drifting cloud of small graphite blocks mid-air, half of them already snapped into a clean
> isometric grid on a dark plane, the other half still tumbling. The settled blocks are edge-lit
> lime; the loose ones are matte and unlit. Blueprint hairlines extend from the settled structure
> into empty space, indicating a plan not yet built.

**Motion**
> Loose blocks rotate and magnetically snap into place one at a time with a crisp settle
> (overshoot then rest, cubic-bezier(0.16,1,0.3,1)). Hairlines extend last. Camera holds still.

---

## 03 — Design · *Design the experience*

**Image**
> Stacked panes of smoked glass floating in perfect parallel at varying depths, each pane
> carrying an abstract geometric composition of rectangles and circles — pure form, no text
> or interface. Lime light passes through all panes and aligns into a single clean shape on the
> back wall. Precision, hierarchy, layered system.

**Motion**
> Panes slide laterally into alignment; the projected shapes converge into one crisp form as
> they line up. Slow orbital camera of 10 degrees. Light intensifies at the moment of alignment.

---

## 04 — Build · *Engineer the product*

**Image**
> A modular structure assembling itself in mid-air — machined aluminium components locking into
> a repeating architectural lattice, lime light glowing from the seams where parts meet. Lower
> third shows completed dense structure, upper third still open frame. Exploded-view engineering
> aesthetic, tight tolerances, real weight and material.

**Motion**
> Components fly in from off-frame and lock with a micro-recoil. Seam glow pulses once per join.
> Camera cranes upward following the build. 8s, continuous, no cuts.

---

## 05 — Test · *Make it reliable*

**Image**
> A finished dark monolithic form inside a calibration rig: thin lime scanning plane sweeping
> across it, faint measurement hairlines and tick marks tracing its silhouette. Everything
> reads as pass — clean geometry, no cracks, controlled clinical light. Laboratory calm, not alarm.

**Motion**
> The lime scan plane sweeps top-to-bottom then bottom-to-top, 4s each pass. Tick marks
> illuminate briefly as the plane crosses them. Object rotates 15 degrees very slowly.

---

## 06 — Launch · *Ship with confidence*

**Image**
> A single machined object rising smoothly off a dark platform, a clean ring of lime light
> beneath it, the surrounding haze parting. Controlled and quiet — an elevator, not an explosion.
> Faint concentric hairline rings on the floor plane show it is instrumented and monitored.

**Motion**
> Steady vertical rise, constant velocity, no shake. Floor rings pulse outward in sequence.
> Camera tilts up to follow. Ends with the object holding position, glow settling.

---

## 07 — Evolve · *Launch is the beginning*

**Image**
> A closed lime loop — a Möbius-like continuous band of light — wrapping around a dark refined
> structure that is visibly denser and more detailed on one side, as if each pass adds material.
> Small increments accreting along the band. Compounding, not decaying.

**Motion**
> Light travels endlessly around the loop; with every pass a small new facet grows on the
> structure. Seamless perfect loop, 10s. Slow continuous 360-degree orbit.

---

## Practical notes

- **Aspect ratios**: 16:9 for step visuals, 1:1 for nav/thumbnail crops, 21:9 for the hero band.
- **Video length**: 6–10s, seamless loop, no audio, export MP4 (H.264) + WebM, muted autoplay.
- **Weight budget**: keep each loop under ~1.5 MB; prefer a poster image + lazy-loaded video.
- **Consistency trick**: generate step 01 first, then use it as a style/image reference for
  02–07 so lighting and material stay identical across the set.
- **Accent discipline**: if a result comes back with lime covering more than ~10% of the frame,
  regenerate — the restraint is what makes it read as premium.
