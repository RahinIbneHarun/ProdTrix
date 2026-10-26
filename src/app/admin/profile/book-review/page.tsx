"use client";

import { useState } from "react";
import { BookMarked, Check, Heart, Share2, Trash2 } from "lucide-react";
import { ShareDialog, sharePost, type ShareItem } from "@/components/feed/ShareDialog";
import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import type { BookReview } from "@/interfaces/feed.interface";
import { relativeTime } from "@/lib/feed/utils";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";

const fieldCls =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25";

const EMPTY = { bookName: "", writer: "", topic: "", review: "" };

const shareItemFor = (r: BookReview): ShareItem => ({
  title: r.writer ? `${r.bookName} by ${r.writer}` : r.bookName,
  text: r.review.length > 200 ? `${r.review.slice(0, 200).trimEnd()}…` : r.review,
  path: `/admin/profile/book-review#${r.id}`,
  label: "Share review",
});

export default function BookReviewPage() {
  const hydrated = useFeedHydrated();
  const reviews = useFeedStore((s) => s.myBookReviews);
  const addBookReview = useFeedStore((s) => s.addBookReview);
  const deleteBookReview = useFeedStore((s) => s.deleteBookReview);
  const toggleLove = useFeedStore((s) => s.toggleReviewLove);
  const [form, setForm] = useState(EMPTY);
  const [added, setAdded] = useState(false);
  const [sharing, setSharing] = useState<BookReview | null>(null);

  const set =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAdded(false);
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const canSubmit = Boolean(form.bookName.trim() && form.review.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    addBookReview({
      bookName: form.bookName.trim(),
      writer: form.writer.trim(),
      topic: form.topic.trim(),
      review: form.review.trim(),
    });
    setForm(EMPTY);
    setAdded(true);
  };

  return (
    <ProfilePageShell title="Book Review" description="Review the books you have read.">
      <form onSubmit={submit} className="theme-card space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="br-name" className="theme-label">Book name</label>
            <input id="br-name" value={form.bookName} onChange={set("bookName")} maxLength={150} required placeholder="e.g. Atomic Habits" className={fieldCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="br-writer" className="theme-label">Writer</label>
            <input id="br-writer" value={form.writer} onChange={set("writer")} maxLength={100} placeholder="e.g. James Clear" className={fieldCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="br-topic" className="theme-label">Topic</label>
            <input id="br-topic" value={form.topic} onChange={set("topic")} maxLength={100} placeholder="e.g. Self improvement" className={fieldCls} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="br-review" className="theme-label">Your review</label>
          <textarea id="br-review" value={form.review} onChange={set("review")} rows={5} maxLength={3000} required placeholder="What did you think of the book?" className={`${fieldCls} resize-y`} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
          {added && (
            <span role="status" className="mr-auto inline-flex items-center gap-1.5 text-sm text-emerald-500 dark:text-emerald-400">
              <Check className="h-4 w-4" /> Review added
            </span>
          )}
          {!added && !canSubmit && (
            <span className="mr-auto text-xs text-black/50 dark:text-white/40">Add the book name and your review.</span>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="theme-button-primary px-10 py-2.5 text-sm font-medium transition-all disabled:opacity-50"
          >
            Add Review
          </button>
        </div>
      </form>

      <section aria-labelledby="my-reviews" className="space-y-3">
        <h2 id="my-reviews" className="theme-label">
          Your reviews {hydrated && `(${reviews.length})`}
        </h2>

        {hydrated && reviews.length === 0 && (
          <p className="theme-card px-6 py-8 text-center text-sm text-black/60 dark:text-white/40">
            You haven’t reviewed any books yet.
          </p>
        )}

        {hydrated &&
          reviews.map((r) => (
            <article key={r.id} id={r.id} className="theme-card scroll-mt-24 space-y-3 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <BookMarked className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-black dark:text-white">{r.bookName}</h3>
                  <p className="text-xs text-black/60 dark:text-white/40">
                    {r.writer && <>by {r.writer} · </>}
                    {r.topic && <>{r.topic} · </>}
                    <time suppressHydrationWarning dateTime={r.createdAt}>{relativeTime(r.createdAt)}</time>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteBookReview(r.id)}
                  aria-label={`Delete review of ${r.bookName}`}
                  title="Delete review"
                  className="theme-button-secondary flex h-8 w-8 shrink-0 items-center justify-center"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="whitespace-pre-wrap text-sm leading-6 text-black/80 dark:text-white/75">{r.review}</p>

              {/* Love is the only reaction. */}
              <div className="flex items-center gap-2 border-t border-gray-200 pt-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => toggleLove(r.id)}
                  aria-pressed={r.loved}
                  aria-label={r.loved ? "Remove love" : "Love this review"}
                  title={r.loved ? "Remove love" : "Love"}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                    r.loved
                      ? "border-rose-500/40 bg-rose-500/10 text-rose-500"
                      : "border-gray-300 text-black/70 hover:bg-gray-100 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10",
                  )}
                >
                  <Heart className={cn("h-4 w-4", r.loved && "fill-current")} />
                  <span className="tabular-nums">{r.loved ? 1 : 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() => sharePost(shareItemFor(r), () => setSharing(r))}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-gray-300 px-4 text-sm font-medium text-black/70 transition-colors hover:bg-gray-100 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
            </article>
          ))}
      </section>

      {sharing && (
        <ShareDialog
          post={shareItemFor(sharing)}
          open
          onOpenChange={(open) => !open && setSharing(null)}
        />
      )}
    </ProfilePageShell>
  );
}
