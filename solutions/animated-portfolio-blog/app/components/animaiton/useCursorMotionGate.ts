"use client";

import { useSyncExternalStore } from "react";

/**
 * Live-reactive gate for features that should only run on devices with a
 * fine pointer (mouse/trackpad) AND when the user has not requested reduced
 * motion. Returns false during SSR and on touch devices / reduced-motion.
 *
 * Subscribes via useSyncExternalStore so changes (e.g. the user toggles
 * prefers-reduced-motion in OS prefs while the page is open) are picked up
 * live without a remount.
 *
 * Used by CustomCursor and TopSection's cursor-driven variable weight.
 * SmoothScroll intentionally uses a one-shot mount-time check instead —
 * Lenis doesn't support mid-flight enable/disable.
 */
const GATE_QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(GATE_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(GATE_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useCursorMotionGate(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
