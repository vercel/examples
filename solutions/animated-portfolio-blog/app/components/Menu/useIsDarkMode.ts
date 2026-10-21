"use client";

import { useSyncExternalStore } from "react";

/**
 * Live-reactive view of the `.dark` class on <html>. ThemeInitializerScript
 * sets the class before hydration; the menu theme toggle flips it. This hook
 * keeps React state in sync with that single source of truth via a
 * MutationObserver on the class attribute, so callers don't have to mirror
 * the class into useState themselves (which trips the
 * react-hooks/set-state-in-effect rule).
 *
 * Returns false during SSR; the first client render reads the real value.
 */
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function useIsDarkMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
