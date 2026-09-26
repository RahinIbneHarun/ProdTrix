"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { FeedCreator } from "@/interfaces/feed.interface";

export function CreatorAvatar({
  creator,
  size = 40,
  className,
}: {
  creator: Pick<FeedCreator, "name" | "avatarUrl">;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-semibold text-muted-foreground",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {creator.avatarUrl ? (
        <Image
          src={creator.avatarUrl}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        creator.name.charAt(0)
      )}
    </span>
  );
}
