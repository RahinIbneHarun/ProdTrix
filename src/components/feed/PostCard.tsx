"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  Bookmark,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Smile,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FeedPost } from "@/interfaces/feed.interface";

export default function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [saved, setSaved] = useState(post.saved);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-start gap-3 px-2">
        <Link href={`/profile/${post.author.id}`} className="shrink-0">
          {post.author.avatarUrl ? (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {post.author.name.charAt(0)}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <Link
              href={`/profile/${post.author.id}`}
              className="truncate text-sm font-semibold hover:underline"
            >
              {post.author.name}
            </Link>
            {post.author.verified && (
              <BadgeCheck className="size-4 shrink-0 fill-primary text-primary-foreground" />
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {post.author.status}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{post.topic}</Badge>
            <Badge variant="outline">{post.className}</Badge>
            <Badge variant="outline">{post.chapter}</Badge>
          </div>
        </div>

        <div className="relative shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="More options"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreHorizontal />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-36 rounded-2xl border border-border bg-popover p-1 shadow-md">
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted">
                Report
              </button>
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted">
                Hide post
              </button>
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted">
                Copy link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-2">
        <p className="text-sm leading-6 text-foreground/90">{post.content}</p>
      </div>

      {post.thumbnailUrl && (
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={post.thumbnailUrl}
            alt={post.topic}
            width={800}
            height={450}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
        <span>{likeCount} reactions</span>
        <span>
          {post.comments.length} comments · {post.shareCount} shares
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border px-1 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLike}
          className={cn(liked && "text-primary")}
        >
          <Heart className={cn(liked && "fill-primary")} />
          Like
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCommentsOpen((v) => !v)}
        >
          <MessageCircle />
          Comment
        </Button>

        <Button variant="ghost" size="sm">
          <Share2 />
          Share
        </Button>

        <Button variant="ghost" size="sm" onClick={() => setSaved((v) => !v)}>
          <Bookmark className={cn(saved && "fill-primary text-primary")} />
          Save
        </Button>
      </div>

      {/* Comments */}
      {commentsOpen && (
        <div className="space-y-3 border-t border-border px-2 pt-3">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {comment.author.name.charAt(0)}
              </div>
              <div className="rounded-2xl bg-muted/50 px-3 py-2">
                <p className="text-xs font-medium">{comment.author.name}</p>
                <p className="text-sm">{comment.text}</p>
                {comment.imageUrl && (
                  <Image
                    src={comment.imageUrl}
                    alt="comment attachment"
                    width={200}
                    height={150}
                    className="mt-2 rounded-xl object-cover"
                  />
                )}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full rounded-full bg-muted/40 px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button variant="ghost" size="icon-sm" aria-label="Add image">
              <ImageIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Add emoji">
              <Smile />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
