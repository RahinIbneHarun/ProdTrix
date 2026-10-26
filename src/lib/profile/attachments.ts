import type { PostAttachment } from "@/interfaces/feed.interface";

/** Photos and videos are shown inline; everything else is a downloadable file. */
export type AttachmentKind = "image" | "video" | "file";

export const MAX_ATTACHMENTS = 8;
export const MAX_ATTACHMENT_BYTES = 50 * 1024 * 1024; // 50 MB per file

// Photos and videos the browser can actually display (HEIC and similar can't, so they aren't offered).
const IMAGE_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
};
const VIDEO_MIME: Record<string, string> = {
  mp4: "video/mp4",
  m4v: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  ogv: "video/ogg",
};
const FILE_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "csv", "txt", "zip"];

/**
 * Value for <input accept>. It is a short list of exact extensions on purpose: wildcards such as
 * "image/*,video/*" make Chrome expand every known MIME type into a very long filter, which can
 * freeze the Windows file dialog in big folders (e.g. Pictures).
 */
export const ATTACHMENT_ACCEPT = [...Object.keys(IMAGE_MIME), ...Object.keys(VIDEO_MIME), ...FILE_EXTENSIONS]
  .map((e) => `.${e}`)
  .join(",");

export function attachmentKind(type: string): AttachmentKind {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  return "file";
}

const extensionOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

/** The file's MIME type, falling back to its extension when the OS didn't supply one. */
const mimeOf = (file: File) => file.type || IMAGE_MIME[extensionOf(file.name)] || VIDEO_MIME[extensionOf(file.name)] || "";

export const fileKind = (file: File): AttachmentKind => attachmentKind(mimeOf(file));

export function isAllowedFile(file: File): boolean {
  const ext = extensionOf(file.name);
  switch (fileKind(file)) {
    case "image":
      return ext in IMAGE_MIME;
    case "video":
      return ext in VIDEO_MIME;
    default:
      return FILE_EXTENSIONS.includes(ext);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const toAttachment = (id: string, file: File): PostAttachment => ({
  id,
  name: file.name,
  type: mimeOf(file) || "application/octet-stream",
  size: file.size,
});

// ── IndexedDB storage for the file bytes ──────────────────────────────────────
// localStorage is far too small for photos and videos, so the files themselves
// are kept in IndexedDB and only their metadata is saved with the post.

const DB_NAME = "prodtrix-attachments";
const STORE = "files";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("This browser can't store attachments."));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Couldn't open attachment storage."));
  });
}

async function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>[]): Promise<T[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const requests = work(tx.objectStore(STORE));
    tx.oncomplete = () => {
      db.close();
      resolve(requests.map((r) => r.result));
    };
    const fail = () => {
      db.close();
      reject(tx.error ?? new Error("Couldn't save the attachments (storage may be full)."));
    };
    tx.onerror = fail;
    tx.onabort = fail;
  });
}

/** Saves all files in one transaction, so either every file is stored or none are. */
export async function saveFiles(entries: { id: string; file: File }[]): Promise<void> {
  await run("readwrite", (store) => entries.map(({ id, file }) => store.put(file, id)));
}

export async function loadFile(id: string): Promise<Blob | undefined> {
  const [blob] = await run<Blob | undefined>("readonly", (store) => [store.get(id)]);
  return blob;
}

export async function deleteFiles(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await run("readwrite", (store) => ids.map((id) => store.delete(id)));
}
