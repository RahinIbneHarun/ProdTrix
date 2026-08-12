"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Paperclip,
  Smile,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Post } from "@/types";
import { createPost } from "@/lib/api";

interface ComposerProps {
  onPostCreate: (newPost: Post) => void;
}

export function Composer({ onPostCreate }: ComposerProps) {
  const [content, setContent] = useState("");
  const [topicName, setTopicName] = useState("");
  const [className, setClassName] = useState("");
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        content,
        topicName: topicName || "General",
        className: className || "N/A",
        chapter: chapter || "N/A",
      };

      const newPost = await createPost(payload);
      onPostCreate(newPost);

      // Clear form
      setContent("");
      setTopicName("");
      setClassName("");
      setChapter("");
    } catch (err: any) {
      console.error("Post creation error:", err);
      setError(err.message || "Failed to create post. Try again.");

      // For demo purposes, create a local post if API fails
      const localPost: Post = {
        id: `post-${Date.now()}`,
        author: {
          id: "current-user",
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
        createdAt: new Date().toISOString(),
      };

      onPostCreate(localPost);
      setContent("");
      setTopicName("");
      setClassName("");
      setChapter("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 mb-6">
      {error && (
        <div className="mb-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
            U
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an educational update, note, or material..."
            disabled={loading}
            className="w-full resize-none bg-transparent border-0 focus:outline-none text-sm min-h-[70px] disabled:opacity-50"
          />
        </div>

        {/* Academic Details (Topic, Class, Chapter) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t text-xs">
          <input
            type="text"
            placeholder="Topic Name"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            disabled={loading}
            className="px-2 py-1.5 rounded border border-input bg-background disabled:opacity-50"
          />
          <input
            type="text"
            placeholder="Class"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            disabled={loading}
            className="px-2 py-1.5 rounded border border-input bg-background disabled:opacity-50"
          />
          <input
            type="text"
            placeholder="Chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            disabled={loading}
            className="px-2 py-1.5 rounded border border-input bg-background disabled:opacity-50"
          />
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              disabled={loading}
              className="p-2 rounded-full hover:bg-accent hover:text-foreground disabled:opacity-50"
              title="Share Image"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={loading}
              className="p-2 rounded-full hover:bg-accent hover:text-foreground disabled:opacity-50"
              title="Attach File"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={loading}
              className="p-2 rounded-full hover:bg-accent hover:text-foreground disabled:opacity-50"
              title="Emoji"
            >
              <Smile className="h-4 w-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
