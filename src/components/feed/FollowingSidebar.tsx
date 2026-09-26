"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Bookmark, Home, Radio } from "lucide-react";
import { getCreator } from "@/data/feed-data";
import type { FeedCreator } from "@/interfaces/feed.interface";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";
import { CreatorAvatar } from "./CreatorAvatar";

/** Desktop-only (≥1024px) list of followed creators with live "[X] new posts" pills. */
export function FollowingSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const activeCreator = params.get("creator");
  const following = useFeedStore((s) => s.following);
  const counts = useFeedStore((s) => s.newPostCounts);
  const clearNewPosts = useFeedStore((s) => s.clearNewPosts);
  const savedCount = useFeedStore((s) => Object.keys(s.saved).length);

  const creators = following
    .map(getCreator)
    .filter((c): c is FeedCreator => Boolean(c))
    .sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0));

  const open = (id: string) => {
    clearNewPosts(id);
    router.push(`/feed?creator=${encodeURIComponent(id)}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-border py-5 pl-4 pr-3 lg:block">
      <nav className="space-y-0.5">
        <SideLink href="/feed" active={!params.toString()} icon={<Home className="size-[18px]" />}>
          Newsfeed
        </SideLink>
        <SideLink href="/feed/saved" icon={<Bookmark className="size-[18px]" />} meta={savedCount || undefined}>
          Saved
        </SideLink>
      </nav>

      <div className="mb-2 mt-6 flex items-center justify-between px-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Following</p>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400" title="Live updates">
          <Radio className="size-3" /> Live
        </span>
      </div>

      {creators.length === 0 ? (
        <p className="px-2 text-sm text-muted-foreground">
          Follow creators from the feed to see their new uploads here.
        </p>
      ) : (
        <ul className="space-y-0.5">
          {creators.map((c) => {
            const n = counts[c.id] ?? 0;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => open(c.id)}
                  aria-current={activeCreator === c.id ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted",
                    activeCreator === c.id && "bg-muted",
                  )}
                >
                  <span className="relative">
                    <CreatorAvatar creator={c} size={36} />
                    {n > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-sky-500 ring-2 ring-background" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 truncate text-sm font-medium">
                      <span className="truncate">{c.name}</span>
                      {c.verified && <BadgeCheck className="size-3.5 shrink-0 fill-sky-500 text-white" />}
                    </span>
                    {n > 0 ? (
                      <span className="mt-0.5 inline-flex rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                        {n} new post{n > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="block truncate text-xs text-muted-foreground">Up to date</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

function SideLink({
  href,
  icon,
  active,
  meta,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  meta?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-muted",
        active && "bg-muted",
      )}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">{children}</span>
      {meta !== undefined && (
        <span className="rounded-full bg-muted px-2 text-[11px] font-semibold text-muted-foreground">{meta}</span>
      )}
    </Link>
  );
}
