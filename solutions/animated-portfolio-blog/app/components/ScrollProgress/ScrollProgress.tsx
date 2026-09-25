"use client";

import { motion, useScroll, useSpring } from "motion/react";
import "./ScrollProgress.scss";

/**
 * Thin gradient progress bar pinned to the top of the viewport, scaled by the
 * document scroll fraction. Uses motion's useScroll + a spring so it glides
 * in sync with Lenis (Lenis drives the native scroll position; useScroll
 * listens to that). Hidden on routes where there is no scroll.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
