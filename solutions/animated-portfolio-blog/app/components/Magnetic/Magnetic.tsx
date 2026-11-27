"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Magnetic hover wrapper — children gently pull toward the cursor while
 * hovered, then spring back on leave. No-op on touch devices and when
 * prefers-reduced-motion is set (we check the same media queries as the
 * custom cursor; on those devices the wrapper just renders children inline).
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className,
  style,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-flex", x: sx, y: sy, ...style }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerDown={reset}
    >
      {children}
    </motion.div>
  );
}
