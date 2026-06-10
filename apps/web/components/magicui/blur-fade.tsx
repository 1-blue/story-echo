"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  type MotionProps,
  type Variants,
} from "motion/react";

const STORY_ECHO_EASE = [0.16, 1, 0.3, 1] as const;

type BlurFadeProps = MotionProps & {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  offset?: number;
  inView?: boolean;
};

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.5,
  delay = 0,
  offset = 6,
  inView = false,
  ...props
}: BlurFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewResult = useInView(ref, { once: true, margin: "-50px" });
  const isInView = !inView || inViewResult;
  const shouldReduceMotion = useReducedMotion();

  const defaultVariants: Variants = {
    hidden: {
      y: offset,
      opacity: 0,
      filter: "blur(6px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  const combinedVariants = variant ?? defaultVariants;

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay,
          duration,
          ease: STORY_ECHO_EASE,
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
