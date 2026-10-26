"use client";

import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import type { PostAttachment } from "@/interfaces/feed.interface";
import { attachmentKind, formatBytes, loadFile } from "@/lib/profile/attachments";
import { cn } from "@/lib/utils";

/** Loads a stored attachment and exposes it as a temporary object URL (revoked on cleanup). */
function useAttachmentUrl(id: string) {
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;
    loadFile(id)
      .then((blob) => {
        if (cancelled) return;
        if (!blob) {
          setMissing(true);
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setMissing(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  return { url, missing };
}

function Unavailable({ name }: { name: string }) {
  return (
    <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-gray-300 px-3 text-center text-xs text-black/50 dark:border-white/15 dark:text-white/40">
      {name} isn’t available in this browser
    </div>
  );
}

function MediaItem({ attachment, single }: { attachment: PostAttachment; single: boolean }) {
  const { url, missing } = useAttachmentUrl(attachment.id);
  const kind = attachmentKind(attachment.type);

  if (missing) return <Unavailable name={attachment.name} />;
  if (!url) {
    return <div className="aspect-video animate-pulse rounded-xl bg-gray-200 dark:bg-white/10" aria-hidden />;
  }

  const frame = cn("w-full rounded-xl bg-black/5 object-contain dark:bg-white/5", single ? "max-h-96" : "aspect-video object-cover");
  return kind === "image" ? (
    // Blob URLs can't go through next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={attachment.name} className={frame} loading="lazy" decoding="async" />
  ) : (
    <video src={url} controls preload="metadata" playsInline aria-label={attachment.name} className={cn(frame, "bg-black")} />
  );
}

function FileItem({ attachment }: { attachment: PostAttachment }) {
  const { url, missing } = useAttachmentUrl(attachment.id);

  return (
    <a
      href={url ?? undefined}
      download={attachment.name}
      aria-disabled={!url}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm dark:border-white/10 dark:bg-white/5",
        url ? "hover:bg-gray-100 dark:hover:bg-white/10" : "pointer-events-none opacity-60",
      )}
    >
      <FileText className="h-4 w-4 shrink-0 text-black/60 dark:text-white/50" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-black dark:text-white">{attachment.name}</span>
        <span className="block text-xs text-black/50 dark:text-white/40">
          {missing ? "Not available in this browser" : formatBytes(attachment.size)}
        </span>
      </span>
      {url && <Download className="h-4 w-4 shrink-0 text-black/60 dark:text-white/50" />}
    </a>
  );
}

/** Photos and videos in a grid, other files as download rows. */
export function PostAttachments({ attachments }: { attachments: PostAttachment[] }) {
  const media = attachments.filter((a) => attachmentKind(a.type) !== "file");
  const files = attachments.filter((a) => attachmentKind(a.type) === "file");
  if (attachments.length === 0) return null;

  return (
    <div className="space-y-2">
      {media.length > 0 && (
        <div className={cn("grid gap-2", media.length > 1 && "grid-cols-2")}>
          {media.map((a) => (
            <MediaItem key={a.id} attachment={a} single={media.length === 1} />
          ))}
        </div>
      )}
      {files.map((a) => (
        <FileItem key={a.id} attachment={a} />
      ))}
    </div>
  );
}
