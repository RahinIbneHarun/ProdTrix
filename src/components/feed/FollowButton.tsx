"use client";

import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";

export function FollowButton({
  creatorId,
  className,
}: {
  creatorId: string;
  className?: string;
}) {
  const isFollowing = useFeedStore((s) => s.following.includes(creatorId));
  const toggleFollow = useFeedStore((s) => s.toggleFollow);

  return (
    <button
      type="button"
      // Optimistic: state flips immediately; a backend call would reconcile here.
      onClick={() => toggleFollow(creatorId)}
      aria-pressed={isFollowing}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-full px-3 text-xs font-semibold transition-colors",
        isFollowing
          ? "border border-border bg-transparent text-muted-foreground hover:border-destructive/40 hover:text-destructive"
          : "bg-primary text-primary-foreground hover:bg-primary/85",
        className,
      )}
    >
      {isFollowing ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
