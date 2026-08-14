/** Global motion language — one rhythm across the site. */
export const ease = [0.16, 1, 0.3, 1] as const;
export const easeOutQuart = [0.165, 0.84, 0.44, 1] as const;

export const duration = {
  /** Micro 150–250ms — hovers, presses, tiny state changes */
  micro: 0.18,
  /** Interaction 250–400ms — buttons, links, small reveals */
  ui: 0.28,
  interaction: 0.38,
  /** Section 450–700ms — blocks entering the viewport */
  section: 0.6,
  /** Cinematic 700–1100ms — hero, page-level choreography */
  cinematic: 0.85,
} as const;

export const viewportOnce = {
  once: true,
  amount: 0.28,
  margin: "0px 0px -10% 0px",
} as const;