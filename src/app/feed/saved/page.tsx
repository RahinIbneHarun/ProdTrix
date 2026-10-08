"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { PageHeading } from "@/components/feed/PageHeading";
import { PostCard } from "@/components/feed/PostCard";
import { getPost } from "@/data/feed-data";
import type { FeedPost } from "@/interfaces/feed.interface";
import { useFeedStore } from "@/store/feed-store";

export default function SavedRoomPage() {
  const saved = useFeedStore((s) => s.saved);
  const posts = Object.entries(saved)
    .sort(([, a], [, b]) => b.localeCompare(a))
    .map(([id]) => getPost(id))
    .filter((p): p is FeedPost => Boolean(p));

  return (
    <div className="mx-auto max-w-[52rem] space-y-4">
      <PageHeading
        icon={<Bookmark />}
        title="Saved"
        description={`${posts.length} item${posts.length === 1 ? "" : "s"}`}
      />

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-semibold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap <span className="font-medium text-foreground">Save</span> on any post to keep it here.
          </p>
          <Link href="/feed" className="mt-4 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Browse the feed
          </Link>
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
