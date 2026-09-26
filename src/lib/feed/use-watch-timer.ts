"use client";

import { useEffect, useRef, useState } from "react";
import { useFeedStore } from "@/store/feed-store";
import { useFeedHydrated } from "./use-feed-hydrated";

/** Viewport dwelling with no interaction for longer than this pauses the timer. */
export const INACTIVITY_LIMIT_MS = 60_000;
const TICK_MS = 1_000;
const FLUSH_EVERY_S = 5;

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"] as const;

/**
 * Records one view for `postId` and accumulates *active* reading seconds.
 * The timer pauses when the tab is hidden or the user has been idle for
 * more than 60s, so time left on screen doesn't inflate the Value-Add score.
 */
export function useWatchTimer(postId: string | undefined) {
  // Wait for the persisted store so recorded views aren't overwritten by rehydration.
  const hydrated = useFeedHydrated();
  if (!hydrated) postId = undefined;
  const recordView = useFeedStore((s) => s.recordView);
  const addWatchSeconds = useFeedStore((s) => s.addWatchSeconds);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const lastActivity = useRef(Date.now());
  const pending = useRef(0);
  const recordedFor = useRef<string | null>(null);

  useEffect(() => {
    // Guard against React strict-mode double effects counting two views.
    if (!postId || recordedFor.current === postId) return;
    recordedFor.current = postId;
    recordView(postId);
  }, [postId, recordView]);

  useEffect(() => {
    if (!postId) return;

    const markActive = () => {
      lastActivity.current = Date.now();
    };
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, markActive, { passive: true }));
    document.addEventListener("visibilitychange", markActive);

    const flush = () => {
      if (pending.current > 0) {
        addWatchSeconds(postId, pending.current);
        pending.current = 0;
      }
    };

    const interval = window.setInterval(() => {
      const idle = Date.now() - lastActivity.current > INACTIVITY_LIMIT_MS;
      const inactive = document.visibilityState !== "visible" || idle;
      setPaused(inactive);
      if (inactive) return;
      pending.current += TICK_MS / 1000;
      setActiveSeconds((s) => s + TICK_MS / 1000);
      if (pending.current >= FLUSH_EVERY_S) flush();
    }, TICK_MS);

    return () => {
      window.clearInterval(interval);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, markActive));
      document.removeEventListener("visibilitychange", markActive);
      flush();
    };
  }, [postId, addWatchSeconds]);

  return { activeSeconds, paused };
}
