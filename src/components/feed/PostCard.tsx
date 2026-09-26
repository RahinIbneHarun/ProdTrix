"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, BarChart3, Bookmark, MousePointerClick, Share2 } from "lucide-react";
import { toast } from "sonner";
import { getCreator } from "@/data/feed-data";
import type { FeedPost } from "@/interfaces/feed.interface";
import { filtersToQuery, relativeTime } from "@/lib/feed/utils";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";
import { CreatorAvatar } from "./CreatorAvatar";
import { FollowButton } from "./FollowButton";
import { InsightsDialog } from "./InsightsDialog";
import { PostMenu } from "./PostMenu";
import { ReactionBar } from "./ReactionBar";
import { ShareDialog, sharePost } from "./ShareDialog";
import { VersionBadge } from "./VersionBadge";

export function PostCard({ post }: { post: FeedPost }) {
  const router = useRouter();
  const creator = getCreator(post.creatorId);
  const isSaved = useFeedStore((s) => Boolean(s.saved[post.id]));
  const toggleSaved = useFeedStore((s) => s.toggleSaved);
  const [shareOpen, setShareOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);

  if (!creator) return null;

  const contentHref = `/feed/content/${post.id}`;

  const onSave = () => {
    const nowSaved = toggleSaved(post.id);
    if (nowSaved) {
      toast.success("Post saved", {
        action: { label: "View", onClick: () => router.push("/feed/saved") },
      });
    } else {
      toast("Removed from Saved");
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
      {/* Creator header */}
      <header className="flex items-start gap-3 p-4 pb-2">
        <Link href={`/feed/creator/${creator.id}`} aria-label={`${creator.name}'s profile`}>
          <CreatorAvatar creator={creator} size={42} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <Link
              href={`/feed/creator/${creator.id}`}
              className="truncate text-sm font-semibold hover:underline"
            >
              {creator.name}
            </Link>
            {creator.verified && (
              <BadgeCheck className="size-4 shrink-0 fill-sky-500 text-white" aria-label="Verified" />
            )}
            <VersionBadge post={post} />
          </div>
          <p className="truncate text-xs text-muted-foreground">
            @{creator.handle} · <time suppressHydrationWarning dateTime={post.createdAt}>{relativeTime(post.createdAt)}</time>
          </p>
        </div>
        <FollowButton creatorId={creator.id} className="mt-1 shrink-0" />
        <PostMenu post={post} />
      </header>

      {/* Chapter • Topic taxonomy */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 text-xs">
        <Link
          href={`/feed${filtersToQuery({ chapter: post.chapter })}`}
          className="rounded-md bg-secondary/10 px-2 py-0.5 font-medium text-foreground ring-1 ring-inset ring-border hover:bg-muted"
        >
          [{post.chapter}]
        </Link>
        <span aria-hidden className="text-muted-foreground">•</span>
        <Link
          href={`/feed${filtersToQuery({ topic: post.topic })}`}
          className="rounded-md px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          ({post.topic})
        </Link>
      </div>

      <div className="px-4 pb-3 pt-2">
        <h2 className="text-[15px] font-semibold leading-snug">
          <Link href={contentHref} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
      </div>

      {/* Cover launcher */}
      <Link
        href={contentHref}
        className={cn(
          "group relative block overflow-hidden bg-muted",
          post.coverAspect === "4:3" ? "aspect-[4/3]" : "aspect-video",
        )}
        aria-label={`Open content: ${post.title}`}
      >
        <Image
          src={post.coverUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/35 group-focus-visible:bg-black/35">
          <span className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-neutral-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <MousePointerClick className="size-4" /> Open Content
          </span>
        </span>
      </Link>

      {/* Actions */}
      <div className="space-y-3 p-4">
        <ReactionBar post={post} />
        <div className="flex items-center gap-1 border-t border-border pt-3 text-sm">
          <ActionButton
            onClick={onSave}
            active={isSaved}
            label={isSaved ? "Saved" : "Save"}
            title={isSaved ? "Remove from Saved" : "Save for later"}
          >
            <Bookmark className={cn("size-4", isSaved && "fill-current")} />
          </ActionButton>
          <ActionButton
            onClick={() => sharePost(post, () => setShareOpen(true))}
            label="Share"
            title="Share post"
          >
            <Share2 className="size-4" />
          </ActionButton>
          <ActionButton
            onClick={() => setInsightsOpen(true)}
            label="Insights"
            title="View post insights"
            className="ml-auto"
          >
            <BarChart3 className="size-4" />
          </ActionButton>
        </div>
      </div>

      <ShareDialog post={post} open={shareOpen} onOpenChange={setShareOpen} />
      <InsightsDialog post={post} open={insightsOpen} onOpenChange={setInsightsOpen} />
    </article>
  );
}

function ActionButton({
  children,
  label,
  title,
  onClick,
  active,
  className,
}: {
  children: React.ReactNode;
  label: string;
  title: string;
  onClick: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg px-3 font-medium transition-colors",
        active
          ? "bg-foreground/10 text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {children}
      {label}
    </button>
  );
}
