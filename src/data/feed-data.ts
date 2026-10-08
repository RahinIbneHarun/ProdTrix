import type {
  FeedComment,
  FeedCreator,
  FeedNotification,
  FeedPost,
} from "@/interfaces/feed.interface";

// Demo dataset used until the feed backend is available.

export const CURRENT_USER_ID = "me";

export const CREATORS: FeedCreator[] = [
  {
    id: "c-ayesha",
    name: "Ayesha Rahman",
    handle: "ayesha.math",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    headline: "Mathematics educator · Class 11–12",
    verified: true,
    birthday: "09-27",
  },
  {
    id: "c-tanvir",
    name: "Tanvir Hasan",
    handle: "tanvir.physics",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    headline: "Physics simulations & lab notes",
    verified: true,
  },
  {
    id: "c-nusrat",
    name: "Nusrat Jahan",
    handle: "nusrat.bio",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    headline: "Biology · Interactive diagrams",
    verified: false,
    birthday: "09-26",
  },
  {
    id: "c-robert",
    name: "Dr. Robert Smith",
    handle: "rsmith.cs",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    headline: "Computer Science instructor",
    verified: true,
  },
  {
    id: "c-mitu",
    name: "Mitu Akter",
    handle: "mitu.cooks",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
    headline: "Food science & everyday recipes",
    verified: false,
  },
  {
    id: "c-farhan",
    name: "Farhan Kabir",
    handle: "farhan.econ",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    headline: "Economics explained simply",
    verified: false,
  },
  {
    id: "c-ayasha-malik",
    name: "Ayasha Malik",
    handle: "ayasha.malik",
    headline: "Full-stack developer · Web Development",
    verified: true,
  },
  {
    id: "c-lucas-fernandes",
    name: "Lucas Fernandes",
    handle: "lucas.dev",
    headline: "Frontend engineer · UI / UX",
    verified: false,
  },
  {
    id: "c-meera-krishnan",
    name: "Meera Krishnan",
    handle: "meera.k",
    headline: "Backend engineer · Databases",
    verified: true,
  },
  {
    id: "c-priya-nair",
    name: "Priya Nair",
    handle: "priya.nair",
    headline: "Learner · System Design",
    verified: false,
  },
  {
    id: "c-jinho-yoon",
    name: "Jin-ho Yoon",
    handle: "jinho.yoon",
    headline: "Software architect · System Design",
    verified: true,
  },
  {
    id: "c-tomas-rivera",
    name: "Tomás Rivera",
    handle: "tomas.rivera",
    headline: "DevOps engineer · Cloud & CI/CD",
    verified: true,
  },
  {
    id: "c-sofia-ahmed",
    name: "Sofía Ahmed",
    handle: "sofia.ahmed",
    headline: "Programming instructor",
    verified: false,
  },
  {
    id: "c-daniel-park",
    name: "Daniel Park",
    handle: "daniel.park",
    headline: "Product designer · UI / UX",
    verified: false,
  },
];

export const INITIAL_FOLLOWING = ["c-ayesha", "c-tanvir", "c-robert"];

export const INITIAL_NEW_POST_COUNTS: Record<string, number> = {
  "c-ayesha": 2,
  "c-tanvir": 1,
  "c-robert": 0,
};

export const FEED_POSTS: FeedPost[] = [
  {
    id: "p-matrix",
    creatorId: "c-ayesha",
    category: "academic",
    subject: "Mathematics",
    chapter: "Matrices & Determinants",
    topic: "Matrix Multiplication",
    title: "Visualising matrix multiplication as a transformation",
    excerpt:
      "Drag the basis vectors and watch how a 2×2 matrix reshapes the whole grid — the fastest way to build intuition before exams.",
    body: "Matrix multiplication is composition of linear transformations. In this interactive, each column of the matrix tells you where a basis vector lands. Move î and ĵ and observe how the determinant equals the signed area of the transformed unit square. When the determinant is zero, the plane collapses onto a line — which is exactly why such a matrix has no inverse.",
    coverUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    coverAspect: "16:9",
    reactions: { gold: 42, diamond: 18, clap: 67, tasty: 5 },
    versions: [
      { version: 1, editedAt: "2026-09-10T09:00:00.000Z", note: "Initial publish" },
      { version: 2, editedAt: "2026-09-18T14:20:00.000Z", note: "Added determinant area overlay" },
      { version: 3, editedAt: "2026-09-25T08:45:00.000Z", note: "Fixed inverse example and added quiz" },
    ],
    insights: { viewCount: 1840, cumulativeSeconds: 331200, uniqueViewers: 1210 },
    createdAt: "2026-09-25T08:45:00.000Z",
  },
  {
    id: "p-projectile",
    creatorId: "c-tanvir",
    category: "academic",
    subject: "Physics",
    chapter: "Kinematics",
    topic: "Projectile Motion",
    title: "Projectile motion simulator with air resistance toggle",
    excerpt:
      "Change launch angle, speed and drag. See why 45° is only optimal in a vacuum.",
    body: "Set the launch angle and initial velocity, then toggle air resistance. Without drag the range is maximised at 45°. With drag, the optimal angle drops — the simulation plots both trajectories side by side so you can compare horizontal range and time of flight.",
    coverUrl:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1200&q=80",
    coverAspect: "16:9",
    reactions: { gold: 31, diamond: 25, clap: 40, tasty: 2 },
    versions: [
      { version: 1, editedAt: "2026-09-20T11:00:00.000Z", note: "Initial publish" },
      { version: 2, editedAt: "2026-09-24T16:10:00.000Z", note: "Added air-resistance model" },
    ],
    insights: { viewCount: 960, cumulativeSeconds: 201600, uniqueViewers: 702 },
    createdAt: "2026-09-24T16:10:00.000Z",
  },
  {
    id: "p-cell",
    creatorId: "c-nusrat",
    category: "academic",
    subject: "Biology",
    chapter: "Cell Biology",
    topic: "Organelles",
    title: "Tap-to-explore animal cell",
    excerpt:
      "Every organelle is clickable with a 30-second explainer. Great for last-minute revision.",
    body: "Tap the nucleus, mitochondria, ribosomes, Golgi apparatus and more. Each organelle opens a short explainer with its function and a memory hook. The quiz mode hides the labels so you can test yourself.",
    coverUrl:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80",
    coverAspect: "4:3",
    reactions: { gold: 12, diamond: 9, clap: 28, tasty: 1 },
    versions: [
      { version: 1, editedAt: "2026-09-23T07:30:00.000Z", note: "Initial publish" },
    ],
    insights: { viewCount: 410, cumulativeSeconds: 49200, uniqueViewers: 355 },
    createdAt: "2026-09-23T07:30:00.000Z",
  },
  {
    id: "p-bst",
    creatorId: "c-robert",
    category: "academic",
    subject: "Computer Science",
    chapter: "Binary Search Trees",
    topic: "Tree Traversals",
    title: "Step through in-order, pre-order and post-order traversals",
    excerpt:
      "Insert your own keys and watch each traversal animate node by node.",
    body: "In-order traversal of a BST yields the keys in sorted order. Pre-order is useful for copying a tree, post-order for deleting one. Insert your own keys, pick a traversal, and step through the recursion stack as it unwinds.",
    coverUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    coverAspect: "16:9",
    reactions: { gold: 55, diamond: 34, clap: 88, tasty: 3 },
    versions: [
      { version: 1, editedAt: "2026-09-12T10:00:00.000Z", note: "Initial publish" },
      { version: 2, editedAt: "2026-09-22T12:00:00.000Z", note: "Added recursion stack panel" },
    ],
    insights: { viewCount: 2310, cumulativeSeconds: 462000, uniqueViewers: 1604 },
    createdAt: "2026-09-22T12:00:00.000Z",
  },
  {
    id: "p-bread",
    creatorId: "c-mitu",
    category: "non-academic",
    subject: "Food Science",
    chapter: "Fermentation",
    topic: "Sourdough Starter",
    title: "The chemistry of a sourdough starter, day by day",
    excerpt:
      "Why your starter smells like acetone on day 3 — and why that's fine.",
    body: "Wild yeast and lactic acid bacteria compete in the first week. The acetone smell is a sign of hungry yeast. This guide tracks pH, rise height and aroma across seven days with a feeding schedule you can follow.",
    coverUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    coverAspect: "4:3",
    reactions: { gold: 8, diamond: 4, clap: 19, tasty: 76 },
    versions: [
      { version: 1, editedAt: "2026-09-21T18:00:00.000Z", note: "Initial publish" },
    ],
    insights: { viewCount: 530, cumulativeSeconds: 58300, uniqueViewers: 488 },
    createdAt: "2026-09-21T18:00:00.000Z",
  },
  {
    id: "p-supply",
    creatorId: "c-farhan",
    category: "academic",
    subject: "Economics",
    chapter: "Market Equilibrium",
    topic: "Supply & Demand Shifts",
    title: "Shift the curves: an interactive market equilibrium",
    excerpt:
      "Drag supply and demand curves and see price and quantity update instantly.",
    body: "Drag the demand curve right to model a rise in income, or shift supply left to model a poor harvest. The equilibrium price and quantity update live, along with consumer and producer surplus.",
    coverUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    coverAspect: "16:9",
    reactions: { gold: 15, diamond: 6, clap: 22, tasty: 0 },
    versions: [
      { version: 1, editedAt: "2026-09-15T09:00:00.000Z", note: "Initial publish" },
      { version: 2, editedAt: "2026-09-17T09:00:00.000Z", note: "Added surplus shading" },
      { version: 3, editedAt: "2026-09-19T15:00:00.000Z", note: "Tax wedge scenario" },
      { version: 4, editedAt: "2026-09-20T15:00:00.000Z", note: "Copy edits" },
    ],
    insights: { viewCount: 720, cumulativeSeconds: 93600, uniqueViewers: 590 },
    createdAt: "2026-09-20T15:00:00.000Z",
  },
  {
    id: "p-limits",
    creatorId: "c-ayesha",
    category: "academic",
    subject: "Mathematics",
    chapter: "Limits & Continuity",
    topic: "Epsilon–Delta",
    title: "Epsilon–delta, finally explained with a slider",
    excerpt:
      "Shrink ε and watch the δ-window follow. The definition clicks in two minutes.",
    body: "The epsilon–delta definition says: for every tolerance ε around L, there is a window δ around a such that f stays inside the tolerance. Shrink ε with the slider and the tool finds the largest valid δ for you.",
    coverUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
    coverAspect: "16:9",
    reactions: { gold: 20, diamond: 11, clap: 30, tasty: 0 },
    versions: [
      { version: 1, editedAt: "2026-09-26T06:00:00.000Z", note: "Initial publish" },
    ],
    insights: { viewCount: 140, cumulativeSeconds: 19600, uniqueViewers: 131 },
    createdAt: "2026-09-26T06:00:00.000Z",
  },
];

export const INITIAL_NOTIFICATIONS: FeedNotification[] = [
  {
    id: "n-1",
    kind: "new-content",
    actorId: "c-ayesha",
    postId: "p-limits",
    message: "published “Epsilon–delta, finally explained with a slider”",
    createdAt: "2026-09-26T06:00:00.000Z",
    read: false,
  },
  {
    id: "n-2",
    kind: "reaction",
    actorId: "c-tanvir",
    postId: "p-matrix",
    message: "reacted 💎 Diamond to a post you saved",
    createdAt: "2026-09-25T20:15:00.000Z",
    read: false,
  },
  {
    id: "n-3",
    kind: "reply",
    actorId: "c-robert",
    postId: "p-bst",
    message: "replied to your question on “Tree Traversals”",
    createdAt: "2026-09-25T11:02:00.000Z",
    read: false,
  },
  {
    id: "n-4",
    kind: "system",
    message: "Verified creator applications are now open. Apply from the menu.",
    createdAt: "2026-09-24T09:00:00.000Z",
    read: true,
  },
];

export const SAMPLE_COMMENTS: FeedComment[] = [
  {
    id: "cm-1",
    postId: "p-matrix",
    authorId: "c-tanvir",
    authorName: "Tanvir Hasan",
    text: "The determinant-as-area overlay is brilliant. Using this with my Class 12 group tomorrow.",
    createdAt: "2026-09-25T10:12:00.000Z",
  },
  {
    id: "cm-2",
    postId: "p-matrix",
    authorId: "c-nusrat",
    authorName: "Nusrat Jahan",
    text: "Could you add a 3×3 version in v4?",
    createdAt: "2026-09-25T13:40:00.000Z",
  },
  {
    id: "cm-3",
    postId: "p-bst",
    authorId: "c-ayesha",
    authorName: "Ayesha Rahman",
    text: "The recursion stack panel finally made post-order click for my students.",
    createdAt: "2026-09-22T15:05:00.000Z",
  },
  {
    id: "cm-4",
    postId: "p-projectile",
    authorId: "c-robert",
    authorName: "Dr. Robert Smith",
    text: "Nice drag model. Would love a slider for the drag coefficient.",
    createdAt: "2026-09-24T18:30:00.000Z",
  },
];

export const SUGGESTED_FRIENDS = ["c-nusrat", "c-mitu", "c-farhan"];
export const INCOMING_REQUESTS = ["c-farhan"];

export function getCreator(id: string): FeedCreator | undefined {
  return CREATORS.find((c) => c.id === id);
}

export function getPost(id: string): FeedPost | undefined {
  return FEED_POSTS.find((p) => p.id === id);
}
