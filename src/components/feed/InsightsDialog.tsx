"use client";

import { Clock, Eye, Sparkles, Users } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { FeedPost } from "@/interfaces/feed.interface";
import { formatDuration } from "@/lib/feed/utils";
import { useEffectiveInsights } from "@/store/feed-store";

export function InsightsDialog({
  post,
  open,
  onOpenChange,
}: {
  post: FeedPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const i = useEffectiveInsights(post);

  const stats = [
    {
      icon: Eye,
      label: "View count",
      value: i.viewCount.toLocaleString(),
      hint: "Times this post was opened",
    },
    {
      icon: Clock,
      label: "Cumulative duration",
      value: formatDuration(i.cumulativeSeconds),
      hint: "Total active reading / watch time",
    },
    {
      icon: Users,
      label: "Unique viewers",
      value: i.uniqueViewers.toLocaleString(),
      hint: "Distinct people reached",
    },
    {
      icon: Sparkles,
      label: "Value-add ratio",
      value: `${formatDuration(i.valueAdd)} / view`,
      hint: "Total watch time ÷ total views",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="center" className="p-0">
        <SheetHeader className="pb-2">
          <SheetTitle>Post insights</SheetTitle>
          <SheetDescription className="line-clamp-1">{post.title}</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 px-6 pb-4">
          {stats.map(({ icon: Icon, label, value, hint }) => (
            <div key={label} className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="size-3.5" /> {label}
              </p>
              <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight">{value}</p>
              <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>
        <p className="px-6 pb-6 text-[11px] leading-4 text-muted-foreground">
          Watch time only counts active sessions — the timer pauses after 60 seconds without
          interaction or when the tab is hidden.
        </p>
      </SheetContent>
    </Sheet>
  );
}
