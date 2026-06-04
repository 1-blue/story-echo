"use client";

import { Children, isValidElement } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const STORY_ECHO_EASE = [0.16, 1, 0.3, 1] as const;

type AnimatedListItemProps = {
  children: React.ReactNode;
  index?: number;
};

export function AnimatedListItem({ children, index = 0 }: AnimatedListItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: STORY_ECHO_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

type AnimatedListProps = {
  className?: string;
  children: React.ReactNode;
  /** @deprecated delay is derived from item index (0.05s step) */
  delay?: number;
};

export function AnimatedList({ className, children }: AnimatedListProps) {
  const items = Children.toArray(children);

  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) =>
        isValidElement(item) ? (
          <AnimatedListItem key={item.key} index={index}>
            {item}
          </AnimatedListItem>
        ) : null,
      )}
    </div>
  );
}
