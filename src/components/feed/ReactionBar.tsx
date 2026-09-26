"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFeedStore, useReactionCounts } from "@/store/feed-store";
import type { FeedPost, ReactionType } from "@/interfaces/feed.interface";
import { AnimatedCount } from "./AnimatedCount";

export const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "gold", emoji: "🥇", label: "Gold" },
  { type: "diamond", emoji: "💎", label: "Diamond" },
  { type: "clap", emoji: "👏", label: "Clap" },
  { type: "tasty", emoji: "😋", label: "Tasty" },
];

export function ReactionBar({ post }: { post: FeedPost }) {
  const { counts, mine } = useReactionCounts(post);
  const setReaction = useFeedStore((s) => s.setReaction);

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Reactions">
      {REACTIONS.map(({ type, emoji, label }) => {
        const active = mine === type;
        return (
          <motion.button
            key={type}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setReaction(post.id, type)}
            aria-pressed={active}
            title={active ? `Remove ${label}` : label}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors",
              active
                ? "border-foreground/30 bg-foreground/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <motion.span
              aria-hidden
              animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-base leading-none"
            >
              {emoji}
            </motion.span>
            <span className="hidden sm:inline">{label}</span>
            <AnimatedCount value={counts[type]} />
          </motion.button>
        );
      })}
    </div>
  );
}
