"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navigation, profile } from "@/content/profile";
import { useScrollSync } from "@/lib/scroll-sync";
import { Logo } from "@/components/Logo";
import { isStandaloneRoute } from "@/lib/chrome-routes";

export function Navbar() {
  const pathname = usePathname();
  const { active: activeSection } = useScrollSync();
  const [open, setOpen] = useState(false);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* ---- Sliding indicator ---- */
  const moveIndicator = useCallback(
    (item: HTMLElement | null) => {
      const indicator = indicatorRef.current;
      const nav = navRef.current;
      if (!indicator || !nav || !item) return;

      const navRect = nav.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const x = itemRect.left - navRect.left;
      const w = itemRect.width;

      indicator.style.width = `${w}px`;
      indicator.style.transform = `translateX(${x}px)`;
      indicator.style.opacity = "1";
    },
    [],
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

  return (
    <>
      <header
        className="hd"
        aria-label="Site header"
      >
        <div className="hd__inner">
          <div>
            <Link href="/" aria-label="Rabin R — home" className="logo">
              <Logo />
            </Link>
          </div>
          <nav className="hd__nav" aria-label="Primary">
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
          </nav>
          <div className="hd__cta">
            <Link href="/contact" className="btn btn--solid" style={{ borderRadius: 0 }} data-cursor="button" data-cursor-label="LET'S TALK →">
              <span className="btn__label">
                Let&apos;s Work Together
                <svg viewBox="0 0 16 16" aria-hidden className="btn__arrow">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </Link>
          </div>
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
      {open && (
        <div
          ref={overlayRef}
          className="mm"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
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
                <li key={item.href}>
                  <Link href={item.href} className={isActive(item) ? "is-active" : undefined} onClick={() => setOpen(false)}>
                    <span className="mm__index">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/about" className={isActive({ href: "/about", label: "About" }) ? "is-active" : undefined} onClick={() => setOpen(false)}>
                  <span className="mm__index">{String(navigation.length + 1).padStart(2, "0")}</span>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={isActive({ href: "/contact", label: "Contact" }) ? "is-active" : undefined} onClick={() => setOpen(false)}>
                  <span className="mm__index">{String(navigation.length + 2).padStart(2, "0")}</span>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <div className="mm__foot">
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
          </div>
        </div>
      )}
    </>
  );
}
