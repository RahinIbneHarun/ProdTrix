"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, UserMinus, X } from "lucide-react";
import { toast } from "sonner";
import { CreatorAvatar } from "@/components/feed/CreatorAvatar";
import { FeedIcon } from "@/components/feed/FeedIcon";
import { PageHeading } from "@/components/feed/PageHeading";
import { CREATORS, getCreator } from "@/data/feed-data";
import type { FeedCreator } from "@/interfaces/feed.interface";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";

type Tab = "requests" | "suggestions" | "sent" | "friends";

const EMPTY: Record<Tab, string> = {
  requests: "No pending friend requests.",
  suggestions: "No more suggestions right now.",
  sent: "You haven't sent any requests.",
  friends: "You haven't added any friends yet. Check Suggestions to find people.",
};

const toCreators = (ids: string[]) =>
  ids.map(getCreator).filter((c): c is FeedCreator => Boolean(c));

export default function FriendsPage() {
  const [tab, setTab] = useState<Tab>("requests");
  const [query, setQuery] = useState("");
  const friends = useFeedStore((s) => s.friends);
  const sent = useFeedStore((s) => s.sentRequests);
  const incoming = useFeedStore((s) => s.incomingRequests);
  const accept = useFeedStore((s) => s.acceptFriendRequest);
  const decline = useFeedStore((s) => s.declineFriendRequest);
  const send = useFeedStore((s) => s.sendFriendRequest);
  const cancel = useFeedStore((s) => s.cancelFriendRequest);
  const remove = useFeedStore((s) => s.removeFriend);

  const lists = useMemo<Record<Tab, FeedCreator[]>>(
    () => ({
      requests: toCreators(incoming),
      sent: toCreators(sent),
      friends: toCreators(friends),
      suggestions: CREATORS.filter(
        (c) => !friends.includes(c.id) && !incoming.includes(c.id) && !sent.includes(c.id),
      ),
    }),
    [friends, incoming, sent],
  );

  const q = query.trim().toLowerCase();
  const visible = lists[tab].filter(
    (c) => !q || `${c.name} ${c.handle} ${c.headline}`.toLowerCase().includes(q),
  );

  const tabs: { value: Tab; label: string }[] = [
    { value: "requests", label: "Requests" },
    { value: "suggestions", label: "Suggestions" },
    { value: "sent", label: "Sent" },
    { value: "friends", label: "Friends" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeading
        icon={<FeedIcon name="people" />}
        title="Friends"
        description="Manage friend requests and find people to connect with."
      />

      <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {t.value !== "suggestions" && lists[t.value].length > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                  t.value === "requests" ? "bg-destructive text-destructive-foreground" : "bg-foreground/10",
                )}
              >
                {lists[t.value].length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <FeedIcon
          name="magnifying-glass"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, @handle or topic"
          aria-label="Search people"
          className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {q ? "No one matches your search." : EMPTY[tab]}
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {visible.map((c) => (
            <li key={c.id} className="flex items-center gap-3 p-4">
              <Link href={`/feed/creator/${c.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <CreatorAvatar creator={c} size={48} />
                <span className="min-w-0">
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    <span className="truncate">{c.name}</span>
                    {c.verified && <FeedIcon name="approved" label="Verified" />}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">@{c.handle}</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.headline}</span>
                </span>
              </Link>

              <div className="flex shrink-0 items-center gap-2">
                {tab === "requests" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        accept(c.id);
                        toast.success(`You and ${c.name} are now friends`);
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/85"
                    >
                      <Check className="size-3.5" /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => decline(c.id)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
                    >
                      <X className="size-3.5" /> Decline
                    </button>
                  </>
                )}

                {tab === "suggestions" && (
                  <button
                    type="button"
                    onClick={() => {
                      send(c.id);
                      toast.success(`Friend request sent to ${c.name}`);
                    }}
                    className="h-8 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/85"
                  >
                    Add friend
                  </button>
                )}

                {tab === "sent" && (
                  <button
                    type="button"
                    onClick={() => cancel(c.id)}
                    className="h-8 rounded-full border border-border px-4 text-xs font-semibold text-muted-foreground hover:bg-muted"
                  >
                    Cancel request
                  </button>
                )}

                {tab === "friends" && (
                  <button
                    type="button"
                    onClick={() => {
                      remove(c.id);
                      toast(`Removed ${c.name} from your friends`, {
                        action: { label: "Undo", onClick: () => accept(c.id) },
                      });
                    }}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                  >
                    <UserMinus className="size-3.5" /> Unfriend
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
