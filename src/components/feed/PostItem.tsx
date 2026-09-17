"use client";

import React from "react";
import Image from "next/image";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  BarChart3,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avater";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const tags = [
    post.academicMeta?.topic,
    post.academicMeta?.class,
    post.academicMeta?.chapter,
  ].filter(Boolean) as string[];

  return (
    <article className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <Avatar className="h-11 w-11">
          <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
          <AvatarFallback>{post.author?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {post.author?.name ?? "Unknown"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {post.author?.role ?? "Learner"} · shared a lesson ·{" "}
            {post.timeAgo ?? "just now"}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-4 text-xs rounded-full border-primary text-primary hover:bg-primary/10"
        >
          Follow
        </Button>

        <button className="p-1 text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Media */}
      {post.media?.url && (
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={post.media.url}
            alt={post.media.title ?? post.title ?? "Post media"}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 640px"
          />
          {post.title && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-semibold text-base">
                {post.title}
              </h3>
            </div>
          )}
        </div>
      )}

      {/* Body text */}
      {post.content && (
        <div className="px-4 py-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border text-muted-foreground">
        <button className="flex items-center gap-2 text-xs hover:text-primary transition-colors">
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likes ?? 0}</span>
        </button>

        <button className="flex items-center gap-2 text-xs hover:text-primary transition-colors">
          <MessageSquare className="h-4 w-4" />
          <span>{post.commentsCount ?? 0}</span>
        </button>

        <button className="flex items-center gap-2 text-xs hover:text-primary transition-colors">
          <Share2 className="h-4 w-4" />
          <span>{post.shares ?? 0}</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <BarChart3 className="h-4 w-4" />
          <span>{formatViews(post.views ?? 0)}</span>
        </div>
      </div>
    </article>
  );
}

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k views`;
  return `${n} views`;
}
