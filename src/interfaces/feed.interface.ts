export type ReactionType = "gold" | "diamond" | "clap" | "tasty";

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
