"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { PostCard } from "@/components/feed/PostCard";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { profilePostToFeedPost } from "@/lib/feed/my-posts";
import { useFeedStore } from "@/store/feed-store";

const SHOWN = 5;

/**
 * The "Posts" card on the profile page, styled like Course and Notes. Each post is the same card
 * you see in the feed. Adding a post is done with the "Add Post" button above.
 */
export function ProfilePosts() {
  const hydrated = useFeedHydrated();
  const posts = useFeedStore((s) => s.myPosts);
  const shown = useMemo(() => posts.slice(0, SHOWN).map(profilePostToFeedPost), [posts]);
  const more = posts.length - shown.length;

  return (
    <section aria-labelledby="profile-posts" className="theme-card flex h-full w-full flex-col gap-3 p-5">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 dark:border-white/10">
        <SquarePen className="h-4 w-4 text-pink-500 dark:text-pink-400" />
        <h3 id="profile-posts" className="text-sm font-semibold text-black dark:text-white">
          Posts{hydrated && posts.length > 0 && (
            <span className="ml-1.5 font-normal text-black/50 dark:text-white/40">({posts.length})</span>
          )}
        </h3>
      </div>

      {!hydrated ? (
        <div className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" aria-hidden />
      ) : posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-black/60 dark:border-white/15 dark:text-white/40">
          You haven’t posted anything yet. Use the <span className="font-medium">Add Post</span> button above to share your first one.
        </p>
      ) : (
        <div className="space-y-4">
          {shown.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {more > 0 && (
            <Link
              href="/admin/profile/add-post"
              className="block text-center text-xs font-medium text-black/60 hover:underline dark:text-white/50"
            >
              See all {posts.length} posts
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
