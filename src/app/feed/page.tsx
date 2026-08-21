'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { TopBar } from '@/components/ui/TopBar';
import { Composer } from '@/components/feed/Composer';
import { PostItem } from '@/components/feed/PostItem';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Post } from '@/types';
import { INITIAL_POSTS } from '@/data/sample-posts';
import { fetchPosts } from '@/lib/api';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadPosts = useCallback(async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPosts(pageNum);
      setPosts((prev) => (pageNum === 1 ? data.posts : [...prev, ...data.posts]));
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err: any) {
      console.log('Using sample data - backend not available');
      // Keep sample data if API fails
      if (pageNum === 1) {
        setPosts(INITIAL_POSTS);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load initial posts
    loadPosts(1);
  }, [loadPosts]);

  const handlePostCreate = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const loadMore = () => {
    loadPosts(page + 1);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <TopBar />

        <main className="container max-w-2xl mx-auto px-4 py-6">
          <Composer onPostCreate={handlePostCreate} />

          {/* Loading State */}
          {loading && posts.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* Posts List */}
          {posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}

              {/* Load More Button */}
              {hasMore && !loading && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={loadMore}
                    className="px-6 py-2 rounded-md border border-border hover:bg-accent text-foreground"
                  >
                    Load more posts
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading More Indicator */}
          {loading && posts.length > 0 && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {posts.length === 0 && !loading && (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <h3 className="text-lg font-semibold text-foreground">
                No posts yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to share an educational update or material!
              </p>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}