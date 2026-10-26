import { CURRENT_USER_ID } from "@/data/feed-data";
import type { FeedPost, ProfilePost } from "@/interfaces/feed.interface";

const EXCERPT_LENGTH = 220;

/** Turns a post written on the profile into the shape the feed renders. */
export function profilePostToFeedPost(p: ProfilePost): FeedPost {
  const body = p.body.trim();
  return {
    id: p.id,
    creatorId: CURRENT_USER_ID,
    category: p.category,
    subject: p.subject || "General",
    chapter: p.chapter,
    topic: p.topic,
    title: p.title,
    excerpt: body.length > EXCERPT_LENGTH ? `${body.slice(0, EXCERPT_LENGTH).trimEnd()}…` : body,
    body,
    coverUrl: p.coverUrl,
    coverAspect: "16:9",
    reactions: { gold: 0, diamond: 0, clap: 0, sad: 0 },
    versions: [
      { version: 1, editedAt: p.createdAt, note: "Initial publish" },
      ...(p.editedAt ? [{ version: 2, editedAt: p.editedAt, note: "Edited by the author" }] : []),
    ],
    insights: { viewCount: 0, cumulativeSeconds: 0, uniqueViewers: 0 },
    attachments: p.attachments,
    createdAt: p.createdAt,
  };
}
