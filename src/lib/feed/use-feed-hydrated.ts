"use client";

import { useEffect, useState } from "react";
import { useFeedStore } from "@/store/feed-store";

let rehydrateStarted = false;

/** Rehydrates the persisted feed store on the client and reports when it's ready. */
export function useFeedHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
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
