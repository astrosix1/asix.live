'use client';

import { useEffect, useState } from 'react';
import { getPostById } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import BlogForm from '@/components/blog/BlogForm';

export default function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPostById(params.id);
        setPost(data);
      } catch (err) {
        console.error('Failed to load post', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!post)
    return (
      <div className="text-center py-12 text-gray-600">Post not found</div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Edit Post</h1>
      <BlogForm initialData={post} />
    </div>
  );
}
