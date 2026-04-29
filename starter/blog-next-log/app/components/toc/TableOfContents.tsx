"use client";

import { useEffect, useState, useCallback } from "react";
import type { TableOfContents as TOCType } from "~core/blog/types";

interface Props {
  toc: TOCType;
}

export default function TableOfContents({ toc }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>("");

  useEffect(() => {
    const h2Headings = Array.from(
      document.querySelectorAll("h2")
    ) as HTMLElement[];

    h2Headings.forEach((h) => {
      h.style.scrollMarginTop = "100px";
    });

    if (h2Headings.length === 0) return;

    // Set initial active based on current scroll position
    let initial = h2Headings[0].id;
    for (const h of h2Headings) {
      if (h.offsetTop <= window.scrollY + 120) initial = h.id;
    }
    setActiveSlug(initial);

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);

        if (intersecting.length > 0) {
          setActiveSlug(intersecting[0].target.id);
        }
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 }
    );

    h2Headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
      e.preventDefault();
      const el = document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSlug(slug);
      }
    },
    []
  );

  if (toc.length === 0) return null;

  const tocList = (
    <div className="flex flex-col gap-1 border-l-2 border-border pl-4">
      {toc.map((section) => (
        <div key={section.slug}>
          <a
            href={`#${section.slug}`}
            onClick={(e) => handleClick(e, section.slug)}
            className={`block text-sm py-1 transition-colors hover:text-foreground ${
              activeSlug === section.slug
                ? "text-blue font-medium"
                : "text-muted-foreground"
            }`}
          >
            {section.text}
          </a>
          {section.subSections.length > 0 &&
            section.subSections.map((sub) => (
              <a
                key={sub.slug}
                href={`#${sub.slug}`}
                onClick={(e) => handleClick(e, sub.slug)}
                className={`block text-sm py-1 pl-4 transition-colors hover:text-foreground ${
                  activeSlug === sub.slug
                    ? "text-blue font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {sub.text}
              </a>
            ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop: sticky sidebar, positioned outside content area */}
      <div className="hidden xl:block absolute -right-[260px] top-0 h-full not-prose">
        <aside className="sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="w-[220px]">
            {tocList}
          </div>
        </aside>
      </div>
    </>
  );
}
