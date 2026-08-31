import type Lenis from "lenis";

// Module-level singleton holding the active Lenis instance, if any. Set by
// <SmoothScroll /> on mount, cleared on unmount. Read by lib/scrollToSection
// so it can route through Lenis when active (Lenis hijacks native scroll on
// desktop pointers — window.scrollTo is unreliable under it) and fall back
// to window.scrollTo otherwise (touch / reduced-motion, where Lenis is off).
let currentLenis: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null): void {
  currentLenis = lenis;
}

export function getLenisInstance(): Lenis | null {
  return currentLenis;
}
