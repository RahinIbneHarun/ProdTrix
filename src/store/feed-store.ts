"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  INCOMING_REQUESTS,
  INITIAL_FOLLOWING,
  INITIAL_NEW_POST_COUNTS,
  INITIAL_NOTIFICATIONS,
} from "@/data/feed-data";
import type {
  FeedNotification,
  FeedPost,
  ReactionType,
  ReportReason,
} from "@/interfaces/feed.interface";

interface InsightsDelta {
  views: number;
  seconds: number;
  unique: number;
}

interface ReportEntry {
  postId: string;
  reason: ReportReason;
  details: string;
  at: string;
}

export type VerificationStatus = "none" | "submitted";

interface FeedState {
  following: string[];
  newPostCounts: Record<string, number>;
  myReactions: Record<string, ReactionType>;
  saved: Record<string, string>; // postId -> savedAt
  hidden: string[];
  topicAffinity: Record<string, number>;
  creatorAffinity: Record<string, number>;
  reports: ReportEntry[];
  notifications: FeedNotification[];
  friends: string[];
  sentRequests: string[];
  incomingRequests: string[];
  insightsDelta: Record<string, InsightsDelta>;
  viewedPosts: string[];
  verification: VerificationStatus;
  birthdayReminders: boolean;

  toggleFollow: (creatorId: string) => void;
  setReaction: (postId: string, reaction: ReactionType) => void;
  toggleSaved: (postId: string) => boolean; // returns new saved state
  markNotInterested: (post: FeedPost) => void;
  undoNotInterested: (post: FeedPost) => void;
  markInterested: (post: FeedPost) => void;
  report: (entry: Omit<ReportEntry, "at">) => void;
  pushNotification: (n: FeedNotification) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  incrementNewPosts: (creatorId: string, by?: number) => void;
  clearNewPosts: (creatorId: string) => void;
  sendFriendRequest: (id: string) => void;
  cancelFriendRequest: (id: string) => void;
  acceptFriendRequest: (id: string) => void;
  declineFriendRequest: (id: string) => void;
  recordView: (postId: string) => void;
  addWatchSeconds: (postId: string, seconds: number) => void;
  submitVerification: () => void;
  setBirthdayReminders: (on: boolean) => void;
}

const bump = (map: Record<string, number>, key: string, by: number) => ({
  ...map,
  [key]: (map[key] ?? 0) + by,
});

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      following: INITIAL_FOLLOWING,
      newPostCounts: INITIAL_NEW_POST_COUNTS,
      myReactions: {},
      saved: {},
      hidden: [],
      topicAffinity: {},
      creatorAffinity: {},
      reports: [],
      notifications: INITIAL_NOTIFICATIONS,
      friends: [],
      sentRequests: [],
      incomingRequests: INCOMING_REQUESTS,
      insightsDelta: {},
      viewedPosts: [],
      verification: "none",
      birthdayReminders: true,

      toggleFollow: (creatorId) =>
        set((s) => {
          const isFollowing = s.following.includes(creatorId);
          if (isFollowing) {
            const { [creatorId]: _removed, ...rest } = s.newPostCounts;
            return {
              following: s.following.filter((id) => id !== creatorId),
              newPostCounts: rest,
            };
          }
          return {
            following: [...s.following, creatorId],
            newPostCounts: { ...s.newPostCounts, [creatorId]: 0 },
          };
        }),

      setReaction: (postId, reaction) =>
        set((s) => {
          const next = { ...s.myReactions };
          if (next[postId] === reaction) delete next[postId];
          else next[postId] = reaction;
          return { myReactions: next };
        }),

      toggleSaved: (postId) => {
        const wasSaved = Boolean(get().saved[postId]);
        set((s) => {
          const next = { ...s.saved };
          if (wasSaved) delete next[postId];
          else next[postId] = new Date().toISOString();
          return { saved: next };
        });
        return !wasSaved;
      },

      markNotInterested: (post) =>
        set((s) => ({
          hidden: s.hidden.includes(post.id) ? s.hidden : [...s.hidden, post.id],
          topicAffinity: bump(s.topicAffinity, post.topic, -2),
          creatorAffinity: bump(s.creatorAffinity, post.creatorId, -1),
        })),

      undoNotInterested: (post) =>
        set((s) => ({
          hidden: s.hidden.filter((id) => id !== post.id),
          topicAffinity: bump(s.topicAffinity, post.topic, 2),
          creatorAffinity: bump(s.creatorAffinity, post.creatorId, 1),
        })),

      markInterested: (post) =>
        set((s) => ({
          topicAffinity: bump(s.topicAffinity, post.topic, 2),
          creatorAffinity: bump(s.creatorAffinity, post.creatorId, 2),
        })),

      report: (entry) =>
        set((s) => ({
          reports: [...s.reports, { ...entry, at: new Date().toISOString() }],
          hidden: s.hidden.includes(entry.postId)
            ? s.hidden
            : [...s.hidden, entry.postId],
        })),

      pushNotification: (n) =>
        set((s) => ({ notifications: [n, ...s.notifications].slice(0, 50) })),

      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      incrementNewPosts: (creatorId, by = 1) =>
        set((s) =>
          s.following.includes(creatorId)
            ? { newPostCounts: bump(s.newPostCounts, creatorId, by) }
            : {},
        ),

      clearNewPosts: (creatorId) =>
        set((s) => ({ newPostCounts: { ...s.newPostCounts, [creatorId]: 0 } })),

      sendFriendRequest: (id) =>
        set((s) => ({
          sentRequests: s.sentRequests.includes(id)
            ? s.sentRequests
            : [...s.sentRequests, id],
        })),

      cancelFriendRequest: (id) =>
        set((s) => ({ sentRequests: s.sentRequests.filter((x) => x !== id) })),

      acceptFriendRequest: (id) =>
        set((s) => ({
          incomingRequests: s.incomingRequests.filter((x) => x !== id),
          friends: s.friends.includes(id) ? s.friends : [...s.friends, id],
        })),

      declineFriendRequest: (id) =>
        set((s) => ({
          incomingRequests: s.incomingRequests.filter((x) => x !== id),
        })),

      recordView: (postId) =>
        set((s) => {
          const firstView = !s.viewedPosts.includes(postId);
          const prev = s.insightsDelta[postId] ?? { views: 0, seconds: 0, unique: 0 };
          return {
            viewedPosts: firstView ? [...s.viewedPosts, postId] : s.viewedPosts,
            insightsDelta: {
              ...s.insightsDelta,
              [postId]: {
                ...prev,
                views: prev.views + 1,
                unique: prev.unique + (firstView ? 1 : 0),
              },
            },
          };
        }),

      addWatchSeconds: (postId, seconds) =>
        set((s) => {
          const prev = s.insightsDelta[postId] ?? { views: 0, seconds: 0, unique: 0 };
          return {
            insightsDelta: {
              ...s.insightsDelta,
              [postId]: { ...prev, seconds: prev.seconds + seconds },
            },
          };
        }),

      submitVerification: () => set({ verification: "submitted" }),
      setBirthdayReminders: (on) => set({ birthdayReminders: on }),
    }),
    {
      name: "prodtrix-feed",
      storage: createJSONStorage(() => localStorage),
      // Rehydrated manually on the client (see FeedStoreHydrator) so the
      // server render and first client render match.
      skipHydration: true,
    },
  ),
);

export function useEffectiveInsights(post: FeedPost) {
  const delta = useFeedStore((s) => s.insightsDelta[post.id]);
  const viewCount = post.insights.viewCount + (delta?.views ?? 0);
  const cumulativeSeconds = post.insights.cumulativeSeconds + (delta?.seconds ?? 0);
  const uniqueViewers = post.insights.uniqueViewers + (delta?.unique ?? 0);
  return {
    viewCount,
    cumulativeSeconds,
    uniqueViewers,
    // Value-Add Ratio = Total Watch Time ÷ Total Views
    valueAdd: viewCount > 0 ? cumulativeSeconds / viewCount : 0,
  };
}

export function useReactionCounts(post: FeedPost) {
  const mine = useFeedStore((s) => s.myReactions[post.id]);
  const counts = { ...post.reactions };
  if (mine) counts[mine] += 1;
  return { counts, mine };
}
