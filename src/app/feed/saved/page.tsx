"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FeedIcon } from "@/components/feed/FeedIcon";
import { PageHeading } from "@/components/feed/PageHeading";
import { PostCard } from "@/components/feed/PostCard";
import { getCreator } from "@/data/feed-data";
import type { FeedPost } from "@/interfaces/feed.interface";
import { cn } from "@/lib/utils";
import { useAllPosts, useFeedStore } from "@/store/feed-store";

type Sort = "saved" | "newest" | "popular";

const SORTS: { value: Sort; label: string }[] = [
  { value: "saved", label: "Recently saved" },
  { value: "newest", label: "Newest posts" },
  { value: "popular", label: "Most reactions" },
];

const totalReactions = (p: FeedPost) => Object.values(p.reactions).reduce((a, b) => a + b, 0);

export default function SavedPage() {
  const saved = useFeedStore((s) => s.saved);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [sort, setSort] = useState<Sort>("saved");

  const allPosts = useAllPosts();
  const byId = useMemo(() => new Map(allPosts.map((p) => [p.id, p])), [allPosts]);

  // Every saved post, newest save first.
  const all = useMemo(
    () =>
      Object.entries(saved)
        .sort(([, a], [, b]) => b.localeCompare(a))
        .map(([id]) => byId.get(id))
        .filter((p): p is FeedPost => Boolean(p)),
    [saved, byId],
  );

  const subjects = useMemo(() => Array.from(new Set(all.map((p) => p.subject))).sort(), [all]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = all.filter((p) => {
      if (subject && p.subject !== subject) return false;
      if (!q) return true;
      const creator = getCreator(p.creatorId)?.name ?? "";
      return [p.title, p.excerpt, p.subject, p.chapter, p.topic, creator].join(" ").toLowerCase().includes(q);
    });
    if (sort === "newest") return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "popular") return [...list].sort((a, b) => totalReactions(b) - totalReactions(a));
    return list; // already ordered by save time
  }, [all, query, subject, sort]);

  const clearAll = () => {
    const previous = useFeedStore.getState().saved;
    useFeedStore.setState({ saved: {} });
    setSubject("");
    toast(`Removed ${all.length} saved post${all.length === 1 ? "" : "s"}`, {
      action: { label: "Undo", onClick: () => useFeedStore.setState({ saved: previous }) },
    });
  };

  return (
    <div className="mx-auto max-w-[52rem] space-y-4">
      <div className="flex items-start justify-between gap-3">
        <PageHeading
          icon={<FeedIcon name="packaging" />}
          title="Saved"
          description={`${all.length} saved post${all.length === 1 ? "" : "s"}`}
        />
        {all.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="size-3.5" /> Clear all
          </button>
        )}
      </div>

      {all.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-semibold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap <span className="font-medium text-foreground">Save</span> on any post to keep it here.
          </p>
          <Link
            href="/feed"
            className="mt-4 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Browse the feed
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <FeedIcon
                name="magnifying-glass"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your saved posts"
                aria-label="Search saved posts"
                className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort saved posts"
              className="h-10 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {subjects.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {["", ...subjects].map((s) => (
                <button
                  key={s || "all"}
                  type="button"
                  aria-pressed={subject === s}
                  onClick={() => setSubject(s)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    subject === s
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {s || "All"}
                </button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No saved posts match your search.
            </p>
          ) : (
            visible.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </>
      )}
    </div>
  );
}
