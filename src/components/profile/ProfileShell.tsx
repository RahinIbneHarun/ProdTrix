"use client";

import { Suspense } from "react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { FeedHeader } from "@/components/feed/header/FeedHeader";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";

/** Gives the profile pages the same top bar as the feed (back, logo, search, friends, bell, menu). */
export function ProfileShell({ children }: { children: React.ReactNode }) {
  // Loads your saved data so the bell and friends badges show real numbers.
  useFeedHydrated();
  const { resolvedTheme } = useTheme();

  return (
    <>
      <Suspense fallback={<div className="h-16 border-b border-border" />}>
        <FeedHeader />
      </Suspense>
      {children}
      {/* Posts on the profile are the same cards as in the feed, and their Save/Share messages need this. */}
      <Toaster
        position="bottom-center"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        richColors
        closeButton
      />
    </>
  );
}
