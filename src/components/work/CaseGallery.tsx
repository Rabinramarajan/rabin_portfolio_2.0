"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/SmartImage";
import type { MediaRef } from "@/content/types";

type Frame = Required<MediaRef>;

/**
 * The case-study gallery and its lightbox.
 *
 * Thumbnails stay lazy — only the frame the reader opens is ever requested at
 * full width, so a nine-screenshot case study still costs one image on load.
 *
 * The lightbox is a modal dialog in behaviour as well as in role: Escape
 * closes, arrow keys walk the set, focus moves into the dialog on open, the
 * trigger is restored on close, and the page behind it stops scrolling. On
 * touch, a horizontal swipe advances — the same two actions the arrow buttons
 * expose, so nothing is gesture-only.
 */
export function CaseGallery({ frames }: { frames: Frame[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => setOpen((n) => (n === null ? n : (n + delta + frames.length) % frames.length)),
    [frames.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "Tab") {
        // A two-control dialog: keeping Tab inside it is a single wrap.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close, step]);

  const frame = open === null ? null : frames[open];

  return (
    <>
      <ul className="cgal">
        {frames.map((f, i) => (
          <li key={f.src} className="cgal__cell">
            <button
              type="button"
              className="cgal__btn"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setOpen(i);
              }}
              aria-label={`Open image ${i + 1} of ${frames.length}: ${f.alt}`}
            >
              <SmartImage
                src={f.src}
                alt=""
                width={f.width}
                height={f.height}
                sizes="(min-width: 900px) 45vw, 100vw"
              />
              <span className="cgal__zoom" aria-hidden>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="7" cy="7" r="4.2" />
                  <path d="M10.2 10.2 14 14M7 5.2v3.6M5.2 7h3.6" />
                </svg>
              </span>
            </button>
            <p className="cgal__cap">{f.alt}</p>
          </li>
        ))}
      </ul>

      {frame ? (
        <div
          className="clbox"
          role="dialog"
          aria-modal="true"
          aria-label={frame.alt}
          ref={dialogRef}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onTouchStart={(event) => {
            touchX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchX.current;
            const end = event.changedTouches[0]?.clientX;
            touchX.current = null;
            if (start === null || end === undefined) return;
            if (Math.abs(end - start) > 48) step(end < start ? 1 : -1);
          }}
        >
          <button type="button" className="clbox__close" onClick={close} aria-label="Close image viewer">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="m4 4 8 8M12 4l-8 8" />
            </svg>
          </button>

          <figure className="clbox__figure">
            <SmartImage
              src={frame.src}
              alt={frame.alt}
              width={frame.width}
              height={frame.height}
              sizes="90vw"
              priority
            />
            <figcaption className="clbox__cap">
              <span className="clbox__count">
                {String((open ?? 0) + 1).padStart(2, "0")} / {String(frames.length).padStart(2, "0")}
              </span>
              {frame.alt}
            </figcaption>
          </figure>

          {frames.length > 1 ? (
            <div className="clbox__nav">
              <button type="button" onClick={() => step(-1)} aria-label="Previous image">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M10 3.5 5.5 8l4.5 4.5" />
                </svg>
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next image">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
