"use client";

import type { ReactionCount } from "@storyecho/schemas";
import { motion, useReducedMotion } from "motion/react";
import { EMOJI_DISPLAY } from "@/lib/community-mapper";
import { cn } from "@/lib/utils";

type ReactionPillsProps = {
  reactions: ReactionCount[];
  onToggle?: (emoji: ReactionCount["emoji"]) => void;
  compact?: boolean;
};

export function ReactionPills({ reactions, onToggle, compact = false }: ReactionPillsProps) {
  const shouldReduceMotion = useReducedMotion();
  const visible = reactions.filter((r) => r.count > 0 || r.reactedByMe);

  if (visible.length === 0 && !onToggle) return null;

  if (onToggle) {
    const allEmojis = ["heart", "sad", "angry", "fire", "clap"] as const;
    return (
      <div className="flex flex-wrap gap-2">
        {allEmojis.map((emoji) => {
          const entry = reactions.find((r) => r.emoji === emoji) ?? {
            emoji,
            count: 0,
            reactedByMe: false,
          };
          const className = cn(
            "flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors",
            entry.reactedByMe
              ? "border-primary bg-surface-cream text-primary font-semibold"
              : "border-hairline bg-white text-slate hover:bg-surface-cream/60",
          );

          if (shouldReduceMotion) {
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => onToggle(emoji)}
                className={className}
              >
                <span>{EMOJI_DISPLAY[emoji]}</span>
                {entry.count > 0 && <span>{entry.count}</span>}
              </button>
            );
          }

          return (
            <motion.button
              key={emoji}
              type="button"
              onClick={() => onToggle(emoji)}
              whileTap={{ scale: 0.92 }}
              animate={{ scale: entry.reactedByMe ? 1.05 : 1 }}
              transition={{ duration: 0.15 }}
              className={className}
            >
              <span>{EMOJI_DISPLAY[emoji]}</span>
              {entry.count > 0 && <span>{entry.count}</span>}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", compact && "pt-1")}>
      {visible.map((reaction) => (
        <div key={reaction.emoji} className="text-slate flex items-center gap-1 text-xs">
          <span>{EMOJI_DISPLAY[reaction.emoji]}</span>
          <span>{reaction.count}</span>
        </div>
      ))}
    </div>
  );
}
