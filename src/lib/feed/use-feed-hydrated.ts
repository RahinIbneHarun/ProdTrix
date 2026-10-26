"use client";

import { useEffect, useState } from "react";
import { FEED_STORAGE_KEY, useFeedStore } from "@/store/feed-store";

let rehydrateStarted = false;
let syncStarted = false;

/**
 * Keeps several open tabs in step. Without this a tab that has been open for a while would, on its
 * next save, write its older copy of the data over a newer post or reaction made in another tab.
 */
function startCrossTabSync() {
  if (syncStarted) return;
  syncStarted = true;
  window.addEventListener("storage", (e) => {
    // Only fires for changes made by *other* tabs, so this can't loop.
    if (e.key === FEED_STORAGE_KEY && e.newValue) void useFeedStore.persist.rehydrate();
  });
}

/** Rehydrates the persisted feed store on the client and reports when it's ready. */
export function useFeedHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    startCrossTabSync();
    if (useFeedStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useFeedStore.persist.onFinishHydration(() => setHydrated(true));
    if (!rehydrateStarted) {
      rehydrateStarted = true;
      void useFeedStore.persist.rehydrate();
    }
    return unsub;
  }, []);

  return hydrated;
}
