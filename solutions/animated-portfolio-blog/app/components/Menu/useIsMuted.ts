"use client";

import { useSyncExternalStore } from "react";

// Mirrors useIsDarkMode: the sound mute state lives on
// document.documentElement.dataset.sound ("muted"|"unmuted"), written
// pre-hydration by SoundInitializerScript and flipped by the radial Menu
// toggle. This hook keeps React state in sync with that single source of
// truth via a MutationObserver on the data-sound attribute.
//
// Returns true (muted) during SSR and on first client render before the
// initializer script runs — strict opt-in, audio never pops on load.

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-sound"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.dataset.sound !== "unmuted";
}

function getServerSnapshot() {
  return true;
}

export function useIsMuted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
