"use client";

import dynamic from "next/dynamic";

/**
 * The custom cursor, kept off the first paint.
 *
 * CustomCursor already renders `null` until its `(pointer: fine)` check
 * flips true after hydration, so the server has never emitted a single node
 * for it — yet its module sat in the root layout's initial bundle on every
 * route, including the touch devices that can never show it. Deferring the
 * import changes nothing about when the cursor appears (it was always
 * post-hydration) and takes its state machine off the critical path.
 *
 * Everything it renders is `position: fixed`, so nothing here can shift
 * layout whenever it does arrive.
 */
const CustomCursorImpl = dynamic(
  () => import("@/components/custom-cursor/CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);

export function CustomCursorMount() {
  return <CustomCursorImpl />;
}
