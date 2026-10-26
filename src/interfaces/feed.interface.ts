export type ReactionType = "gold" | "diamond" | "clap" | "sad";

export type ContentCategory = "academic" | "non-academic";

export type CoverAspect = "16:9" | "4:3";

export interface FeedCreator {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  headline: string;
  verified: boolean;
  birthday?: string; // MM-DD
}

export interface PostVersion {
  version: number;
  editedAt: string;
  note: string;
}

export interface PostInsights {
  viewCount: number;
  cumulativeSeconds: number;
  uniqueViewers: number;
}

export interface FeedPost {
  id: string;
  creatorId: string;
  category: ContentCategory;
  subject: string;
  chapter: string;
  topic: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  coverAspect: CoverAspect;
  reactions: Record<ReactionType, number>;
  versions: PostVersion[]; // oldest first; last entry is the current version
  insights: PostInsights;
  /** Photos, videos and files attached by the author (profile posts only). */
  attachments?: PostAttachment[];
  createdAt: string;
}

export type NotificationKind = "new-content" | "reply" | "reaction" | "system";

export interface FeedNotification {
  id: string;
  kind: NotificationKind;
  actorId?: string;
  postId?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface FeedComment {
  id: string;
  postId: string;
  authorId?: string; // creator id; undefined for the current user's own comments
  authorName: string;
  text: string;
  createdAt: string;
}

/** A file attached to a profile post. The bytes live in IndexedDB under `id`; only this metadata is persisted with the post. */
export interface PostAttachment {
  id: string;
  name: string;
  type: string; // MIME type, e.g. "image/png"
  size: number; // bytes
}

/** A post written from the profile's Add Post page. It lives on the profile only, not in the feed. */
export interface ProfilePost {
  id: string;
  title: string;
  category: ContentCategory;
  subject: string;
  chapter: string;
  topic: string;
  body: string;
  coverUrl: string;
  /** Photos, videos and files attached to the post (absent on posts saved before attachments existed). */
  attachments?: PostAttachment[];
  createdAt: string;
  /** Set when the post has been edited; shows up as version 2 in the feed. */
  editedAt?: string;
}

/** A book review written on the profile's Book Review page. */
export interface BookReview {
  id: string;
  bookName: string;
  writer: string;
  topic: string;
  review: string;
  /** Whether you gave this review a love. */
  loved: boolean;
  createdAt: string;
}

export type ReportReason = "spam" | "misinformation" | "copyright" | "harassment";

export interface FeedFilters {
  q: string;
  category: ContentCategory | "";
  subject: string;
  chapter: string;
  topic: string;
  version: string; // "", "1", "2", "3+" ...
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  creator: string;
}

export const EMPTY_FILTERS: FeedFilters = {
  q: "",
  category: "",
  subject: "",
  chapter: "",
  topic: "",
  version: "",
  from: "",
  to: "",
  creator: "",
};
