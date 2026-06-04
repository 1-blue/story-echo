"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type MotionFabProps = {
  children: React.ReactNode;
  className?: string;
};

export function MotionFab({ children, className }: MotionFabProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
