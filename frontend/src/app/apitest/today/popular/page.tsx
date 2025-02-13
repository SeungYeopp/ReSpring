"use client"

import { useEffect, useState } from "react";
import { getPopularPosts, Post } from "@/lib/api"; // 실제 API 파일 경로로 수정하세요.

export default function PopularPostsPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPopularPosts();
        setPosts(data);
      } catch (err) {
        setError("Failed to fetch popular posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Loading popular posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Popular Posts</h1>
      {posts && posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>Likes: {post.likes}</p>
              <p>Comments: {post.commentCount}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No popular posts found.</p>
      )}
    </div>
  );
}
