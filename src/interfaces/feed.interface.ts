export interface FeedAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
  status: string; // e.g. "Student at AIUB" or "Software Engineer at X"
  verified?: boolean;
}

export interface FeedComment {
  id: string;
  author: FeedAuthor;
  text: string;
  imageUrl?: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  author: FeedAuthor;
  topic: string;
  className: string;
  chapter: string;
  content: string;
  thumbnailUrl?: string;
  likeCount: number;
  liked: boolean;
  saved: boolean;
  shareCount: number;
  comments: FeedComment[];
  createdAt: string;
}
