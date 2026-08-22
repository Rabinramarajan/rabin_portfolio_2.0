"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { duration, ease } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { cn } from "@/lib/cn";

type Hover = "scale" | "lift";

export function ContactReveal({
  children,
  className,
  delay = 0,
  hero = false,
  hover,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  hero?: boolean;
  hover?: Hover;
}) {
  const reduce = useReducedMotionSafe();
  const initial = reduce
    ? { opacity: 0 }
    : hero
      ? { opacity: 0, y: 16, scale: 1.02 }
      : { opacity: 0, y: 24, scale: 0.98 };
  const visible = { opacity: 1, y: 0, scale: 1 };
  const hoverMotion =
    reduce || !hover ? undefined : hover === "scale" ? { scale: 1.015 } : { y: -3 };

  return (
    <motion.div
      className={className}
      initial={initial}
      {...(hero
        ? { animate: visible }
        : { whileInView: visible, viewport: { once: true, amount: 0.28 } })}
      whileHover={hoverMotion}
      transition={{
        duration: reduce ? duration.micro : hero ? duration.cinematic : 0.72,
        delay: reduce ? 0 : delay,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}

export function ContactLazyVideo({
  src,
  className,
  label,
}: {
  src: string;
  className?: string;
  label?: string;
}) {
  const reduce = useReducedMotionSafe();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) setReady(true);
        const video = videoRef.current;
        if (!video || !visible) {
          video?.pause();
          return;
        }
        if (!reduce) void video.play().catch(() => undefined);
        else video.pause();
      },
      { rootMargin: "240px 0px", threshold: 0.08 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return;
    if (reduce) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, [ready, reduce, src]);

  return (
    <div ref={wrapRef} className={cn("cp-video", className)}>
      <video
        ref={videoRef}
        className="cp-video__el"
        src={ready ? encodeURI(src) : undefined}
        autoPlay={!reduce && ready}
        muted
        loop
        playsInline
        preload={ready ? "metadata" : "none"}
        disablePictureInPicture
        aria-hidden={label ? undefined : true}
        aria-label={label}
        tabIndex={-1}
      />
    </div>
  );
}
