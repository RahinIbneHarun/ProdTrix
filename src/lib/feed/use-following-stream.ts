"use client";

import { useEffect } from "react";
import { useFeedStore } from "@/store/feed-store";
import { useFeedHydrated } from "./use-feed-hydrated";

const STREAM_URL = "/backend-api/feed/stream";
const DEMO_INTERVAL_MS = 45_000;

interface NewPostEvent {
  creatorId: string;
  postId?: string;
  title?: string;
}

/**
 * Subscribes to the server-sent event channel that announces new uploads by
 * followed creators and bumps their "[X] new posts" pill without reloading the
 * feed. When the backend stream is unreachable in development, a lightweight
 * simulator stands in so the sidebar behaviour can still be exercised.
 */
export function useFollowingStream() {
  const hydrated = useFeedHydrated();

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;

    const handle = ({ creatorId, postId, title }: NewPostEvent) => {
      const { following, incrementNewPosts, pushNotification } = useFeedStore.getState();
      if (!following.includes(creatorId)) return;
      incrementNewPosts(creatorId);
      pushNotification({
        id: `n-live-${Date.now()}`,
        kind: "new-content",
        actorId: creatorId,
        postId,
        message: title ? `published “${title}”` : "uploaded new content",
        createdAt: new Date().toISOString(),
        read: false,
      });
    };

    let demoTimer: number | undefined;
    const startDemo = () => {
      if (process.env.NODE_ENV === "production" || demoTimer) return;
      demoTimer = window.setInterval(() => {
        const { following } = useFeedStore.getState();
        if (!following.length) return;
        handle({ creatorId: following[Math.floor(Math.random() * following.length)] });
      }, DEMO_INTERVAL_MS);
    };

    let opened = false;
    let source: EventSource | undefined;
    try {
      source = new EventSource(STREAM_URL, { withCredentials: true });
      source.onopen = () => {
        opened = true;
      };
      source.addEventListener("new-post", (e) => {
        try {
          handle(JSON.parse((e as MessageEvent).data));
        } catch {
          /* ignore malformed payloads */
        }
      });
      source.onerror = () => {
        // Never connected: backend has no stream, fall back. Otherwise let
        // EventSource auto-reconnect.
        if (!opened) {
          source?.close();
          startDemo();
        }
      };
    } catch {
      startDemo();
    }

    return () => {
      source?.close();
      if (demoTimer) window.clearInterval(demoTimer);
    };
  }, [hydrated]);
}
