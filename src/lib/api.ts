import { Post, PostComment } from "@/types";

const API_BASE = "/backend-api";
const TIMEOUT = 3000; // 3 seconds timeout

// Helper function to check if API is available
async function isApiAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(`${API_BASE}/health`, {
      signal: controller.signal,
      credentials: "include",
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// Helper function for fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchPosts(
  page: number = 1,
  limit: number = 10,
): Promise<{ posts: Post[]; hasMore: boolean }> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/posts?page=${page}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    return await response.json();
  } catch (error) {
    console.log("Backend not available, using local data");
    throw error;
  }
}

export async function createPost(data: {
  content: string;
  topicName: string;
  className: string;
  chapter: string;
}): Promise<Post> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create post");
    }

    return await response.json();
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout - backend not available");
    }
    throw error;
  }
}

export async function likePost(
  postId: string,
  isLiked: boolean,
): Promise<void> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/posts/${postId}/like`,
      {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update like status");
    }
  } catch (error: any) {
    // Silently fail if backend is not available
    console.log(
      "Like operation failed (backend not available):",
      error.message,
    );
    // Don't throw error - let the component handle optimistic updates
  }
}

export async function addComment(
  postId: string,
  text: string,
): Promise<PostComment> {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE}/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to add comment");
    }

    return await response.json();
  } catch (error: any) {
    // Return a local comment if backend is not available
    console.log(
      "Comment operation failed (backend not available):",
      error.message,
    );
    return {
      id: `comment-${Date.now()}`,
      authorName: "You",
      text: text,
      createdAt: new Date().toISOString(),
    };
  }
}

// Add a health check endpoint
export async function checkBackendHealth(): Promise<boolean> {
  return isApiAvailable();
}
