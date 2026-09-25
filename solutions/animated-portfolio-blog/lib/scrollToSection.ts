import { getLenisInstance } from "./lenis";

/**
 * Smooth-scroll so the element with the given id is centered vertically in
 * the viewport (or top-aligned if it's taller than the viewport). Used by
 * home-page section navigation.
 *
 * Routes through Lenis when it's active (desktop pointers, no reduced-motion)
 * because Lenis hijacks native scroll there and window.scrollTo({ behavior:
 * "smooth" }) is unreliable. Falls back to native smooth scroll on touch /
 * reduced-motion, where Lenis is off.
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const offset =
    window.innerHeight > element.offsetHeight
      ? (window.innerHeight - element.offsetHeight) / 2
      : 0;

  const lenis = getLenisInstance();
  if (lenis) {
    // Lenis scrolls to `offset` from the top of the element; negate our centering
    // offset so it scrolls to (element top - centering offset).
    lenis.scrollTo(element, { offset: -offset });
    return;
  }

  window.scrollTo({
    top: element.offsetTop - offset,
    left: 0,
    behavior: "smooth",
  });
}
