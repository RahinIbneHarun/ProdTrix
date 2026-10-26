"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CURRENT_USER_ID,
  FEED_POSTS,
  INCOMING_REQUESTS,
  INITIAL_FOLLOWING,
  INITIAL_NEW_POST_COUNTS,
  INITIAL_NOTIFICATIONS,
  SAMPLE_COMMENTS,
} from "@/data/feed-data";
import type {
  BookReview,
  FeedComment,
  FeedNotification,
  ProfilePost,
  FeedPost,
  ReactionType,
  ReportReason,
} from "@/interfaces/feed.interface";
import { profilePostToFeedPost } from "@/lib/feed/my-posts";

/** localStorage key the feed store persists to. */
export const FEED_STORAGE_KEY = "prodtrix-feed";

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
  myComments: FeedComment[];
  myPosts: ProfilePost[];
  myBookReviews: BookReview[];
  /** Per-post notification choice; posts not listed use the default (on for your own posts, off for others). */
  notifyOverrides: Record<string, boolean>;

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
  removeFriend: (id: string) => void;
  recordView: (postId: string) => void;
  addWatchSeconds: (postId: string, seconds: number) => void;
  submitVerification: () => void;
  setBirthdayReminders: (on: boolean) => void;
  addComment: (postId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
  addMyPost: (post: Omit<ProfilePost, "id" | "createdAt">) => void;
  deleteMyPost: (postId: string) => void;
  updateMyPost: (postId: string, patch: Pick<ProfilePost, "title" | "body">) => void;
  setPostNotifications: (postId: string, on: boolean) => void;
  addBookReview: (review: Omit<BookReview, "id" | "createdAt" | "loved">) => void;
  deleteBookReview: (id: string) => void;
  toggleReviewLove: (id: string) => void;
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
      myComments: [],
      myPosts: [],
      myBookReviews: [],
      notifyOverrides: {},

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

      removeFriend: (id) =>
        set((s) => ({ friends: s.friends.filter((x) => x !== id) })),

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

      addComment: (postId, text) =>
        set((s) => ({
          myComments: [
            ...s.myComments,
            {
              id: `cm-me-${Date.now()}`,
              postId,
              authorName: "You",
              text,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteComment: (commentId) =>
        set((s) => ({ myComments: s.myComments.filter((c) => c.id !== commentId) })),

      addMyPost: (post) =>
        set((s) => ({
          myPosts: [
            { ...post, id: `mp-${Date.now()}`, createdAt: new Date().toISOString() },
            ...s.myPosts,
          ],
        })),

      deleteMyPost: (postId) =>
        set((s) => {
          // Remove everything that pointed at the post, not just the post itself.
          const { [postId]: _saved, ...saved } = s.saved;
          const { [postId]: _reaction, ...myReactions } = s.myReactions;
          const { [postId]: _notify, ...notifyOverrides } = s.notifyOverrides;
          return {
            myPosts: s.myPosts.filter((p) => p.id !== postId),
            myComments: s.myComments.filter((c) => c.postId !== postId),
            saved,
            myReactions,
            notifyOverrides,
          };
        }),

      updateMyPost: (postId, patch) =>
        set((s) => ({
          myPosts: s.myPosts.map((p) =>
            p.id === postId ? { ...p, ...patch, editedAt: new Date().toISOString() } : p,
          ),
        })),

      setPostNotifications: (postId, on) =>
        set((s) => ({ notifyOverrides: { ...s.notifyOverrides, [postId]: on } })),

      addBookReview: (review) =>
        set((s) => ({
          myBookReviews: [
            { ...review, id: `br-${Date.now()}`, loved: false, createdAt: new Date().toISOString() },
            ...s.myBookReviews,
          ],
        })),

      deleteBookReview: (id) =>
        set((s) => ({ myBookReviews: s.myBookReviews.filter((r) => r.id !== id) })),

      toggleReviewLove: (id) =>
        set((s) => ({
          myBookReviews: s.myBookReviews.map((r) => (r.id === id ? { ...r, loved: !r.loved } : r)),
        })),
    }),
    {
      name: FEED_STORAGE_KEY,
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
  // Ignore reactions saved under a type that no longer exists (e.g. the old "tasty").
  if (mine && mine in counts) counts[mine] += 1;
  return { counts, mine };
}

/** Sample comments plus the user's own, oldest first. */
export function usePostComments(postId: string): FeedComment[] {
  const mine = useFeedStore((s) => s.myComments);
  return useMemo(
    () =>
      [...SAMPLE_COMMENTS, ...mine]
        .filter((c) => c.postId === postId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [mine, postId],
  );
}

/** Every post the feed can show: the ones you wrote on your profile (newest first) plus the sample feed posts. */
export function useAllPosts(): FeedPost[] {
  const mine = useFeedStore((s) => s.myPosts);
  return useMemo(() => [...mine.map(profilePostToFeedPost), ...FEED_POSTS], [mine]);
}


/** Whether you get notifications for this post: your choice, otherwise on for your own posts only. */
export function usePostNotifications(post: FeedPost): boolean {
  return useFeedStore((s) => s.notifyOverrides[post.id] ?? post.creatorId === CURRENT_USER_ID);
}
