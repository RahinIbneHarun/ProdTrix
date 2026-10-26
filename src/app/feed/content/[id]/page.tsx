"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Pause, Play } from "lucide-react";
import { FeedIcon } from "@/components/feed/FeedIcon";
import { CommentsSection } from "@/components/feed/CommentsSection";
import { CreatorAvatar } from "@/components/feed/CreatorAvatar";
import { FollowButton } from "@/components/feed/FollowButton";
import { InsightsDialog } from "@/components/feed/InsightsDialog";
import { ReactionBar } from "@/components/feed/ReactionBar";
import { ShareDialog, sharePost } from "@/components/feed/ShareDialog";
import { VersionBadge } from "@/components/feed/VersionBadge";
import { CURRENT_USER_ID, creatorHref, getCreator } from "@/data/feed-data";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { useWatchTimer } from "@/lib/feed/use-watch-timer";
import { filtersToQuery, formatDuration } from "@/lib/feed/utils";
import { cn } from "@/lib/utils";
import { useAllPosts } from "@/store/feed-store";
import { PostAttachments } from "@/components/profile/PostAttachments";

export default function ContentPage() {
  const { id } = useParams<{ id: string }>();
  const hydrated = useFeedHydrated();
  const post = useAllPosts().find((p) => p.id === id);
  const creator = post && getCreator(post.creatorId);
  const isMine = post?.creatorId === CURRENT_USER_ID;
  const { activeSeconds, paused } = useWatchTimer(post?.id);
  const [shareOpen, setShareOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [simValue, setSimValue] = useState(50);

  if (!post || !creator) {
    // Your own posts load from the browser a moment after the page, so wait before saying "not found".
    if (!hydrated) {
      return <div className="mx-auto h-64 max-w-2xl animate-pulse rounded-2xl bg-muted/40" aria-busy="true" />;
    }
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border p-12 text-center">
        <h1 className="font-semibold">Content not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">It may have been removed by the creator.</p>
        <Link href="/feed" className="mt-4 inline-block text-sm font-medium underline">
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Link href={`/feed${filtersToQuery({ subject: post.subject })}`} className="text-muted-foreground hover:underline">
          {post.subject}
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/feed${filtersToQuery({ chapter: post.chapter })}`} className="font-medium hover:underline">
          [{post.chapter}]
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href={`/feed${filtersToQuery({ topic: post.topic })}`} className="text-muted-foreground hover:underline">
          ({post.topic})
        </Link>
        <VersionBadge post={post} />
      </div>

      <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{post.title}</h1>

      <div className="flex items-center gap-3">
        <Link href={creatorHref(creator.id)}>
          <CreatorAvatar creator={creator} size={40} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={creatorHref(creator.id)} className="flex items-center gap-1 text-sm font-semibold hover:underline">
            {creator.name}
            {creator.verified && <FeedIcon name="approved" label="Verified" />}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{creator.headline}</p>
        </div>
        {!isMine && <FollowButton creatorId={creator.id} />}
      </div>

      {/* Interactive simulation stage (sample posts) / cover image (your own posts) */}
      {post.coverUrl && (
      <section
        aria-label={isMine ? "Cover image" : "Interactive simulation"}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border bg-muted",
          post.coverAspect === "4:3" ? "aspect-[4/3]" : "aspect-video",
        )}
      >
        <Image src={post.coverUrl} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        {!isMine && (
        <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/65 p-3 text-white backdrop-blur">
          <label htmlFor="sim" className="flex items-center justify-between text-xs font-medium">
            <span>Simulation parameter</span>
            <span className="tabular-nums">{simValue}</span>
          </label>
          <input
            id="sim"
            type="range"
            min={0}
            max={100}
            value={simValue}
            onChange={(e) => setSimValue(Number(e.target.value))}
            className="mt-2 w-full accent-white"
          />
        </div>
        )}
      </section>
      )}

      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
          paused ? "border-amber-500/40 text-amber-700 dark:text-amber-300" : "border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
        )}
        role="status"
        title="Active reading time counted toward this post's insights"
      >
        {paused ? <Pause className="size-3" /> : <Play className="size-3" />}
        {paused ? "Timer paused — inactive" : "Reading"} · {formatDuration(activeSeconds)}
      </div>

      <div className="prose prose-sm max-w-none text-foreground dark:prose-invert sm:prose-base">
        {!isMine && <p className="lead text-muted-foreground">{post.excerpt}</p>}
        {post.body && <p className="whitespace-pre-wrap">{post.body}</p>}
      </div>

      {post.attachments && post.attachments.length > 0 && <PostAttachments attachments={post.attachments} />}

      <div className="space-y-3 border-t border-border pt-4">
        <ReactionBar post={post} />
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => sharePost(post, () => setShareOpen(true))}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <FeedIcon name="share" /> Share
          </button>
          <button
            type="button"
            onClick={() => setInsightsOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <FeedIcon name="insights-2" className="size-5" /> Insights
          </button>
        </div>
      </div>

      <section aria-labelledby="comments-heading" className="space-y-3 border-t border-border pt-4">
        <h2 id="comments-heading" className="text-sm font-semibold">
          Comments
        </h2>
        <CommentsSection postId={post.id} postTitle={post.title} previewCount={5} />
      </section>

      <ShareDialog post={post} open={shareOpen} onOpenChange={setShareOpen} />
      <InsightsDialog post={post} open={insightsOpen} onOpenChange={setInsightsOpen} />
    </article>
  );
}
