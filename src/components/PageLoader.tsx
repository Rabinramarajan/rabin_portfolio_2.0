"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { duration, ease } from "@/lib/motion";

const noopSubscribe = () => () => {};

export function PageLoader() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [forceHidden, setForceHidden] = useState(false);

  /* Hydration-safe read of the repeat-visit flag: the server snapshot (false)
     matches the server-rendered loader, so hydration never mismatches; the
     client snapshot then hides the loader before paint. */
  const gated = useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return sessionStorage.getItem("rr-loaded") === "1";
      } catch {
        /* ignore */
      }
      return false;
    },
    () => false
  );

  const visible = !reduce && !gated && !forceHidden;

  useEffect(() => {
    if (reduce || !visible) return;

    // Cinematic sequence: R1 draws → R2 draws → name → exit
    const a = window.setTimeout(() => setPhase(1), 160);
    const b = window.setTimeout(() => setPhase(2), 420);
    const done = window.setTimeout(() => {
      setForceHidden(true);
      try {
        sessionStorage.setItem("rr-loaded", "1");
      } catch {
        /* ignore */
      }
    }, 950);

    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
      window.clearTimeout(done);
    };
  }, [reduce, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="loader"
          aria-hidden
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : duration.interaction, ease }}
        >
          {/* Badge settles in (phase 1), then its lime halo blooms (phase 2). */}
          <motion.div
            className="loader__mark"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.86 }}
            transition={{ duration: duration.section, ease }}
          >
            <motion.span
              className="loader__halo"
              aria-hidden
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1.06 : 0.9 }}
              transition={{ duration: duration.section, ease }}
            />
            <Image src="/logo-mark.png" alt="" aria-hidden width={128} height={128} priority />
          </motion.div>

          <motion.p
            className="loader__name"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 6 }}
            transition={{ duration: duration.section, ease }}
          >
            RABIN R
          </motion.p>

          <motion.span
            className="loader__line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: phase >= 2 ? 1 : 0, opacity: phase >= 2 ? 1 : 0 }}
            transition={{ duration: duration.section, ease }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}