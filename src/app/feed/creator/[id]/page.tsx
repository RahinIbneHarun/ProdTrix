"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { CreatorAvatar } from "@/components/feed/CreatorAvatar";
import { FollowButton } from "@/components/feed/FollowButton";
import { PostCard } from "@/components/feed/PostCard";
import { FEED_POSTS, getCreator } from "@/data/feed-data";

export default function CreatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const creator = getCreator(id);

  if (!creator) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border p-12 text-center">
        <h1 className="font-semibold">Profile not found</h1>
        <Link href="/feed" className="mt-3 inline-block text-sm font-medium underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const posts = FEED_POSTS.filter((p) => p.creatorId === creator.id).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div className="mx-auto max-w-[52rem] space-y-4">
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center">
        <CreatorAvatar creator={creator} size={88} />
        <div>
          <h1 className="flex items-center justify-center gap-1.5 text-xl font-semibold">
            {creator.name}
            {creator.verified && <BadgeCheck className="size-5 fill-sky-500 text-white" aria-label="Verified" />}
          </h1>
          <p className="text-sm text-muted-foreground">@{creator.handle}</p>
          <p className="mt-2 text-sm">{creator.headline}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {posts.length} post{posts.length === 1 ? "" : "s"}
        </p>
        <FollowButton creatorId={creator.id} className="h-9 px-5 text-sm" />
      </section>

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {creator.name} hasn't posted anything yet.
        </p>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
