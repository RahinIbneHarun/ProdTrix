"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, FileText, Paperclip, Play, Trash2, X } from "lucide-react";
import { PostAttachments } from "@/components/profile/PostAttachments";
import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import type { ContentCategory, ProfilePost } from "@/interfaces/feed.interface";
import { relativeTime } from "@/lib/feed/utils";
import { useFeedHydrated } from "@/lib/feed/use-feed-hydrated";
import {
  ATTACHMENT_ACCEPT,
  MAX_ATTACHMENTS,
  MAX_ATTACHMENT_BYTES,
  deleteFiles,
  fileKind,
  formatBytes,
  isAllowedFile,
  saveFiles,
  toAttachment,
} from "@/lib/profile/attachments";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";

const fieldCls =
  "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:placeholder:text-white/25";

const EMPTY = { title: "", category: "academic" as ContentCategory, subject: "", chapter: "", topic: "", body: "" };

const MAX_TITLE = 80;

/** A file the user picked but hasn't posted yet. */
type PendingFile = { id: string; file: File; previewUrl: string | null };

// crypto.randomUUID needs a secure context; fall back so the page also works over plain http.
const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

/**
 * A post needs a title, but people shouldn't have to invent one. If none was typed we use the first
 * line of the text (the rest becomes the body), then the first file's name, then a generic fallback.
 */
function titleAndBody(typedTitle: string, rawBody: string, files: PendingFile[]) {
  const body = rawBody.trim();
  const title = typedTitle.trim();
  if (title) return { title, body };

  const [firstLine = "", ...rest] = body.split(/\r?\n/);
  const first = firstLine.trim();
  if (first) {
    return first.length <= MAX_TITLE
      ? { title: first, body: rest.join("\n").trim() }
      : { title: `${first.slice(0, MAX_TITLE).trimEnd()}…`, body };
  }
  const fileName = files[0]?.file.name.replace(/\.[^.]+$/, "").trim();
  return { title: fileName || "New post", body };
}

export default function ProfileAddPostPage() {
  const hydrated = useFeedHydrated();
  const myPosts = useFeedStore((s) => s.myPosts);
  const addMyPost = useFeedStore((s) => s.addMyPost);
  const deleteMyPost = useFeedStore((s) => s.deleteMyPost);
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Release preview object URLs when leaving the page.
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(
    () => () => filesRef.current.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl)),
    [],
  );

  const set =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setAdded(false);
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const addFiles = (incoming: File[]) => {
    setAdded(false);
    const problems: string[] = [];
    const accepted: PendingFile[] = [];
    for (const file of incoming) {
      if (files.length + accepted.length >= MAX_ATTACHMENTS) {
        problems.push(`You can attach up to ${MAX_ATTACHMENTS} files per post.`);
        break;
      }
      if (!isAllowedFile(file)) {
        problems.push(`${file.name}: this file type isn’t supported.`);
        continue;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        problems.push(`${file.name}: larger than ${formatBytes(MAX_ATTACHMENT_BYTES)}.`);
        continue;
      }
      accepted.push({
        id: newId(),
        file,
        previewUrl: fileKind(file) === "file" ? null : URL.createObjectURL(file),
      });
    }
    if (accepted.length) setFiles((prev) => [...prev, ...accepted]);
    setError(problems.length ? problems.join(" ") : null);
  };

  const removePending = (id: string) => {
    setError(null);
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Text or at least one file is enough; everything else is optional.
  const canSubmit = Boolean(form.body.trim() || files.length > 0) && !saving;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    try {
      // Files first (all-or-nothing), then the post that points at them.
      if (files.length) await saveFiles(files.map(({ id, file }) => ({ id, file })));
      const { title, body } = titleAndBody(form.title, form.body, files);
      addMyPost({
        title,
        body,
        category: form.category,
        subject: form.subject.trim() || "General",
        chapter: form.chapter.trim(),
        topic: form.topic.trim(),
        coverUrl: "",
        attachments: files.map(({ id, file }) => toAttachment(id, file)),
      });
      files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
      setFiles([]);
      setForm(EMPTY);
      setAdded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t save the attachments.");
    } finally {
      setSaving(false);
    }
  };

  const removePost = (post: ProfilePost) => {
    deleteMyPost(post.id);
    deleteFiles((post.attachments ?? []).map((a) => a.id)).catch(() => {});
  };

  return (
    <ProfilePageShell title="Add Post" description="Share something with your profile and the feed.">
      <form onSubmit={submit} className="theme-card space-y-4 p-6">
        {/* ── 1. What to say ── */}
        <div className="space-y-1.5">
          <label htmlFor="ap-body" className="theme-label">What do you want to share?</label>
          <textarea
            id="ap-body"
            value={form.body}
            onChange={set("body")}
            rows={5}
            maxLength={5000}
            placeholder="Write something…"
            className={`${fieldCls} resize-y`}
          />
        </div>

        {/* ── 2. Photos, videos & files ── */}
        <div className="space-y-3">
          <label
            htmlFor="ap-files"
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(Array.from(e.dataTransfer.files));
            }}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500/40",
              dragging
                ? "border-blue-500 bg-blue-500/5"
                : "border-gray-300 hover:bg-gray-50 dark:border-white/15 dark:hover:bg-white/5",
            )}
          >
            <Paperclip className="h-5 w-5 shrink-0 text-black/60 dark:text-white/50" />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-black dark:text-white">Add photos, videos or files</span>
              <span className="block text-xs text-black/50 dark:text-white/40">
                Click here or drag them in · up to {MAX_ATTACHMENTS} files, {formatBytes(MAX_ATTACHMENT_BYTES)} each
              </span>
            </span>
            <input
              id="ap-files"
              type="file"
              multiple
              accept={ATTACHMENT_ACCEPT}
              className="sr-only"
              onChange={(e) => {
                addFiles(Array.from(e.target.files ?? []));
                e.target.value = ""; // allow picking the same file again
              }}
            />
          </label>

          {files.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Files to attach">
              {files.map(({ id, file, previewUrl }) => {
                const kind = fileKind(file);
                return (
                  <li key={id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
                    {kind === "image" && previewUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl} alt={file.name} decoding="async" className="aspect-square w-full object-cover" />
                    )}
                    {kind === "video" && previewUrl && (
                      <div className="relative">
                        <video src={`${previewUrl}#t=0.1`} muted playsInline preload="metadata" className="aspect-square w-full bg-black object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white">
                            <Play className="h-4 w-4" />
                          </span>
                        </span>
                      </div>
                    )}
                    {kind === "file" && (
                      <div className="flex aspect-square items-center justify-center">
                        <FileText className="h-8 w-8 text-black/50 dark:text-white/40" />
                      </div>
                    )}
                    <p className="truncate px-2 py-1.5 text-[11px] text-black/70 dark:text-white/60" title={file.name}>
                      {file.name} · {formatBytes(file.size)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removePending(id)}
                      aria-label={`Remove ${file.name}`}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white hover:bg-black/85"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
        </div>

        {/* ── 3. Optional details, hidden until asked for ── */}
        <details className="group rounded-xl border border-gray-200 dark:border-white/10">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-black dark:text-white [&::-webkit-details-marker]:hidden">
            <span>
              Add details <span className="font-normal text-black/50 dark:text-white/40">(optional)</span>
            </span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-4 border-t border-gray-200 px-4 py-4 dark:border-white/10">
            <div className="space-y-1.5">
              <label htmlFor="ap-title" className="theme-label">Title</label>
              <input id="ap-title" value={form.title} onChange={set("title")} maxLength={120} placeholder="We’ll use the first line of your text if you leave this empty" className={fieldCls} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="ap-category" className="theme-label">Type</label>
                <select id="ap-category" value={form.category} onChange={set("category")} className={fieldCls}>
                  <option value="academic">Academic</option>
                  <option value="non-academic">Non Academic</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ap-subject" className="theme-label">Subject</label>
                <input id="ap-subject" value={form.subject} onChange={set("subject")} placeholder="e.g. Mathematics" className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ap-chapter" className="theme-label">Chapter</label>
                <input id="ap-chapter" value={form.chapter} onChange={set("chapter")} placeholder="e.g. Matrices" className={fieldCls} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ap-topic" className="theme-label">Topic</label>
                <input id="ap-topic" value={form.topic} onChange={set("topic")} placeholder="e.g. Matrix multiplication" className={fieldCls} />
              </div>
            </div>
          </div>
        </details>

        {/* ── 4. Post ── */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
          {added && (
            <span role="status" className="mr-auto inline-flex items-center gap-1.5 text-sm text-emerald-500 dark:text-emerald-400">
              <Check className="h-4 w-4" /> Posted! You can see it on your profile and in the feed.
            </span>
          )}
          {!added && !canSubmit && !saving && (
            <span className="mr-auto text-xs text-black/50 dark:text-white/40">Write something or add a photo to post.</span>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="theme-button-primary px-10 py-2.5 text-sm font-medium transition-all disabled:opacity-50"
          >
            {saving ? "Posting…" : "Post"}
          </button>
        </div>
      </form>

      <section aria-labelledby="my-posts" className="space-y-3">
        <h2 id="my-posts" className="theme-label">
          Your posts {hydrated && `(${myPosts.length})`}
        </h2>
        {hydrated && myPosts.length === 0 && (
          <p className="theme-card px-6 py-8 text-center text-sm text-black/60 dark:text-white/40">
            You haven’t added any posts yet.
          </p>
        )}
        {hydrated &&
          myPosts.map((p) => (
            <article key={p.id} className="theme-card space-y-3 p-5">
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="truncate text-sm font-semibold text-black dark:text-white">{p.title}</h3>
                  <p className="text-xs text-black/60 dark:text-white/40">
                    {[p.category === "academic" ? "Academic" : "Non Academic", p.subject, p.chapter, p.topic]
                      .filter(Boolean)
                      .join(" · ")}{" "}
                    · <time suppressHydrationWarning dateTime={p.createdAt}>{relativeTime(p.createdAt)}</time>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removePost(p)}
                  aria-label={`Delete ${p.title}`}
                  title="Delete post"
                  className="theme-button-secondary flex h-8 w-8 shrink-0 items-center justify-center"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              {p.body && <p className="whitespace-pre-wrap text-sm text-black/80 dark:text-white/70">{p.body}</p>}
              <PostAttachments attachments={p.attachments ?? []} />
            </article>
          ))}
      </section>
    </ProfilePageShell>
  );
}
