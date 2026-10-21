"use client";

import React, { ReactNode } from "react";
import { motion } from "motion/react";
import { useCursorMotionGate } from "./components/animaiton/useCursorMotionGate";

// Next.js template.tsx remounts on every navigation (unlike layout.tsx which
// persists), so the motion.div below starts at its initial state each time —
// no key or AnimatePresence needed. No exit animations either: they require
// keeping old server-rendered content mounted, which fights with App Router.
// Entrance-only is the pragmatic choice; the 0.3s fade is too quick for the
// absence of an exit to be noticeable.
export default function Template({ children }: { children: ReactNode }) {
  const animate = useCursorMotionGate();

  if (!animate) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
