"use client";

import Link from "next/link";
import { getCreator } from "@/data/feed-data";
import { cn } from "@/lib/utils";
import { CreatorAvatar } from "./CreatorAvatar";
import { SidebarPanel } from "./SidebarPanel";

const FOLLOWING = [
  "c-ayasha-malik",
  "c-lucas-fernandes",
  "c-meera-krishnan",
  "c-priya-nair",
  "c-jinho-yoon",
  "c-tomas-rivera",
  "c-sofia-ahmed",
  "c-daniel-park",
];

const TOP_CREATORS: { id: string; count: number }[] = [
  { id: "c-ayasha-malik", count: 24 },
  { id: "c-jinho-yoon", count: 19 },
  { id: "c-tomas-rivera", count: 17 },
  { id: "c-meera-krishnan", count: 14 },
  { id: "c-lucas-fernandes", count: 11 },
  { id: "c-sofia-ahmed", count: 9 },
];

const rowCls =
  "-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted";

/** Wide-desktop (≥1280px) right rail: Following and Top Creators cards. */
export function RightSidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 space-y-4 overflow-y-auto py-6 xl:block">
      <SidebarPanel title="Following">
        <ul className="text-sm">
          {FOLLOWING.map((id) => (
            <li key={id}>
              <FollowingRow id={id} />
            </li>
          ))}
        </ul>
      </SidebarPanel>

      <SidebarPanel title="Top creators">
        <ul className="text-sm">
          {TOP_CREATORS.map(({ id, count }) => (
            <li key={id}>
              <Link href={`/feed/creator/${id}`} className={rowCls}>
                <span className="truncate">{getCreator(id)?.name}</span>
                <span className="shrink-0 text-muted-foreground tabular-nums">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </SidebarPanel>
    </aside>
  );
}

function FollowingRow({ id }: { id: string }) {
  const creator = getCreator(id);
  if (!creator) return null;
  return (
    <Link href={`/feed/creator/${id}`} className={cn(rowCls, "justify-start")}>
      <CreatorAvatar creator={creator} size={28} />
      <span className="truncate">{creator.name}</span>
    </Link>
  );
}
