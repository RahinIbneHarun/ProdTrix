import { Post } from "@/types";

export const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    author: {
      id: "usr-1",
      name: "Alex Johnson",
      status: "Senior Mathematics Student",
      isVerified: true,
    },
    academicMeta: {
      topicName: "Linear Algebra",
      className: "Class 12",
      chapter: "Chapter 3: Matrices & Determinants",
    },
    content:
      "Here is a quick summary cheat sheet on matrix multiplication and determinant properties. Hope this helps everyone preparing for exams!",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    likesCount: 34,
    commentsCount: 1,
    sharesCount: 5,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    comments: [
      {
        id: "c-1",
        authorName: "Maria Garcia",
        text: "Great breakdown! Thanks for sharing.",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      },
    ],
  },
  {
    id: "post-2",
    author: {
      id: "usr-2",
      name: "Dr. Robert Smith",
      status: "Computer Science Instructor",
      isVerified: true,
    },
    academicMeta: {
      topicName: "Data Structures",
      className: "Undergraduate",
      chapter: "Chapter 5: Binary Search Trees",
    },
    content:
      "Understanding tree traversals (In-order, Pre-order, Post-order). Remember that In-order traversal on a BST yields sorted elements.",
    likesCount: 88,
    commentsCount: 0,
    sharesCount: 12,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
];
