"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Post, PostComment } from "@/types";
import { likePost, addComment } from "@/lib/api";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [isSaved, setIsSaved] = useState(post.isSaved ?? false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<PostComment[]>(post.comments ?? []);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const handleLikeToggle = async () => {
    if (loadingLike) return;

    // Optimistic update first
    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    setLoadingLike(true);

    try {
      // Try API call but don't wait for it to succeed
      await likePost(post.id, isLiked);
      // If API succeeds, keep the optimistic update
    } catch (err: any) {
      console.log("Like API failed, keeping local state:", err.message);
      // Keep the optimistic update even if API fails
    } finally {
      setLoadingLike(false);
    }
  };

  const handleSaveToggle = async () => {
    if (loadingSave) return;

    setLoadingSave(true);
    setIsSaved((prev) => !prev);

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoadingSave(false);
  };

  const handleShareToggle = async () => {
    if (loadingShare) return;

    setLoadingShare(true);

    try {
      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.author.name}`,
          text: post.content,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(
          `${post.content} - ${post.author.name}`,
        );
        // You could show a toast notification here
        alert("Post text copied to clipboard!");
      }
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    } finally {
      setLoadingShare(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || loadingComment) return;

    setLoadingComment(true);

    // Create optimistic comment
    const optimisticComment: PostComment = {
      id: `comment-${Date.now()}`,
      authorName: "You",
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    // Add comment immediately
    setComments((prev) => [...prev, optimisticComment]);
    setCommentText("");

    try {
      // Try API call
      const newComment = await addComment(post.id, optimisticComment.text);
      // If API returns a different comment, replace the optimistic one
      if (newComment.id !== optimisticComment.id) {
        setComments((prev) =>
          prev.map((c) => (c.id === optimisticComment.id ? newComment : c)),
        );
      }
    } catch (err: any) {
      console.log("Comment API failed, keeping local comment:", err.message);
      // Keep the optimistic comment if API fails
    } finally {
      setLoadingComment(false);
    }
  };

  const formattedCreatedAt = useMemo(() => {
    const date = new Date(post.createdAt);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }, [post.createdAt]);

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
                <div title="Verified" className="flex items-center">
                  <CheckCircle2
                    className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0"
                    aria-label="Verified"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {post.author.status}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {formattedCreatedAt}
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
          <span>{post.sharesCount ?? 0} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-2 py-1 flex items-center justify-between border-b text-xs font-medium text-muted-foreground">
        <button
          onClick={handleLikeToggle}
          disabled={loadingLike}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-accent disabled:opacity-50 ${
            isLiked ? "text-red-500" : "hover:text-foreground"
          }`}
          title="Like"
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          Like
        </button>

        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-accent hover:text-foreground"
          title="Comment"
        >
          <MessageCircle className="h-4 w-4" />
          Comment
        </button>

        <button
          onClick={handleShareToggle}
          disabled={loadingShare}
          className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-md hover:bg-accent hover:text-foreground disabled:opacity-50"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>

        <button
          onClick={handleSaveToggle}
          disabled={loadingSave}
          className={`p-2 rounded-md hover:bg-accent disabled:opacity-50 ${isSaved ? "text-primary" : "hover:text-foreground"}`}
          title="Save"
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Comment Box */}
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
                  {formattedCreatedAt}
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
              disabled={loadingComment}
              className="flex-1 text-xs px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
            />
            <div className="flex items-center gap-1 text-muted-foreground">
              <button
                type="button"
                disabled={loadingComment}
                className="p-1.5 hover:text-foreground disabled:opacity-50"
                title="Share image in comment"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={loadingComment}
                className="p-1.5 hover:text-foreground disabled:opacity-50"
                title="Share emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!commentText.trim() || loadingComment}
              className="p-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
            >
              {loadingComment ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
