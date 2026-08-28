"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navigation, profile } from "@/content/profile";
import { duration, ease } from "@/lib/motion";
import { useScrollSync } from "@/lib/scroll-sync";
import { Logo } from "@/components/Logo";
import { Magnetic } from "@/components/motion";
import { isStandaloneRoute } from "@/lib/chrome-routes";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { active: activeSection } = useScrollSync();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  /* ---- Scroll-aware show/hide + scroll state ---- */
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;

        // At top: always show, always transparent
        if (y < 10) {
          setHidden(false);
          setScrolled(false);
        } else {
          setScrolled(true);
          // Smart hide: only after scrolling 60px+ from last checkpoint
          if (delta > 60) {
            setHidden(true);
          } else if (delta < -30) {
            setHidden(false);
          }
        }

        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- Sliding indicator ---- */
  const moveIndicator = useCallback(
    (item: HTMLElement | null) => {
      const indicator = indicatorRef.current;
      const nav = navRef.current;
      if (!indicator || !nav || !item || reduce) return;

      const navRect = nav.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const x = itemRect.left - navRect.left;
      const w = itemRect.width;

      indicator.style.width = `${w}px`;
      indicator.style.transform = `translateX(${x}px)`;
      indicator.style.opacity = "1";
    },
    [reduce],
  );

  // Reset indicator when no section is active (hero state)
  useEffect(() => {
    if (!activeSection && indicatorRef.current) {
      indicatorRef.current.style.opacity = "0";
    }
  }, [activeSection]);

  // Position indicator on mount, resize, and active section change
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const update = () => {
      if (!activeSection || !navRef.current) {
        if (indicatorRef.current) {
          indicatorRef.current.style.opacity = "0";
        }
        return;
      }

      // Find the nav item that corresponds to the active section
      const links = navRef.current.querySelectorAll("a");
      for (const link of links) {
        const href = link.getAttribute("href") ?? "";
        if (href.includes(`#${activeSection}`)) {
          moveIndicator(link.closest("li") as HTMLElement | null ?? link);
          return;
        }
        const route = href.replace(/^\//, "");
        if (route === activeSection) {
          moveIndicator(link.closest("li") as HTMLElement | null ?? link);
          return;
        }
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeSection, moveIndicator]);

  /* Body scroll lock while the mobile menu is open */
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
      toggle?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  /* Sentinel for scroll detection */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Keyboard: ESC closes, Tab trapped inside menu */
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

  if (isStandaloneRoute(pathname)) return null;

  const isActive = (item: (typeof navigation)[number]) => {
    if (item.href.startsWith("/") && !item.href.includes("#")) {
      return pathname === item.href || pathname.startsWith(item.href + "/");
    }
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

  const currentYear = new Date().getFullYear();
  const sectionNumber = activeSection ? navigation.findIndex((item) => item.sectionId === activeSection) + 1 : 0;
  const totalSections = navigation.length;

  return (
    <>
      <div ref={sentinelRef} aria-hidden style={{ position: "absolute", width: 1, height: 1 }} />
      <header
        className={cn("hd", scrolled && "is-scrolled", hidden && "is-hidden")}
        aria-label="Site header"
      >
        <div className="hd__inner">
          <motion.div {...fade(0.05)}>
            <Link href="/" aria-label="Rabin R — home" className="logo">
              <Logo />
            </Link>
          </motion.div>
          <motion.nav className="hd__nav" aria-label="Primary" {...fade(0.14)}>
            <ul ref={navRef}>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={isActive(item) ? "is-active" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <span ref={indicatorRef} className="hd__indicator" aria-hidden="true" />
            </ul>
          </motion.nav>
          <motion.div className="hd__timing" {...fade(0.18)} aria-label="Current section">
            <div className="hd__timing-year">{currentYear}</div>
            <div className="hd__timing-status">
              <span className="hd__timing-label">Present</span>
              <span className="hd__timing-current">Current</span>
            </div>
            {activeSection && (
              <div className="hd__timing-counter">
                {String(sectionNumber).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
              </div>
            )}
          </motion.div>
          <motion.div className="hd__cta" {...fade(0.22)}>
            <Magnetic strength={8}>
              <Link href="/contact" className="btn btn--solid" style={{ borderRadius: 0 }} data-cursor="button" data-cursor-label="LET'S TALK →">
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
                <motion.li
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.1 + navigation.length * 0.06, duration: duration.ui, ease }}
                >
                  <Link href="/about" className={isActive({ href: "/about", label: "About" }) ? "is-active" : undefined} onClick={() => setOpen(false)}>
                    <span className="mm__index">{String(navigation.length + 1).padStart(2, "0")}</span>
                    About
                  </Link>
                </motion.li>
                <motion.li
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.1 + (navigation.length + 1) * 0.06, duration: duration.ui, ease }}
                >
                  <Link href="/contact" className={isActive({ href: "/contact", label: "Contact" }) ? "is-active" : undefined} onClick={() => setOpen(false)}>
                    <span className="mm__index">{String(navigation.length + 2).padStart(2, "0")}</span>
                    Contact
                  </Link>
                </motion.li>
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
