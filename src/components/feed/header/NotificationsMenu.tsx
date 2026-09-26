"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Megaphone } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCreator } from "@/data/feed-data";
import type { NotificationKind } from "@/interfaces/feed.interface";
import { relativeTime } from "@/lib/feed/utils";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";
import { CreatorAvatar } from "../CreatorAvatar";
import { HeaderIconButton } from "./HeaderIconButton";

const TABS: { value: NotificationKind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new-content", label: "New content" },
  { value: "reply", label: "Replies" },
  { value: "reaction", label: "Reactions" },
  { value: "system", label: "System" },
];

export function NotificationsMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<NotificationKind | "all">("all");
  const notifications = useFeedStore((s) => s.notifications);
  const markAll = useFeedStore((s) => s.markAllNotificationsRead);
  const markRead = useFeedStore((s) => s.markNotificationRead);

  const unread = notifications.filter((n) => !n.read).length;
  const visible = useMemo(
    () => (tab === "all" ? notifications : notifications.filter((n) => n.kind === tab)),
    [notifications, tab],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <HeaderIconButton
          label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          badge={unread}
        >
          <Bell />
        </HeaderIconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(24rem,calc(100vw-24px))] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button
            type="button"
            onClick={markAll}
            disabled={!unread}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <CheckCheck className="size-3.5" /> Mark all read
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                tab === t.value ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <ul className="max-h-[60vh] overflow-y-auto py-1">
          {visible.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">You're all caught up.</li>
          )}
          {visible.map((n) => {
            const actor = n.actorId ? getCreator(n.actorId) : undefined;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    markRead(n.id);
                    setOpen(false);
                    if (n.postId) router.push(`/feed/content/${n.postId}`);
                    else if (n.kind === "system") router.push("/feed/verify");
                    else if (n.actorId) router.push(`/feed/creator/${n.actorId}`);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted",
                    !n.read && "bg-muted/50",
                  )}
                >
                  {actor ? (
                    <CreatorAvatar creator={actor} size={36} />
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Megaphone className="size-4" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1 text-sm leading-5">
                    {actor && <span className="font-semibold">{actor.name} </span>}
                    <span className="text-foreground/85">{n.message}</span>
                    <span suppressHydrationWarning className="mt-0.5 block text-xs text-muted-foreground">
                      {relativeTime(n.createdAt)}
                    </span>
                  </span>
                  {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-sky-500" aria-label="Unread" />}
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
