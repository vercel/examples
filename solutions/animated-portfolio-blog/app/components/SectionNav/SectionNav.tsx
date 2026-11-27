"use client";

import React, { useEffect, useState } from "react";
import SectionConfig from "@/app/config/SectionConfig";
import { scrollToSection } from "@/lib/scrollToSection";
import { TooltipId } from "../tooltip";
import "./SectionNav.scss";

// One entry per scroll-spy dot. The hero (TopSection) is included so the
// top of the page has an active dot too — it's outside SectionConfig because
// it isn't a Section component, so we prepend it manually here.
type SectionNavItem = { key: string; name: string };

const SECTIONS: SectionNavItem[] = [
  { key: "top", name: "Home" },
  ...SectionConfig.filter((s) => s.headerIconKey).map((s) => ({
    key: s.key,
    name: s.name,
  })),
];

/**
 * Always-visible scroll-spy dots, mounted only on `/` (see app/page.tsx).
 * One button per section; the section crossing the viewport center is marked
 * `aria-current="true"` and styled as the active dot. Hover reveals the
 * section name via the shared react-tooltip instance.
 *
 * Uses an independent IntersectionObserver rather than reading Section's
 * internal `section-active` class — keeps the two systems decoupled and
 * allows the active threshold (centered 20% band) to differ from Section's
 * own in-view styling hook (50% coverage).
 */
export default function SectionNav() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.key);
      if (!el) return;

      // Trigger band = middle 20% of the viewport. A section becomes active
      // when it enters that band; the last one to cross wins (matches
      // typical scroll-spy behavior).
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveKey(section.key);
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav className="section-nav" aria-label="Page sections">
      {SECTIONS.map((section) => {
        const isActive = activeKey === section.key;
        return (
          <button
            key={section.key}
            type="button"
            className="section-nav-dot"
            aria-label={section.name}
            aria-current={isActive ? "true" : undefined}
            data-tooltip-id={TooltipId}
            data-tooltip-content={section.name}
            data-tooltip-place="left"
            onClick={() => scrollToSection(section.key)}
          >
            <span className="section-nav-dot__indicator" />
          </button>
        );
      })}
    </nav>
  );
}
