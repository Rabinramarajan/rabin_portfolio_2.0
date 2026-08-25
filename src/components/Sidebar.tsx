"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { sidebarNavigation } from "@/content/profile";
import { useScrollSync } from "@/lib/scroll-sync";

export function Sidebar() {
  const pathname = usePathname();
  const { active: activeSection } = useScrollSync();

  const isActive = (item: (typeof sidebarNavigation)[number]) => {
    if (item.sectionId && pathname === "/" && activeSection === item.sectionId) return true;
    if (item.sectionId && pathname === `/${item.sectionId}`) return true;
    if (item.href.startsWith("/") && !item.href.includes("#")) return pathname === item.href;
    return false;
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav" aria-label="Sidebar navigation">
        <div className="sidebar__accent-line" />
        <ul className="sidebar__list">
          {sidebarNavigation.map((item, index) => (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.1, duration: 0.5, ease: "easeOut" }}
              className="sidebar__item"
            >
              <Link href={item.href} className={isActive(item) ? "sidebar__link is-active" : "sidebar__link"}>
                <span className="sidebar__index">{String(index + 1).padStart(2, "0")}</span>
                <span className="sidebar__text">{item.label}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
