"use client";

import Link from "next/link";
import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { formatDuration } from "@/lib/feed/utils";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { PROFILE } from "@/lib/profile/profile-data";
import { useFeedStore } from "@/store/feed-store";

export default function ProfileDashboardPage() {
  const hydrated = useFeedHydrated();
  const myPosts = useFeedStore((s) => s.myPosts.length);
  const saved = useFeedStore((s) => Object.keys(s.saved).length);
  const following = useFeedStore((s) => s.following.length);
  const friends = useFeedStore((s) => s.friends.length);
  const pending = useFeedStore((s) => s.incomingRequests.length);
  const reactions = useFeedStore((s) => Object.keys(s.myReactions).length);
  const comments = useFeedStore((s) => s.myComments.length);
  const viewed = useFeedStore((s) => s.viewedPosts.length);
  const readingSeconds = useFeedStore((s) =>
    Object.values(s.insightsDelta).reduce((sum, d) => sum + d.seconds, 0),
  );

  const stats: { label: string; value: string | number; href?: string }[] = [
    { label: "My posts", value: myPosts, href: "/admin/profile/add-post" },
    { label: "Saved posts", value: saved, href: "/feed/saved" },
    { label: "Following", value: following },
    { label: "Friends", value: friends, href: "/feed/friends" },
    { label: "Pending requests", value: pending, href: "/feed/friends" },
    { label: "Reactions given", value: reactions },
    { label: "Comments written", value: comments },
    { label: "Posts read", value: viewed },
    { label: "Reading time", value: formatDuration(readingSeconds) },
    { label: "Profile completion", value: `${PROFILE.completion}%` },
  ];

  return (
    <ProfilePageShell title="Dashboard" description="Your activity at a glance.">
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        aria-busy={!hydrated}
      >
        {stats.map(({ label, value, href }) => {
          const card = (
            <div className="theme-card h-full space-y-1 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
              <p className="theme-label">{label}</p>
              <p className="text-2xl font-semibold tabular-nums text-black dark:text-white">
                {hydrated ? value : "–"}
              </p>
            </div>
          );
          return href ? (
            <Link key={label} href={href} className="block">
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </div>
    </ProfilePageShell>
  );
}
