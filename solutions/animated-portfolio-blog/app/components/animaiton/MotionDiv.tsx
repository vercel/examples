"use client";

import React, { ReactNode, useRef } from "react";
import { motion, useInView, Variants } from "motion/react";

interface MotionDivProps {
  children: ReactNode;
  variants: Variants;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function MotionDiv({
  children,
  variants,
  delay = 0,
  duration = 0.6,
  className = "",
}: MotionDivProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
