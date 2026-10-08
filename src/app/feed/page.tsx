"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { CreatorAvatar } from "@/components/feed/CreatorAvatar";
import { FollowButton } from "@/components/feed/FollowButton";
import { PostCard } from "@/components/feed/PostCard";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { FEED_POSTS, getCreator } from "@/data/feed-data";
import type { FeedFilters } from "@/interfaces/feed.interface";
import { filtersFromParams, filtersToQuery, matchesFilters, rankPosts } from "@/lib/feed/utils";
import { useFeedStore } from "@/store/feed-store";

const PAGE_SIZE = 3;

export default function FeedPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FeedSkeleton />}>
        <Newsfeed />
      </Suspense>
    </ErrorBoundary>
  );
}

function Newsfeed() {
  const params = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);
  const hidden = useFeedStore((s) => s.hidden);
  const topicAffinity = useFeedStore((s) => s.topicAffinity);
  const creatorAffinity = useFeedStore((s) => s.creatorAffinity);

  const posts = useMemo(() => {
    const visible = FEED_POSTS.filter(
      (p) =>
        !hidden.includes(p.id) &&
        matchesFilters(p, filters, getCreator(p.creatorId)?.name),
    );
    return rankPosts(visible, topicAffinity, creatorAffinity);
  }, [filters, hidden, topicAffinity, creatorAffinity]);

  // Infinite scroll: reveal the next page when the sentinel comes into view.
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const hasMore = limit < posts.length;

  useEffect(() => setLimit(PAGE_SIZE), [params]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loadingMore) return;
        setLoadingMore(true);
        // Stand-in for a paginated fetch.
        setTimeout(() => {
          setLimit((l) => l + PAGE_SIZE);
          setLoadingMore(false);
        }, 400);
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadingMore]);

  const creator = filters.creator ? getCreator(filters.creator) : undefined;

  return (
    <div className="mx-auto max-w-[52rem] space-y-4">
      {creator && (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <CreatorAvatar creator={creator} size={48} />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Recent uploads from</p>
            <Link href={`/feed/creator/${creator.id}`} className="font-semibold hover:underline">
              {creator.name}
            </Link>
          </div>
          <FollowButton creatorId={creator.id} />
        </div>
      )}

      <ActiveFilters filters={filters} />

      {posts.slice(0, limit).map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <h3 className="font-semibold">Nothing matches these filters</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try a broader search or clear some filters.</p>
          <Link href="/feed" className="mt-4 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Clear all
          </Link>
        </div>
      )}

      <div ref={sentinel} className="flex justify-center py-6">
        {hasMore ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Loading more" />
        ) : (
          posts.length > 0 && <p className="text-xs text-muted-foreground">You're all caught up ✨</p>
        )}
      </div>
    </div>
  );
}

const FILTER_LABELS: Partial<Record<keyof FeedFilters, string>> = {
  q: "Search",
  category: "Category",
  subject: "Subject",
  chapter: "Chapter",
  topic: "Topic",
  version: "Version",
  from: "From",
  to: "To",
};

function ActiveFilters({ filters }: { filters: FeedFilters }) {
  const router = useRouter();
  const entries = (Object.keys(FILTER_LABELS) as (keyof FeedFilters)[]).filter((k) => filters[k]);
  if (!entries.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {entries.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => router.push(`/feed${filtersToQuery({ ...filters, [k]: "" })}`)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs"
        >
          <span className="text-muted-foreground">{FILTER_LABELS[k]}:</span>
          <span className="font-medium">
            {k === "version" ? `v${filters[k]}` : k === "category" ? filters[k].replace("-", " ") : filters[k]}
          </span>
          <X className="size-3" aria-label={`Remove ${FILTER_LABELS[k]} filter`} />
        </button>
      ))}
      <Link href="/feed" className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline">
        Clear all
      </Link>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="mx-auto max-w-[52rem] space-y-4">
      {[0, 1].map((i) => (
        <div key={i} className="h-[520px] animate-pulse rounded-2xl border border-border bg-muted/40" />
      ))}
    </div>
  );
}
