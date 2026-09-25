"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { setLenisInstance } from "@/lib/lenis";

/**
 * Initializes Lenis smooth-inertia scrolling. No-op on touch devices and
 * when prefers-reduced-motion is set — those users get the browser's native
 * scroll, which is correct for them.
 *
 * Renders no DOM; just owns the RAF loop. Must be a client component mounted
 * high in the tree (layout.tsx) so it persists across route changes.
 *
 * Also resets scroll to top on route change. Lenis hijacks native scroll, so
 * window.scrollTo alone is smoothed instead of instant — the Lenis instance
 * is stored in a ref so the pathname effect can call scrollTo(0, immediate).
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Skip on touch inputs — native scroll already feels right there and
    // Lenis can fight the OS's gesture handling.
    if (!finePointer || reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    // Publish the instance so lib/scrollToSection can route through Lenis
    // (Lenis hijacks native scroll on desktop — window.scrollTo is unreliable).
    setLenisInstance(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  // Reset scroll to top on route change. Skips the initial mount so browser
  // navigation restore / hash anchors aren't clobbered. Uses lenis.scrollTo
  // (immediate) when Lenis is running; falls back to window.scrollTo for
  // touch / reduced-motion where Lenis is disabled.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}
