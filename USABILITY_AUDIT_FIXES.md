# Usability Audit Fixes — Rabin R Portfolio

## Executive Summary
22 usability issues identified. Root causes cluster into 4 areas:
1. **Type scale proliferation** — components using hardcoded sizes instead of `--type-*` tokens
2. **Radius inconsistency** — hardcoded `border-radius` values instead of `--radius-*` tokens  
3. **Button style sprawl** — 9 distinct styles instead of the 4 core variants documented in tokens.css
4. **Layout/alignment issues** — process steps, services cards, and graph nodes misaligned

All fixes preserve existing markup, use CSS-only changes where possible, and respect the documented design system.

---

## Issue-by-Issue Fixes

### Issue 1: No consistent type scale (25 distinct font sizes)

**Root cause:** Components use hardcoded values (`0.63rem`, `0.8rem`, `1.1rem`, etc.) and custom clamp() ranges instead of the 8 standardized `--type-*` tokens.

**Files affected:**
- `src/app/css/sections/hero.css` (lines 44, 56, 57, 87, 100, etc.)
- `src/app/css/sections/journey.css` (lines 30, 46, 56, 73, etc.)
- `src/components/services-horizontal-scroll.module.css` (lines 113, 234, 243, 254)
- `src/app/css/pages/experience.css` (line 132)

**Fix:** Replace all hardcoded font-sizes with the 8 designated tokens:
```css
/* Current design system tokens (correct usage) */
--type-xs: 0.75rem;      /* 12px - labels */
--type-sm: 0.875rem;     /* 14px - small text */
--type-base: 1rem;       /* 16px - body default */
--type-lg: 1.125rem;     /* 18px - large body */
--type-xl: 1.25rem;      /* 20px - small heading */
--type-2xl: 1.5rem;      /* 24px - section heading */
--type-3xl: 2rem;        /* 32px - page heading */
```

**Action items:**
1. In `src/app/css/sections/hero.css`:
   - Line 44: Replace `font-size: 0.63rem;` → `font-size: var(--type-xs);`
   - Line 56: Replace `font-size: 0.68rem;` → `font-size: var(--type-xs);`
   - Line 83-85: Review and consolidate all font-size declarations to use tokens only

2. In `src/app/css/sections/journey.css`:
   - Line 30: Replace `font-size: clamp(1.1rem, 2vw, 1.3rem);` → `font-size: var(--type-lg);`

3. In `src/components/services-horizontal-scroll.module.css`:
   - Line 113: Replace `font-size: 0.7rem;` → `font-size: var(--type-xs);`
   - Line 254: Replace `font-size: clamp(0.8rem, min(1vw, 1.7vh), 1rem);` → `font-size: var(--type-sm);`

---

### Issue 2: Inconsistent corner radii (10 distinct radii)

**Root cause:** Components define inline `border-radius` values (8px, 14px, 18px, etc.) instead of the 6 standardized `--radius-*` tokens.

**Design system tokens (correct usage):**
```css
--radius-xs: 2px;       /* tight corners */
--radius-sm: 6px;       /* buttons, small cards */
--radius-md: 12px;      /* cards, modals */
--radius-lg: 16px;      /* large surfaces */
--radius-xl: 20px;      /* extra spacious cards */
--radius-full: 999px;   /* pills, circles */
```

**Files with non-token radii:**
- `src/app/css/sections/journey.css` (line 42: `border-radius: 8px;`)
- `src/components/services-horizontal-scroll.module.css` (line 222: `border-radius: var(--radius-xl);` ✓ correct)
- Various component files using hardcoded values

**Action items:**
1. Audit all `border-radius` declarations
2. Replace non-token values:
   - `8px` → `var(--radius-sm)`
   - `12px` → `var(--radius-md)`
   - `14px` → `var(--radius-md)` or `var(--radius-lg)` depending on context
   - `16px` → `var(--radius-lg)`
   - `20px` → `var(--radius-xl)`

**Command to find all non-token radii:**
```bash
grep -rn "border-radius:" src/app/css/ src/components/ | grep -v "var(--radius" | grep -v "999px" | grep -v "50%"
```

---

### Issue 3: Many button styles (9 distinct styles instead of 4)

**Root cause:** The design system defines 4 core button variants (`solid`, `line`, `pill`, `pill-solid`), but components have created additional styles with inconsistent styling.

**Documented variants in tokens.css:**
```
✓ solid — high-contrast, primary action (used)
✓ line — outlined, secondary action (used)
✓ pill — rounded pill button (used)
✓ pill-solid — solid rounded pill (used)
✗ +5 additional undocumented styles
```

**Action items:**
1. Identify all `.btn` class variants in CSS
2. Consolidate extra styles into the 4 core variants
3. Use modifier classes: `.btn--solid`, `.btn--line`, `.btn--pill`, `.btn--pill-solid`
4. Document any style that doesn't fit into these 4 as a bug and refactor

**Recommended audit command:**
```bash
grep -rn "btn" src/ --include="*.css" | grep "class\|border-radius\|background" | sort | uniq
```

---

### Issue 4: Long all-caps text in hero status label

**Selector:** `.chero__status-label`  
**Element:** `<span class="chero__status-label">Available for select projects</span>`  
**Issue:** Text is all-caps, 29 characters — harder to read than sentence case.

**Fix:** Change the text capitalization from CSS to HTML:

**In `src/content/profile.ts`:**
```typescript
// Before:
label: "Available for select projects",
// Use text-transform: uppercase in CSS

// After:
label: "Available for select projects",
// Remove CSS text-transform or change to capitalize
```

**In `src/app/css/sections/hero.css`:**
```css
.chero__status-label {
  /* Remove or modify this line: */
  text-transform: uppercase;  /* ← DELETE or change to 'capitalize' */
}
```

**Rationale:** Sentence case is more readable. If uppercase is a design requirement, consider shortening to a 2-3 word label (e.g., "Available Now") and keep sentence case.

---

### Issue 5: Body text very small (10px)

**Selector:** `.ctl__active-text`  
**Element:** `<span class="ctl__active-text">Build · Frontend Angular Developer</span>`  
**Issue:** Measured at 10px; minimum recommended is 12px for body text.

**Current size:** 10px (0.625rem via inherited size)  
**Target:** 12px or larger using `var(--type-xs)` (0.75rem)

**Fix in `src/app/css/pages/experience.css`:**
```css
.ctl__active-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--type-xs);  /* Add this line: 12px minimum */
}
```

---

### Issue 6: Body text very small (11px) in skills list

**Selector:** `#pf-readout > div > div:nth-of-type(3) > ul > li:nth-of-type(2)`  
**Element:** `<li>User/workflow understanding</li>`  
**Issue:** Measured at 11px; below readable minimum.

**Fix in `src/app/css/pages/process.css`:**

Locate `.pf__readout` (or the container for process readout text) and set:
```css
.pf__readout li {
  font-size: var(--type-xs);  /* 12px minimum */
  line-height: var(--leading-snug);  /* 1.25 */
}
```

---

### Issue 7: Long all-caps text — "OPERATING PRINCIPLES"

**Selector:** `#pprin-title`  
**Element:** `<h3 class="pprin__kicker">// Operating principles</h3>`  
**Issue:** "Operating principles" is 20 characters in all-caps; harder to scan.

**Fix in `src/app/css/sections/process.css`:**
```css
.pprin__kicker {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;  /* ← Keep only for short labels, not full phrases */
  /* Alternative: change to capitalize only the first letter */
  /* text-transform: capitalize; */
}
```

**Recommendation:** Change heading text to use `text-transform: capitalize;` or remove the transformation entirely and style the text in the markup as "Operating Principles" (title case).

---

### Issue 8: Services cards extend beyond right edge

**Selector:** `.services-horizontal-scroll-module__yxy3mG__card`  
**Issue:** Cards in pinned horizontal scroll break the page grid alignment; last card nearly touches viewport edge.

**Root cause:** The `.viewport` mask-image fades at the right edge, but the track's `padding-inline-end` is set to `var(--edge) + var(--fade)`, which is not constrained by `--shell-edge`.

**Fix in `src/components/services-horizontal-scroll.module.css`:**
```css
.pin {
  /* Ensure the entire section respects the page's max-width constraint */
  max-width: var(--container-max);
  margin-inline: auto;  /* Add this: centers the section */
}

.track {
  /* Already has padding-inline but constrain to match hero */
  padding-inline: var(--edge) calc(var(--edge) + var(--fade));
  /* No change needed here if .pin is constrained above */
}
```

**Verification:** After fix, the last card's right edge should align with the main content area's right edge (where hero text ends), not extend to the viewport.

---

### Issue 9: Hero cluttered by AI assistant widget

**Selector:** `.chat-launch` (AI widget button)  
**Issue:** Three suggestion buttons compete for attention with "View My Work" CTA.

**Fix options:**

**Option A (Recommended): Collapse suggestions into a single badge**
```css
/* In src/app/css/components/chat-widget.css */
.chat-launch__suggestion {
  display: none;  /* Hide the three suggestion buttons */
}

.chat-launch {
  /* Keep only the main chat toggle visible */
}
```

**Option B: Delay appearance with animation**
```css
.chat-launch__suggestion {
  animation: slideInDelay 0.6s var(--ease-out-quart) 2.5s forwards;
  opacity: 0;
}

@keyframes slideInDelay {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Recommended:** Use Option A; remove suggestion buttons from hero. They duplicate the main navigation.

---

### Issue 10: Process tabs staggered in "wave" pattern

**Selector:** `.pf__node` (process flow step buttons)  
**Issue:** Tabs positioned at different vertical offsets (top values vary), forcing zigzag eye movement.

**Root cause:** Inline `style="top: …"` attributes compute different y-coordinates per step to create a deliberate visual "curve."

**Fix in component file (likely `src/components/` or `src/app/`):**

If tabs are rendered with inline styles, consolidate them to a single y-axis:
```css
.pf__node {
  top: 50% !important;  /* Force all to the same vertical center */
  transform: translateY(-50%);  /* Center within that row */
  left: var(--pf-position);  /* Horizontal positioning unchanged */
}
```

**Alternative:** If the wave is intentional symbolism, document it and update the audit to "acceptable intentional design choice."

---

### Issue 11: Technology ecosystem graph is dense

**Selector:** `.eco__title` / `#technology-ecosystem`  
**Issue:** Dozens of small floating nodes create visual noise and cognitive overload.

**Fix options:**

**Option A: Simplify initial view**
```css
.eco__node-item {
  /* Add a subtle grouping background behind clusters */
}

.eco__node-item--dimmed {
  /* Increase opacity slightly (see Issue 22) */
  opacity: 0.35;  /* Up from current value */
}
```

**Option B: Add visual grouping by category**
```css
.eco__cluster-frontend,
.eco__cluster-backend,
.eco__cluster-tooling {
  /* Add a subtle background circle or container */
  background: radial-gradient(circle, var(--color-line) 0%, transparent 60%);
}
```

**Recommended first step:** Increase opacity of dimmed nodes (Issue 22) so users can see all options without clicking. Then add category backgrounds to organize visually.

---

### Issue 12: Technology tags lack consistent baseline

**Selector:** `.services-horizontal-scroll-module__yxy3mG__cardChip`  
**Issue:** Tech tag pills (Angular, Node.js) sit at different heights because they follow variable-length description text.

**Root cause:** `.cardStack` (tag container) does not use flexbox alignment rules to push tags to the bottom of the card.

**Fix in `src/components/services-horizontal-scroll.module.css`:**
```css
.card {
  display: flex;
  flex-direction: column;
  /* Ensure card is a flex container */
}

.cardStack {
  margin-top: auto;  /* Already present ✓ */
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  /* This should push the tag row to the bottom of the card.
     If tags are still ragged, check that .card uses flex-direction: column */
}
```

**Verification:** All tag rows should now align at the same y-coordinate across the card row.

---

### Issue 13: Process step labels alternate above/below icons

**Selector:** `.pf__node` labels / step text  
**Issue:** Inconsistent positioning forces visual zigzag instead of linear scanning.

**Root cause:** Labels are positioned with alternating `top` and `bottom` CSS properties, or the DOM alternates label placement.

**Fix:** Standardize to a single position (e.g., all below):
```css
/* In the component or CSS that renders process steps */
.pf__node-label {
  position: absolute;
  top: 100%;  /* All labels below icons */
  transform: translateX(-50%);  /* Center under icon */
  margin-top: 0.5rem;  /* Space between icon and label */
  white-space: nowrap;
  text-align: center;
}

/* Remove any .pf__node-label--above or similar variant */
```

---

### Issue 14: Process path follows upward diagonal

**Selector:** `.pf__node` (step icons)  
**Issue:** Icons positioned along a diagonal line (symbolizing growth) create unbalanced whitespace and visual disconnect.

**Root cause:** Inline `style="left: …%; top: …%"` computes increasing y-offset for each step.

**Fix:** Align all steps on a single horizontal baseline:
```css
.pf__node {
  top: 50% !important;  /* All steps on same y-axis */
  transform: translateY(-50%);
}

/* Position along x-axis only */
.pf__node[data-step="1"] { left: 10%; }
.pf__node[data-step="2"] { left: 25%; }
.pf__node[data-step="3"] { left: 40%; }
.pf__node[data-step="4"] { left: 55%; }
.pf__node[data-step="5"] { left: 70%; }
.pf__node[data-step="6"] { left: 85%; }
```

---

### Issue 15: Process steps numbered twice (redundant)

**Selector:** `.sidebar__index` (sidebar numbering)  
**Issue:** Numbers appear in both step labels ("01 DISCOVER") and in a second row below, creating redundancy and false affordance.

**Fix:** Remove the redundant sidebar numbers.

**In `src/app/css/components/sidebar.css`:**
```css
.sidebar__index {
  display: none;  /* Hide redundant numbering */
}

/* Or, if used elsewhere, make it very subtle */
.sidebar__index {
  opacity: 0;
  pointer-events: none;
}
```

**Rationale:** The numbers embedded in step labels are sufficient. The redundant row below creates visual noise and suggests interactivity where there may be none.

---

### Issue 16: Competing primary CTAs (header vs. hero)

**Selector:** `html > body > header > div > div:nth-of-type(2) > a` (header CTA)  
**Issue:** Both "Let's Work Together" (header) and "View My Work" (hero) use the same lime green high-contrast style, splitting attention.

**Fix: Change header CTA to secondary (outlined) style**

**In `src/app/css/components/header.css`:**
```css
header .btn {
  /* Current: likely .btn--solid with accent color */
  /* Change to: */
  border: 1px solid var(--color-line);
  background: transparent;
  color: var(--color-text);
  /* Remove accent background */
}

header .btn:hover {
  border-color: var(--color-accent);
  background: transparent;
  color: var(--color-text);
}
```

**Alternative:** Keep lime green in header but make hero CTA a larger, bolder variant:
```css
/* Hero CTA */
.chero__actions .btn--solid {
  padding: 1rem 1.5rem;  /* Larger */
  font-size: var(--type-base);  /* Larger */
  font-weight: var(--weight-bold);  /* Bold */
}
```

**Recommended:** Option 1 (header to outlined) better preserves hero as the primary focal point.

---

### Issue 17: AI widget redundant navigation buttons

**Selector:** `.chat-launch` (AI widget)  
**Issue:** Three "About Rabin", "Services", "Selected Work" buttons duplicate the main menu, creating excessive choice density.

**Fix: Simplify widget to single greeting state**

**In component or CSS:**
```css
.chat-launch__suggestion {
  display: none;  /* Hide all three suggestion buttons */
}

.chat-launch__greeting {
  display: block;
  /* Keep only: "Ask Rabin AI — Your portfolio companion" */
  max-width: 200px;
}
```

**Alternative:** Delay suggestions until after user scrolls:
```css
.chat-launch__suggestion {
  animation: revealDelay 0.5s var(--ease-out-quart) 3s forwards;
  opacity: 0;
  pointer-events: none;
}

@keyframes revealDelay {
  to { opacity: 1; pointer-events: auto; }
}
```

---

### Issue 18: Cluttered right-hand interface (sidebar + AI widget)

**Selector:** `html > body > div:nth-of-type(3) > button` (AI widget dismiss)  
**Issue:** Sidebar navigation and AI card both on right side create "control panel" effect; card partially obscures "IMPACT IS MY GOAL" text.

**Fix: Move AI widget to bottom-left corner**

**In `src/app/css/components/chat-widget.css`:**
```css
.chat-preview {
  /* Current: likely positioned right: 0; or similar */
  
  /* Change to: */
  position: fixed;
  bottom: 2rem;  /* Move to bottom */
  left: 2rem;    /* Move to left (was right) */
  right: auto;   /* Reset right */
  z-index: 100;  /* Stay above content but below modals */
}

/* Keep the chat-launch button in its current position if it's a floating FAB */
```

**Rationale:** Bottom-left balances visual weight; clears the right edge where sidebar and main content live.

---

### Issue 19: Gradient fade obscures third card title

**Selector:** `.services-horizontal-scroll-module__yxy3mG__card` (third card)  
**Issue:** The `.viewport` mask-image's gradient fade starts too early, obscuring "Mobile Applications" and description text.

**Fix: Adjust mask-image gradient to start further right**

**In `src/components/services-horizontal-scroll.module.css`:**
```css
.viewport {
  mask-image: linear-gradient(
    to right,
    transparent 0,
    #000 var(--fade),
    #000 calc(100% - calc(var(--fade) * 2)),  /* Extend solid region further right */
    transparent 100%
  );
  /* Or simply: */
  /* mask-image: linear-gradient(to right, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%); */
}
```

**Current likely state:**
```css
mask-image: linear-gradient(
  to right,
  transparent 0,
  #000 var(--fade),
  #000 calc(100% - var(--fade)),
  transparent 100%
);
```

**Change to:**
```css
mask-image: linear-gradient(
  to right,
  transparent 0,
  #000 calc(var(--fade) * 0.5),  /* Fade starts earlier */
  #000 calc(100% - var(--fade)),
  transparent 100%
);
```

---

### Issue 20: RxJS node overlaps with FRONTEND category label

**Selector:** `.eco__node-item` (RxJS node in graph)  
**Issue:** RxJS label collides with "FRONTEND" category heading; both texts become unreadable.

**Root cause:** Radial graph layout algorithm places nodes without collision detection.

**Fix: Adjust RxJS node position**

If using SVG positioning (likely in a graph component):
```css
/* Target RxJS node specifically */
[aria-label*="RxJS"] {
  transform: translate(-30px, 20px) !important;  /* Shift away from collision */
}
```

Or in the layout algorithm (if in a `.tsx` file):
```typescript
// Pseudo-code: Adjust RxJS position to avoid collision with FRONTEND label
const rxjsNode = nodes.find(n => n.name === "RxJS");
rxjsNode.x -= 30;  // Shift left
rxjsNode.y += 20;  // Shift down
```

**Alternative:** Add `text-anchor` or `dominant-baseline` to SVG text to shift baseline:
```xml
<text x="..." y="..." text-anchor="end" dominant-baseline="hanging">RxJS</text>
```

---

### Issue 21: Frontend cluster density (React & Next.js too close)

**Selector:** `.eco__node-item` (Frontend cluster nodes)  
**Issue:** React and Next.js nodes and labels sit too close; high click-miss risk.

**Fix: Increase spacing in graph layout algorithm**

If in a force-directed graph:
```typescript
// Pseudo-code: Adjust node spacing in layout
simulation
  .force("collide", d3.forceCollide().radius(50))  // Increase radius from default ~30
  .force("charge", d3.forceManyBody().strength(-200));  // Increase repulsion
```

If using CSS only:
```css
.eco__node-item {
  /* If nodes are positioned with left/top */
  margin: 2rem;  /* Increase from 1rem */
}
```

**Better solution:** Use `<title>` and `<desc>` in SVG + `pointer-events: none` on labels to reduce hit-target conflicts.

---

### Issue 22: Inactive nodes nearly illegible (too dimmed)

**Selector:** `.eco__node-item--dimmed`  
**Issue:** Inactive nodes (Postman, Git, etc.) have very low opacity; text is barely readable against dark background.

**Current opacity likely:** 0.15–0.25  
**Target opacity:** 0.45–0.55 (readable but still visually distinct from active)

**Fix in `src/app/css/sections/tech-ecosystem.css`:**
```css
.eco__node-item--dimmed {
  opacity: 0.45;  /* Increase from current low value */
  /* If color is also dimmed, adjust: */
  color: var(--color-text-faint);
  /* Ensure sufficient contrast: */
  /* text-shadow: 0 0 1px var(--color-bg); */  /* Optional: subtle shadow for legibility */
}

.eco__node-item--dimmed text {
  opacity: 0.55;  /* If text is in an SVG, boost opacity separately */
}
```

**Rationale:** Users should be able to see all available nodes at a glance. The dimmed state should indicate "not currently selected," not "invisible."

---

## Summary of Priority Fixes

### **Critical (affects readability/usability):**
- Issue #5, #6: Increase font sizes to 12px minimum
- Issue #8: Constrain services grid to page width
- Issue #18: Move AI widget away from sidebar
- Issue #19: Adjust mask-image to show third card

### **High (affects hierarchy/scanning):**
- Issue #13, #14: Align process steps horizontally
- Issue #16: Change header CTA to secondary style
- Issue #20: Shift RxJS node away from label collision
- Issue #22: Increase dimmed node opacity

### **Medium (consolidation/consistency):**
- Issue #1: Replace hardcoded font-sizes with `--type-*` tokens
- Issue #2: Replace hardcoded radii with `--radius-*` tokens
- Issue #3: Consolidate button styles to 4 core variants
- Issue #10, #13, #14: Standardize process step alignment

### **Low (accessibility improvements):**
- Issue #4, #7: Change all-caps text to sentence case
- Issue #9, #17: Collapse AI widget suggestions
- Issue #15: Hide redundant numbering
- Issue #21: Increase graph node spacing

---

## Implementation Order

1. **Phase 1 — Typography** (1 hour):
   - Issues #1, #5, #6: Standardize font sizes to `--type-*` tokens
   
2. **Phase 2 — Spacing & Layout** (2 hours):
   - Issues #8, #13, #14, #18, #19, #20: Fix alignment and positioning
   
3. **Phase 3 — Consistency** (1.5 hours):
   - Issues #2, #3, #4, #7, #10, #15: Token adoption and text normalization
   
4. **Phase 4 — Refinement** (1 hour):
   - Issues #9, #11, #17, #21, #22: Visual polish and density adjustments

**Estimated total:** 5.5 hours of implementation + testing

---

## Testing Checklist

After each fix:
- [ ] No layout shifts (CLS)
- [ ] Text remains readable on mobile (12px minimum)
- [ ] Focus rings visible on all interactive elements
- [ ] Zoom to 200% — no text overflow
- [ ] Keyboard navigation unchanged
- [ ] Color contrast maintained (4.5:1 for normal text, 3:1 for large)
