export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
  status: string;
  isVerified: boolean;
}

export interface AcademicMeta {
  topicName: string;
  className: string;
  chapter: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: Author;
  academicMeta: AcademicMeta;
  content: string;
  thumbnailUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  comments?: PostComment[];
}
