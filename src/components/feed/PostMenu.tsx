"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, BellOff, Flag, Link2, Pencil, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { FeedIcon } from "./FeedIcon";
import { postUrl } from "./ShareDialog";
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
import { CURRENT_USER_ID, getCreator } from "@/data/feed-data";
import type { FeedPost, ReportReason } from "@/interfaces/feed.interface";
import { deleteFiles } from "@/lib/profile/attachments";
import { cn } from "@/lib/utils";
import { useFeedStore, usePostNotifications } from "@/store/feed-store";

const REASONS: { value: ReportReason; label: string; hint: string }[] = [
  { value: "spam", label: "Spam", hint: "Misleading, repetitive or promotional" },
  { value: "misinformation", label: "Misinformation", hint: "Factually wrong or misleading content" },
  { value: "copyright", label: "Copyright", hint: "Uses someone else's work without permission" },
  { value: "harassment", label: "Harassment", hint: "Bullying, hate or targeted abuse" },
];

function MenuItemText({ title, hint }: { title: string; hint?: string }) {
  return (
    <span>
      <span className="block font-medium">{title}</span>
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </span>
  );
}

export function PostMenu({ post }: { post: FeedPost }) {
  const [reportOpen, setReportOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const markNotInterested = useFeedStore((s) => s.markNotInterested);
  const undoNotInterested = useFeedStore((s) => s.undoNotInterested);
  const markInterested = useFeedStore((s) => s.markInterested);
  const setPostNotifications = useFeedStore((s) => s.setPostNotifications);
  const notifying = usePostNotifications(post);
  const isMine = post.creatorId === CURRENT_USER_ID;
  const creator = getCreator(post.creatorId);

  const toggleNotifications = () => {
    setPostNotifications(post.id, !notifying);
    toast.success(notifying ? "Notifications turned off for this post" : "Notifications turned on for this post");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl(post));
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn’t copy the link");
    }
  };

  const notificationsItem = (
    <DropdownMenuItem onSelect={toggleNotifications}>
      {notifying ? <BellOff /> : <Bell />}
      <MenuItemText
        title={notifying ? "Turn off notifications" : "Turn on notifications"}
        hint={notifying ? "Stop alerts for reactions and comments" : "Get alerts for reactions and comments"}
      />
    </DropdownMenuItem>
  );

  const copyLinkItem = (
    <DropdownMenuItem onSelect={copyLink}>
      <Link2 />
      <MenuItemText title="Copy link" />
    </DropdownMenuItem>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Post options"
            className="-mr-1 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <FeedIcon name="more" className="size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          {isMine ? (
            <>
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil />
                <MenuItemText title="Edit post" hint="Change the title or text" />
              </DropdownMenuItem>
              {notificationsItem}
              {copyLinkItem}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setDeleteOpen(true)}
                className="text-destructive data-[highlighted]:bg-destructive/10"
              >
                <Trash2 />
                <MenuItemText title="Delete post" />
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onSelect={() => {
                  markInterested(post);
                  toast.success(`You'll see more from ${creator?.name ?? "this creator"} and “${post.topic}”`);
                }}
              >
                <ThumbsUp />
                <MenuItemText title="Interested" hint="Show more like this" />
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
                <MenuItemText title="Not interested" hint="Show fewer posts like this" />
              </DropdownMenuItem>
              {notificationsItem}
              {copyLinkItem}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setReportOpen(true)}
                className="text-destructive data-[highlighted]:bg-destructive/10"
              >
                <Flag />
                <span className="font-medium">Report</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isMine ? (
        <>
          {editOpen && <EditDialog post={post} onClose={() => setEditOpen(false)} />}
          {deleteOpen && <DeleteDialog post={post} onClose={() => setDeleteOpen(false)} />}
        </>
      ) : (
        <ReportDialog post={post} open={reportOpen} onOpenChange={setReportOpen} />
      )}
    </>
  );
}

function EditDialog({ post, onClose }: { post: FeedPost; onClose: () => void }) {
  const updateMyPost = useFeedStore((s) => s.updateMyPost);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const fieldCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40";

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateMyPost(post.id, { title: title.trim(), body: body.trim() });
    toast.success("Post updated");
    onClose();
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="center" className="p-0">
        <SheetHeader className="pb-2">
          <SheetTitle>Edit post</SheetTitle>
          <SheetDescription>Changing it saves a new version of the post.</SheetDescription>
        </SheetHeader>
        <form onSubmit={save} className="space-y-4 px-6 pb-6">
          <div className="space-y-1.5">
            <label htmlFor="edit-title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Title
            </label>
            <input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} autoFocus className={fieldCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="edit-body" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Text
            </label>
            <textarea id="edit-body" value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={5000} className={`${fieldCls} resize-y`} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="h-9 rounded-md px-4 text-sm font-medium hover:bg-muted">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              Save changes
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function DeleteDialog({ post, onClose }: { post: FeedPost; onClose: () => void }) {
  const deleteMyPost = useFeedStore((s) => s.deleteMyPost);
  const router = useRouter();
  const pathname = usePathname();

  const confirm = () => {
    deleteMyPost(post.id);
    // The photos, videos and files live in separate browser storage.
    deleteFiles((post.attachments ?? []).map((a) => a.id)).catch(() => {});
    toast.success("Post deleted");
    onClose();
    // Don't leave the person on the page of a post that no longer exists.
    if (pathname.startsWith("/feed/content/")) router.replace("/feed");
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="center" className="p-0">
        <SheetHeader className="pb-2">
          <SheetTitle>Delete this post?</SheetTitle>
          <SheetDescription>
            “{post.title}” will be removed from your profile and the feed, together with its photos and files. This
            can’t be undone.
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button type="button" onClick={onClose} autoFocus className="h-9 rounded-md px-4 text-sm font-medium hover:bg-muted">
            Cancel
          </button>
          <button
            type="button"
            onClick={confirm}
            className="h-9 rounded-md bg-destructive px-4 text-sm font-semibold text-destructive-foreground"
          >
            Delete post
          </button>
        </div>
      </SheetContent>
    </Sheet>
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
