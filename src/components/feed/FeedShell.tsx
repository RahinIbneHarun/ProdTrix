"use client";

import { Suspense } from "react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { useFollowingStream } from "@/lib/feed/use-following-stream";
import { FeedHeader } from "./header/FeedHeader";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";

/** Layout for every /feed route: sticky universal header, left and right side rails. */
export function FeedShell({ children }: { children: React.ReactNode }) {
  useFeedHydrated();
  useFollowingStream();
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Suspense fallback={<div className="h-16 border-b border-border" />}>
        <FeedHeader />
      </Suspense>
      {/* Spacers share leftover width equally, so edge gaps and gaps beside the feed match. */}
      <div className="lg:flex">
        <Gap className="lg:block" />
        <LeftSidebar />
        <Gap className="lg:block" />
        <main className="min-w-0 px-4 py-6 sm:px-6 lg:flex-[0_1_52rem] lg:px-0">{children}</main>
        <Gap className="lg:block" />
        <RightSidebar />
        <Gap className="xl:block" />
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

function Gap({ className }: { className: string }) {
  return <div aria-hidden className={`hidden min-w-6 flex-1 ${className}`} />;
}
