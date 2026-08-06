"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Home,
  Users,
  Bell,
  SlidersHorizontal,
  MoreVertical,
  MoreHorizontal,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
} from "lucide-react";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
  status: string; // Job or student status
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

// ==========================================
// SAMPLE DATA (INLINED)
// ==========================================

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    author: {
      id: "usr-1",
      name: "Alex Johnson",
      status: "Senior Mathematics Student",
      isVerified: true,
    },
    academicMeta: {
      topicName: "Linear Algebra",
      className: "Class 12",
      chapter: "Chapter 3: Matrices & Determinants",
    },
    content:
      "Here is a quick summary cheat sheet on matrix multiplication and determinant properties. Hope this helps everyone preparing for exams!",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    likesCount: 34,
    commentsCount: 1,
    sharesCount: 5,
    createdAt: "2 hours ago",
    comments: [
      {
        id: "c-1",
        authorName: "Maria Garcia",
        text: "Great breakdown! Thanks for sharing.",
        createdAt: "1 hour ago",
      },
    ],
  },
  {
    id: "post-2",
    author: {
      id: "usr-2",
      name: "Dr. Robert Smith",
      status: "Computer Science Instructor",
      isVerified: true,
    },
    academicMeta: {
      topicName: "Data Structures",
      className: "Undergraduate",
      chapter: "Chapter 5: Binary Search Trees",
    },
    content:
      "Understanding tree traversals (In-order, Pre-order, Post-order). Remember that In-order traversal on a BST yields sorted elements.",
    likesCount: 88,
    commentsCount: 0,
    sharesCount: 12,
    createdAt: "4 hours ago",
  },
];

// ==========================================
// COMPONENTS
// ==========================================

function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto flex h-14 items-center justify-between px-4 gap-2">
        {/* Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics, classes, posts..."
              className="w-full rounded-md border border-input bg-muted/50 pl-8 pr-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            className="p-2 rounded-md hover:bg-accent text-foreground flex items-center justify-center"
            title="Home"
          >
            <Home className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center"
            title="Followers"
          >
            <Users className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground relative flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center"
            title="Filter"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </nav>

        {/* Feed Corner 3-Dot */}
        <div className="flex items-center">
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground"
            title="Feed options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Composer({ onPostCreate }: { onPostCreate: (newPost: Post) => void }) {
  const [content, setContent] = useState("");
  const [topicName, setTopicName] = useState("");
  const [className, setClassName] = useState("");
  const [chapter, setChapter] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: {
        id: "user-current",
        name: "You",
        status: "Student",
        isVerified: false,
      },
      academicMeta: {
        topicName: topicName || "General",
        className: className || "N/A",
        chapter: chapter || "N/A",
      },
      content,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: "Just now",
      comments: [],
    };

    onPostCreate(newPost);
    setContent("");
    setTopicName("");
    setClassName("");
    setChapter("");
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
            U
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an educational update, note, or material..."
            className="w-full resize-none bg-transparent border-0 focus:outline-none text-sm min-h-[70px]"
          />
        </div>

        {/* Academic Details (Topic, Class, Chapter) */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
          <input
            type="text"
            placeholder="Topic Name"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            className="px-2 py-1.5 rounded border border-input bg-background"
          />
          <input
            type="text"
            placeholder="Class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="px-2 py-1.5 rounded border border-input bg-background"
          />
          <input
            type="text"
            placeholder="Chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="px-2 py-1.5 rounded border border-input bg-background"
          />
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent hover:text-foreground"
              title="Share Image"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent hover:text-foreground"
              title="Attach File"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent hover:text-foreground"
              title="Emoji"
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

function PostItem({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post.comments || []);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments([
      ...comments,
      {
        id: `c-${Date.now()}`,
        authorName: "You",
        text: commentText,
        createdAt: "Just now",
      },
    ]);
    setCommentText("");
  };

  return (
    <article className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Profile Icon -> Goes to profile page */}
          <Link href={`/profile/${post.author.id}`} className="shrink-0">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground overflow-hidden">
              {post.author.avatarUrl ? (
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                post.author.name.charAt(0)
              )}
            </div>
          </Link>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/profile/${post.author.id}`}
                className="font-semibold text-sm hover:underline"
              >
                {post.author.name}
              </Link>
              {post.author.isVerified && (
                <CheckCircle2
                  className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0"
                  title="Verified"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {post.author.status}
            </p>
            <p className="text-[10px] text-muted-foreground/80 mt-0.5">
              {post.createdAt}
            </p>
          </div>
        </div>

        {/* Post Top Left/Right Corner 3-Dot */}
        <button
          className="text-muted-foreground hover:text-foreground p-1 rounded-md"
          title="Post options"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Topic Name, Class, Chapter Tags */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5 text-xs">
        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          Topic: {post.academicMeta.topicName}
        </span>
        <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
          Class: {post.academicMeta.className}
        </span>
        <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
          Chapter: {post.academicMeta.chapter}
        </span>
      </div>

      {/* Content Text */}
      <div className="px-4 py-2 text-sm whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Post Thumbnail Show */}
      {post.thumbnailUrl && (
        <div className="mt-2 bg-muted/40 border-y max-h-96 overflow-hidden flex items-center justify-center">
          <img
            src={post.thumbnailUrl}
            alt="Post Thumbnail"
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Statistics */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-b">
        <span>{likesCount} likes</span>
        <div className="flex gap-3">
          <span>{comments.length} comments</span>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Action Buttons: React, Comment, Share, Save */}
      <div className="px-2 py-1 flex items-center justify-between border-b text-xs font-medium text-muted-foreground">
        <button
          onClick={handleLikeToggle}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-accent ${
            isLiked ? "text-red-500" : "hover:text-foreground"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          Like
        </button>

        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-accent hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </button>

        <button className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-accent hover:text-foreground">
          <Share2 className="h-4 w-4" />
          Share
        </button>

        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-md hover:bg-accent ${isSaved ? "text-primary" : "hover:text-foreground"}`}
          title="Save Option"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Comment Box Section (Image, Text, Emoji support UI) */}
      {showCommentBox && (
        <div className="p-4 bg-muted/20 space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="text-xs bg-background p-2.5 rounded-lg border space-y-1"
            >
              <div className="flex justify-between font-semibold">
                <span>{comment.authorName}</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {comment.createdAt}
                </span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))}

          <form onSubmit={handleAddComment} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <div className="flex items-center gap-1 text-muted-foreground">
              <button
                type="button"
                className="p-1.5 hover:text-foreground"
                title="Share image in comment"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:text-foreground"
                title="Share emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  const handlePostCreate = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />

      <main className="container max-w-2xl mx-auto px-4 py-6">
        <Composer onPostCreate={handlePostCreate} />

        <div className="space-y-4">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
