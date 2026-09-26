"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { FeedPost } from "@/interfaces/feed.interface";
import { currentVersion } from "@/lib/feed/utils";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

/** `v2`-style badge; hover (desktop) or tap (touch) shows the changelog. */
export function VersionBadge({ post }: { post: FeedPost }) {
  const [open, setOpen] = useState(false);
  const current = currentVersion(post);
  const history = [...post.versions].reverse();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="inline-flex h-5 items-center rounded-md border border-border bg-muted px-1.5 font-mono text-[11px] font-semibold text-foreground"
          aria-label={`Version ${current.version}, show changelog`}
        >
          v{current.version}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <p className="flex items-center gap-1.5 text-xs font-semibold">
          <History className="size-3.5" /> Changelog
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Last edited {fmt(current.editedAt)}
        </p>
        <ol className="mt-2 space-y-2 border-l border-border pl-3">
          {history.map((v) => (
            <li key={v.version} className="text-xs">
              <span className="font-mono font-semibold">v{v.version}</span>{" "}
              <span className="text-muted-foreground">· {fmt(v.editedAt)}</span>
              <p className="text-foreground/90">{v.note}</p>
            </li>
          ))}
        </ol>
      </PopoverContent>
    </Popover>
  );
}
