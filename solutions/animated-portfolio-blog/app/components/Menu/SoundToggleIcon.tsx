"use client";

import { AnimatePresence, motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useCursorMotionGate } from "../animaiton/useCursorMotionGate";

// Mirrors ThemeToggleIcon: in muted state show Volume2 (action: unmute);
// in unmuted state VolumeX. When motion is gated off (touch device or
// prefers-reduced-motion), icons swap instantly with no animation — still
// legible, just not animated. Audio itself is not motion-gated; only the
// icon crossfade is.
export default function SoundToggleIcon({ isMuted }: { isMuted: boolean }) {
  const animate = useCursorMotionGate();
  const icon = isMuted ? <Volume2 /> : <VolumeX />;

  if (!animate) {
    return <span className="menu-item-icon">{icon}</span>;
  }

  return (
    <span className="menu-item-icon" style={{ display: "inline-flex" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isMuted ? "muted" : "unmuted"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ display: "inline-flex" }}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
