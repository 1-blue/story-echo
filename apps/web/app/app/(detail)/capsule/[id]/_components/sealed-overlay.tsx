"use client";

import { Lock } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function SealedOverlay() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="border-capsule/20 bg-capsule-soft/60 relative overflow-hidden rounded-xl border p-8">
      <div className="absolute inset-0 backdrop-blur-[2px]" />
      <div className="relative flex flex-col items-center gap-3 py-8 text-center">
        {shouldReduceMotion ? (
          <Lock className="text-capsule size-10" strokeWidth={1.75} />
        ) : (
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lock className="text-capsule size-10" strokeWidth={1.75} />
          </motion.div>
        )}
        <p className="text-charcoal text-base font-medium">봉인된 편지예요</p>
        <p className="text-slate text-sm">해제일까지 열어볼 수 없어요.</p>
      </div>
    </div>
  );
}
