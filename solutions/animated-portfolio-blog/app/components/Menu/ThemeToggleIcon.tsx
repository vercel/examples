"use client";

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useCursorMotionGate } from "../animaiton/useCursorMotionGate";

/**
 * Sun/moon crossfade for the radial-menu theme toggle. In dark mode the sun
 * is shown (action: switch to light); in light mode the moon. When motion is
 * gated off (touch device or prefers-reduced-motion), the icons swap instantly
 * with no animation — still legible, just not animated.
 */
export default function ThemeToggleIcon({ isDark }: { isDark: boolean }) {
  const animate = useCursorMotionGate();
  const icon = isDark ? <Sun /> : <Moon />;

  if (!animate) {
    return <span className="menu-item-icon">{icon}</span>;
  }

  return (
    <span className="menu-item-icon" style={{ display: "inline-flex" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
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
