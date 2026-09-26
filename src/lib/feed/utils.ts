import type { FeedFilters, FeedPost } from "@/interfaces/feed.interface";
import { EMPTY_FILTERS } from "@/interfaces/feed.interface";

export function currentVersion(post: FeedPost) {
  return post.versions[post.versions.length - 1];
}

export function formatDuration(totalSeconds: number) {
  const s = Math.round(totalSeconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h.toLocaleString()}h ${m % 60}m`;
}

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(n);
}

export function relativeTime(iso: string, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function filtersFromParams(params: URLSearchParams): FeedFilters {
  const f = { ...EMPTY_FILTERS };
  for (const key of Object.keys(f) as (keyof FeedFilters)[]) {
    const v = params.get(key);
    if (v) (f as Record<string, string>)[key] = v;
  }
  return f;
}

export function filtersToQuery(f: Partial<FeedFilters>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v) params.set(k, v);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function activeFilterCount(f: FeedFilters) {
  return (["category", "subject", "chapter", "topic", "version", "from", "to", "creator"] as const)
    .filter((k) => f[k]).length;
}

export function matchesFilters(post: FeedPost, f: FeedFilters, creatorName = "") {
  if (f.creator && post.creatorId !== f.creator) return false;
  if (f.category && post.category !== f.category) return false;
  if (f.subject && post.subject !== f.subject) return false;
  if (f.chapter && post.chapter !== f.chapter) return false;
  if (f.topic && post.topic !== f.topic) return false;
  if (f.version) {
    const v = currentVersion(post).version;
    if (f.version.endsWith("+") ? v < parseInt(f.version) : v !== parseInt(f.version)) return false;
  }
  const created = post.createdAt.slice(0, 10);
  if (f.from && created < f.from) return false;
  if (f.to && created > f.to) return false;
  if (f.q) {
    const hay = [post.title, post.excerpt, post.subject, post.chapter, post.topic, creatorName]
      .join(" ")
      .toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).every((term) => hay.includes(term))) return false;
  }
  return true;
}

/** Recency first, nudged by the user's Interested / Not Interested signals. */
export function rankPosts(
  posts: FeedPost[],
  topicAffinity: Record<string, number>,
  creatorAffinity: Record<string, number>,
) {
  const DAY = 86_400_000;
  const score = (p: FeedPost) =>
    new Date(p.createdAt).getTime() / DAY +
    (topicAffinity[p.topic] ?? 0) +
    (creatorAffinity[p.creatorId] ?? 0);
  return [...posts].sort((a, b) => score(b) - score(a));
}

export function uniqueValues<T>(items: T[], pick: (t: T) => string) {
  return Array.from(new Set(items.map(pick))).sort();
}
