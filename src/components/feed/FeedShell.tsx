"use client";

import { Suspense } from "react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { useFollowingStream } from "@/lib/feed/use-following-stream";
import { FeedHeader } from "./header/FeedHeader";
import { FollowingSidebar } from "./FollowingSidebar";

/** Layout for every /feed route: sticky universal header + desktop following sidebar. */
export function FeedShell({ children }: { children: React.ReactNode }) {
  useFeedHydrated();
  useFollowingStream();
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="h-16 border-b border-border" />}>
        <FeedHeader />
      </Suspense>
      <div className="mx-auto flex max-w-7xl">
        <Suspense fallback={null}>
          <FollowingSidebar />
        </Suspense>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
      <Toaster
        position="bottom-center"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        richColors
        closeButton
      />
    </div>
  );
}
