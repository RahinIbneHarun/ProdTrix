"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Search, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CREATORS, SUGGESTED_FRIENDS, getCreator } from "@/data/feed-data";
import type { FeedCreator } from "@/interfaces/feed.interface";
import { useFeedStore } from "@/store/feed-store";
import { CreatorAvatar } from "../CreatorAvatar";
import { HeaderIconButton } from "./HeaderIconButton";

export function FriendAddMenu() {
  const [query, setQuery] = useState("");
  const friends = useFeedStore((s) => s.friends);
  const sent = useFeedStore((s) => s.sentRequests);
  const incoming = useFeedStore((s) => s.incomingRequests);
  const { sendFriendRequest, cancelFriendRequest, acceptFriendRequest, declineFriendRequest } =
    useFeedStore.getState();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? CREATORS.filter((c) => `${c.name} ${c.handle}`.toLowerCase().includes(q))
      : SUGGESTED_FRIENDS.map(getCreator).filter((c): c is FeedCreator => Boolean(c));
    return pool.filter((c) => !friends.includes(c.id) && !incoming.includes(c.id));
  }, [query, friends, incoming]);

  const requests = incoming.map(getCreator).filter((c): c is FeedCreator => Boolean(c));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <HeaderIconButton label="Add friend / connect" badge={incoming.length}>
          <UserPlus />
        </HeaderIconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-24px))] p-0">
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find people by name or @handle"
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {requests.length > 0 && !query && (
            <Section title="Friend requests">
              {requests.map((c) => (
                <PersonRow key={c.id} creator={c}>
                  <button
                    type="button"
                    aria-label={`Accept ${c.name}`}
                    onClick={() => {
                      acceptFriendRequest(c.id);
                      toast.success(`You and ${c.name} are now connected`);
                    }}
                    className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Decline ${c.name}`}
                    onClick={() => declineFriendRequest(c.id)}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-4" />
                  </button>
                </PersonRow>
              ))}
            </Section>
          )}

          <Section title={query ? "Results" : "People you may know"}>
            {results.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">No one found.</p>
            )}
            {results.map((c) => {
              const pending = sent.includes(c.id);
              return (
                <PersonRow key={c.id} creator={c}>
                  <button
                    type="button"
                    onClick={() => {
                      if (pending) cancelFriendRequest(c.id);
                      else {
                        sendFriendRequest(c.id);
                        toast.success(`Connection request sent to ${c.name}`);
                      }
                    }}
                    className={
                      pending
                        ? "h-8 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-muted"
                        : "h-8 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/85"
                    }
                  >
                    {pending ? "Requested" : "Connect"}
                  </button>
                </PersonRow>
              );
            })}
          </Section>

          {friends.length > 0 && !query && (
            <Section title={`Friends (${friends.length})`}>
              {friends.map(getCreator).map(
                (c) => c && <PersonRow key={c.id} creator={c} />,
              )}
            </Section>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function PersonRow({ creator, children }: { creator: FeedCreator; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2">
      <Link href={`/feed/creator/${creator.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <CreatorAvatar creator={creator} size={36} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{creator.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{creator.headline}</span>
        </span>
      </Link>
      <div className="flex shrink-0 gap-1.5">{children}</div>
    </div>
  );
}
