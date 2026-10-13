"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCursorMotionGate } from "../animaiton/useCursorMotionGate";
import "./TiltCard.scss";

const MAX_TILT = 6; // degrees

interface TiltCardProps {
  children: React.ReactNode;
  /** Extra classes appended after the base `.tilt-card` (e.g. layout / surface). */
  className?: string;
}

/**
 * Frosted glass card with optional cursor-driven 3D tilt. Tilt is gated on
 * fine-pointer + no-reduced-motion; when disabled the card renders static
 * and the consumer's CSS hover lift still applies.
 *
 * Surface styling (background, border, blur, hover border tint) is the
 * consumer's responsibility — usually the shared `.glass-card` utility from
 * global.css. This component only owns the 3D tilt behavior.
 */
export function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tilt = useCursorMotionGate();

  // Pointer position as a 0..1 fraction of the card, spring-smoothed so the
  // tilt lags slightly and feels weighted rather than twitchy.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 18 });
  const sy = useSpring(py, { stiffness: 200, damping: 18 });

  const rotateY = useTransform(sx, [0, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [0, 1], [MAX_TILT, -MAX_TILT]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const cls = className ? `tilt-card ${className}` : "tilt-card";

  return (
    <motion.div
      ref={ref}
      className={cls}
      style={tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      onPointerMove={tilt ? handleMove : undefined}
      onPointerLeave={tilt ? handleLeave : undefined}
    >
      {children}
    </motion.div>
  );
}
