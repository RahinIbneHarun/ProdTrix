"use client";

import { useMemo, useState } from "react";
import { Check, Link2, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getCreator } from "@/data/feed-data";
import type { FeedPost } from "@/interfaces/feed.interface";
import { useFeedStore } from "@/store/feed-store";
import { cn } from "@/lib/utils";
import { CreatorAvatar } from "./CreatorAvatar";

export function postUrl(post: FeedPost) {
  return `${window.location.origin}/feed/content/${post.id}`;
}

/** Native share sheet on touch devices, custom modal everywhere else. */
export async function sharePost(post: FeedPost, openModal: () => void) {
  const touch = window.matchMedia("(pointer: coarse)").matches;
  if (touch && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: post.title, text: post.excerpt, url: postUrl(post) });
      return;
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return; // user cancelled
    }
  }
  openModal();
}

export function ShareDialog({
  post,
  open,
  onOpenChange,
}: {
  post: FeedPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [dmOpen, setDmOpen] = useState(false);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const following = useFeedStore((s) => s.following);
  const friends = useFeedStore((s) => s.friends);
  const contacts = useMemo(
    () => Array.from(new Set([...friends, ...following])).map(getCreator).filter(Boolean),
    [friends, following],
  );

  const url = typeof window === "undefined" ? "" : postUrl(post);
  const enc = encodeURIComponent;
  const targets = [
    {
      label: "Facebook",
      color: "bg-[#1877F2]",
      glyph: "f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      label: "X (Twitter)",
      color: "bg-black",
      glyph: "𝕏",
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(post.title)}`,
    },
    {
      label: "WhatsApp",
      color: "bg-[#25D366]",
      glyph: "W",
      href: `https://wa.me/?text=${enc(`${post.title} ${url}`)}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const sendDm = () => {
    const to = recipient && getCreator(recipient);
    if (!to) return;
    toast.success(`Sent to ${to.name}`);
    setDmOpen(false);
    setRecipient(null);
    setNote("");
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setDmOpen(false);
      }}
    >
      <SheetContent side="center" className="p-0">
        <SheetHeader className="pb-2">
          <SheetTitle>Share post</SheetTitle>
          <SheetDescription className="line-clamp-1">{post.title}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 pb-6">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-1.5 pl-3">
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{url}</span>
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground"
            >
              {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {targets.map((t) => (
              <a
                key={t.label}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-center text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full text-lg font-bold text-white",
                    t.color,
                  )}
                >
                  {t.glyph}
                </span>
                {t.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setDmOpen((v) => !v)}
              aria-expanded={dmOpen}
              className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-center text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <MessageSquare className="size-5" />
              </span>
              Message
            </button>
          </div>

          {dmOpen && (
            <div className="space-y-3 rounded-lg border border-border p-3">
              <p className="text-xs font-semibold">Send in a message</p>
              {contacts.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Follow creators or add friends to message them.
                </p>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {contacts.map((c) => (
                    <button
                      key={c!.id}
                      type="button"
                      onClick={() => setRecipient(c!.id)}
                      className={cn(
                        "flex w-16 shrink-0 flex-col items-center gap-1 rounded-lg p-1.5 text-[11px]",
                        recipient === c!.id ? "bg-muted ring-1 ring-foreground/30" : "hover:bg-muted",
                      )}
                    >
                      <CreatorAvatar creator={c!} size={36} />
                      <span className="w-full truncate">{c!.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note (optional)"
                  className="h-9 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
                <button
                  type="button"
                  disabled={!recipient}
                  onClick={sendDm}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                >
                  <Send className="size-3.5" /> Send
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
