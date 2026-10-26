"use client";

import { usePathname } from "next/navigation";
import { useFeedStore } from "@/store/feed-store";
import { FeedIcon } from "../FeedIcon";
import { HeaderIconLink } from "./HeaderIconButton";

/** Header friends icon: goes straight to the Friends page; badge counts pending requests. */
export function FriendsLink() {
  const pathname = usePathname();
  const pending = useFeedStore((s) => s.incomingRequests.length);

  return (
    <HeaderIconLink
      href="/feed/friends"
      label={pending ? `Friends, ${pending} pending request${pending > 1 ? "s" : ""}` : "Friends"}
      badge={pending}
      active={pathname === "/feed/friends"}
    >
      <FeedIcon name="people" className="size-5" />
    </HeaderIconLink>
  );
}
