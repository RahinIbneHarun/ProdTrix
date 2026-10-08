"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getCreator } from "@/data/feed-data";
import type { FeedComment } from "@/interfaces/feed.interface";
import { relativeTime } from "@/lib/feed/utils";
import { useFeedStore, usePostComments } from "@/store/feed-store";
import { CreatorAvatar } from "./CreatorAvatar";

const MAX_LENGTH = 1000;
/** Comments longer than this are clamped with a "See more" toggle. */
const CLAMP_CHARS = 180;

/**
 * Facebook-style comments: only the newest `previewCount` comments show inline;
 * the rest live in a dialog with its own scroll area so long threads never
 * stretch the feed.
 */
export function CommentsSection({
  postId,
  postTitle,
  previewCount = 2,
  autoFocus,
}: {
  postId: string;
  postTitle?: string;
  previewCount?: number;
  autoFocus?: boolean;
}) {
  const comments = usePostComments(postId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const preview = comments.slice(-previewCount);
  const hidden = comments.length - preview.length;

  return (
    <div className="space-y-3">
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground hover:underline"
        >
          View all {comments.length} comments
        </button>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="space-y-3">
          {preview.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      )}

      <CommentForm postId={postId} autoFocus={autoFocus} />

      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent side="center" className="flex max-h-[85vh] flex-col overflow-hidden p-0">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle>Comments ({comments.length})</SheetTitle>
            {postTitle && <SheetDescription className="line-clamp-1 pr-8">{postTitle}</SheetDescription>}
          </SheetHeader>
          <CommentThread comments={comments} />
          <div className="border-t border-border p-4">
            <CommentForm postId={postId} autoFocus />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** Scrollable full list; jumps to the bottom when a new comment is added. */
function CommentThread({ comments }: { comments: FeedComment[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [comments.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
      <ul className="space-y-3">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </ul>
      <div ref={endRef} />
    </div>
  );
}

function CommentForm({ postId, autoFocus }: { postId: string; autoFocus?: boolean }) {
  const addComment = useFeedStore((s) => s.addComment);
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment(postId, trimmed);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        Y
      </span>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Enter posts, Shift+Enter adds a new line.
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit(e);
          }
        }}
        autoFocus={autoFocus}
        rows={1}
        maxLength={MAX_LENGTH}
        placeholder="Write a comment…"
        aria-label="Write a comment"
        className="max-h-32 min-h-9 flex-1 resize-none rounded-2xl border border-border bg-muted/50 px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-ring/30"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        aria-label="Post comment"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
      >
        <Send className="size-4" />
      </button>
    </form>
  );
}

function CommentItem({ comment }: { comment: FeedComment }) {
  const deleteComment = useFeedStore((s) => s.deleteComment);
  const [expanded, setExpanded] = useState(false);
  const author = comment.authorId ? getCreator(comment.authorId) : undefined;
  const isMine = !comment.authorId;
  const isLong = comment.text.length > CLAMP_CHARS;
  const text = isLong && !expanded ? `${comment.text.slice(0, CLAMP_CHARS).trimEnd()}…` : comment.text;

  return (
    <li className="flex items-start gap-2">
      {author ? (
        <Link href={`/feed/creator/${author.id}`} className="shrink-0">
          <CreatorAvatar creator={author} size={32} />
        </Link>
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          Y
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="inline-block max-w-full rounded-2xl bg-muted/60 px-3 py-2">
          {author ? (
            <Link href={`/feed/creator/${author.id}`} className="text-xs font-semibold hover:underline">
              {comment.authorName}
            </Link>
          ) : (
            <span className="text-xs font-semibold">{comment.authorName}</span>
          )}
          <p className="whitespace-pre-wrap break-words text-sm leading-5">
            {text}
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="ml-1 font-semibold text-muted-foreground hover:underline"
              >
                {expanded ? "See less" : "See more"}
              </button>
            )}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-3 px-3 text-[11px] text-muted-foreground">
          <time suppressHydrationWarning dateTime={comment.createdAt}>
            {relativeTime(comment.createdAt)}
          </time>
          {isMine && (
            <button
              type="button"
              onClick={() => deleteComment(comment.id)}
              className="inline-flex items-center gap-1 hover:text-destructive"
            >
              <Trash2 className="size-3" /> Delete
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
