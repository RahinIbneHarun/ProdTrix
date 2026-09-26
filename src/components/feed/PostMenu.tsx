"use client";

import { useState } from "react";
import { Flag, MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getCreator } from "@/data/feed-data";
import type { FeedPost, ReportReason } from "@/interfaces/feed.interface";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";

const REASONS: { value: ReportReason; label: string; hint: string }[] = [
  { value: "spam", label: "Spam", hint: "Misleading, repetitive or promotional" },
  { value: "misinformation", label: "Misinformation", hint: "Factually wrong or misleading content" },
  { value: "copyright", label: "Copyright", hint: "Uses someone else's work without permission" },
  { value: "harassment", label: "Harassment", hint: "Bullying, hate or targeted abuse" },
];

export function PostMenu({ post }: { post: FeedPost }) {
  const [reportOpen, setReportOpen] = useState(false);
  const markNotInterested = useFeedStore((s) => s.markNotInterested);
  const undoNotInterested = useFeedStore((s) => s.undoNotInterested);
  const markInterested = useFeedStore((s) => s.markInterested);
  const creator = getCreator(post.creatorId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Post options"
            className="-mr-1 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem
            onSelect={() => {
              markInterested(post);
              toast.success(`You'll see more from ${creator?.name ?? "this creator"} and “${post.topic}”`);
            }}
          >
            <ThumbsUp />
            <span>
              <span className="block font-medium">Interested</span>
              <span className="block text-xs text-muted-foreground">Show more like this</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              markNotInterested(post);
              toast("Post hidden. You'll see less about “" + post.topic + "”.", {
                action: { label: "Undo", onClick: () => undoNotInterested(post) },
              });
            }}
          >
            <ThumbsDown />
            <span>
              <span className="block font-medium">Not interested</span>
              <span className="block text-xs text-muted-foreground">Show fewer posts like this</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setReportOpen(true)}
            className="text-destructive data-[highlighted]:bg-destructive/10"
          >
            <Flag />
            <span className="font-medium">Report</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDialog post={post} open={reportOpen} onOpenChange={setReportOpen} />
    </>
  );
}

function ReportDialog({
  post,
  open,
  onOpenChange,
}: {
  post: FeedPost;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");
  const report = useFeedStore((s) => s.report);

  const close = () => {
    onOpenChange(false);
    setReason(null);
    setDetails("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    report({ postId: post.id, reason, details: details.trim() });
    toast.success("Thanks — our team will review this post. It's been hidden from your feed.");
    close();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <SheetContent side="center" className="p-0">
        <SheetHeader className="pb-2">
          <SheetTitle>Report post</SheetTitle>
          <SheetDescription>Why are you reporting “{post.title}”?</SheetDescription>
        </SheetHeader>
        <form onSubmit={submit} className="space-y-4 px-6 pb-6">
          <fieldset className="space-y-2">
            <legend className="sr-only">Reason</legend>
            {REASONS.map((r) => (
              <label
                key={r.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                  reason === r.value ? "border-foreground/40 bg-muted" : "border-border hover:bg-muted/60",
                )}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                  className="mt-1 accent-current"
                />
                <span>
                  <span className="block text-sm font-medium">{r.label}</span>
                  <span className="block text-xs text-muted-foreground">{r.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Additional details (optional)"
            className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="h-9 rounded-md px-4 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason}
              className="h-9 rounded-md bg-destructive px-4 text-sm font-semibold text-destructive-foreground disabled:opacity-50"
            >
              Submit report
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
