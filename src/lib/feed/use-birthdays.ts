"use client";

import { useEffect, useMemo, useState } from "react";
import { getCreator } from "@/data/feed-data";
import type { FeedCreator } from "@/interfaces/feed.interface";
import { useFeedStore } from "@/store/feed-store";

export interface UpcomingBirthday {
  creator: FeedCreator;
  daysAway: number;
}

/** Birthdays of friends and followed creators in the next `withinDays` days (0 = today). */
export function useUpcomingBirthdays(withinDays = 30): UpcomingBirthday[] {
  const following = useFeedStore((s) => s.following);
  const friends = useFeedStore((s) => s.friends);
  const enabled = useFeedStore((s) => s.birthdayReminders);
  // Resolved after mount so the server render doesn't depend on the clock.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => setToday(new Date()), []);

  return useMemo(() => {
    if (!today || !enabled) return [];
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Array.from(new Set([...friends, ...following]))
      .map(getCreator)
      .filter((c): c is FeedCreator => Boolean(c?.birthday))
      .map((creator) => {
        const [m, d] = creator.birthday!.split("-").map(Number);
        let next = new Date(start.getFullYear(), m - 1, d);
        if (next < start) next = new Date(start.getFullYear() + 1, m - 1, d);
        return { creator, daysAway: Math.round((next.getTime() - start.getTime()) / 86_400_000) };
      })
      .filter((b) => b.daysAway <= withinDays)
      .sort((a, b) => a.daysAway - b.daysAway);
  }, [today, enabled, friends, following, withinDays]);
}

export function useTodaysBirthdays() {
  return useUpcomingBirthdays(0);
}
