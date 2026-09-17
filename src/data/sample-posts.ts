import { Post } from "@/types";

export const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    author: {
      id: "u1",
      name: "Ayasha Malik",
      role: "Full Stack Engineer",
      avatar: "https://i.pravatar.cc/80?img=47",
    },
    title: "Async/Await & Promises",
    content:
      "Mastering asynchronous JavaScript is the key to writing non-blocking, performant web apps. This lesson breaks down how Promises chain and how async/await simplifies the syntax.",
    timeAgo: "2h ago",
    likes: 214,
    commentsCount: 31,
    shares: 18,
    views: 4200,
    media: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
      title: "Async/Await & Promises",
    },
    academicMeta: {
      topic: "Web Development Fundamentals",
      class: "Ch. 3 · JavaScript Essentials",
      chapter: "Lesson 7 · Async/Await & Promises",
    },
  },
  {
    id: "2",
    author: {
      id: "u2",
      name: "Tomás Rivera",
      role: "UX Researcher",
      avatar: "https://i.pravatar.cc/80?img=15",
    },
    title: "Hick's Law in Interface Design",
    content:
      "The time it takes to make a decision increases with the number and complexity of choices. Here's how I apply Hick's Law when designing navigation menus.",
    timeAgo: "5h ago",
    likes: 128,
    commentsCount: 14,
    shares: 9,
    views: 2100,
    media: {
      url: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200",
      title: "Hick's Law in Interface Design",
    },
    academicMeta: {
      topic: "UX Design Principles",
      class: "Ch. 5 · Cognitive Load",
      chapter: "Lesson 2 · Hick's Law in Interface Design",
    },
  },
];
