export interface PostAuthor {
  id: string;
  name: string;
  role?: string; // "Full Stack Engineer"
  avatar?: string;
}

export interface PostMedia {
  url: string;
  title?: string;
}

export interface Post {
  id: string;
  author: PostAuthor;
  title?: string;
  content: string;
  timeAgo?: string;
  likes?: number;
  commentsCount?: number;
  shares?: number;
  views?: number;
  media?: PostMedia;
  academicMeta?: {
    topic?: string;
    class?: string;
    chapter?: string;
  };
}
