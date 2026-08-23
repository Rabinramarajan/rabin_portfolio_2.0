"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navigation, profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { useScrollSync } from "@/lib/scroll-sync";
import { Logo } from "@/components/Logo";
import { Magnetic } from "@/components/motion";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { active: activeSection } = useScrollSync();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* Body scroll lock while the mobile menu is open. Locking <html> as well
     stops iOS Safari from rubber-banding the page behind the overlay. */
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const toggle = toggleRef.current;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      // The cleanup runs exactly when `open` flips false, so focus returns to
      // the control that opened the menu.
      toggle?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  /* Header surface appears after leaving the top of the page */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Keyboard: ESC closes, Tab is trapped inside the menu */
  useEffect(() => {
    if (!open) return;
    const root = overlayRef.current;
    if (!root) return;
    const focusables = [...root.querySelectorAll<HTMLElement>("a, button")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (item: (typeof navigation)[number]) => {
    if (item.href.startsWith("/") && !item.href.includes("#")) {
      return pathname === item.href || pathname.startsWith(item.href + "/");
    }
    if (item.href === "/#contact" || item.href === "/contact") return pathname === "/contact";
    if (item.sectionId && pathname === "/" && activeSection === item.sectionId) return true;
    if (item.sectionId && pathname === `/${item.sectionId}`) return true;
    return false;
  };

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: duration.ui, delay, ease },
        };

  return (
    <>
      <div ref={sentinelRef} aria-hidden style={{ position: "absolute", width: 1, height: 1 }} />
      <header className={cn("hd", scrolled && "is-scrolled")}>
        <div className="hd__inner">
          <motion.div {...fade(0.05)}>
            <Link href="/" aria-label="Rabin R — home" className="logo">
              <Logo />
            </Link>
          </motion.div>
          <motion.nav className="hd__nav" aria-label="Primary" {...fade(0.14)}>
            <ul>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={isActive(item) ? "is-active" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
          <motion.div className="hd__cta" {...fade(0.22)}>
            <Magnetic strength={8}>
              <Link href="/contact" className="btn btn--solid" style={{ borderRadius: 0 }}>
                <span className="btn__label">
                  Let&apos;s Work Together
                  <svg viewBox="0 0 16 16" aria-hidden className="btn__arrow">
                    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </Link>
            </Magnetic>
          </motion.div>
          <button
            ref={toggleRef}
            className="hd__toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={overlayRef}
            className="mm"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduce ? duration.micro : duration.section, ease }}
          >
            <div className="mm__top">
              <Link href="/" onClick={() => setOpen(false)} aria-label="Rabin R — home">
                <Logo />
              </Link>
              <button
                ref={closeRef}
                className="hd__toggle is-open"
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <span />
                <span />
              </button>
            </div>
            <nav className="mm__nav" aria-label="Mobile">
              <ul>
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.1 + i * 0.06, duration: duration.ui, ease }}
                  >
                    <Link href={item.href} className={isActive(item) ? "is-active" : undefined} onClick={() => setOpen(false)}>
                      <span className="mm__index">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="mm__foot"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.55, duration: duration.ui, ease }}
            >
              <Link href="/contact" className="btn btn--solid" onClick={() => setOpen(false)}>
                <span className="btn__label">
                  Let&apos;s Work Together
                  <svg viewBox="0 0 16 16" aria-hidden className="btn__arrow">
                    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </Link>
              <a className="mm__email" href={"mailto:" + profile.email}>
                {profile.email}
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}