"use client";

import dynamic from "next/dynamic";

/**
 * The toast surface, kept off the first paint.
 *
 * It mounts in the root layout, so it used to pull sonner and two lucide
 * icons — ~44 KB of the homepage's JavaScript — into the initial bundle of
 * every route, to render an empty container. Nothing is visible until
 * something calls `toast()`, and the only caller is the contact form, so the
 * surface has no reason to exist before hydration finishes.
 *
 * `ssr: false` is correct rather than merely convenient here: the container
 * renders nothing on the server either way, so there is no markup to lose and
 * no hydration boundary to shift. Callers import `toast` straight from sonner
 * and are unaffected by when this mounts.
 */
const ToasterSurface = dynamic(
  () => import("@/components/ToasterSurface").then((m) => m.ToasterSurface),
  { ssr: false },
);

export function Toaster() {
  return <ToasterSurface />;
}
