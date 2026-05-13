'use client';

import { useEffect, useState } from 'react';
import { getRelatedPosts } from '@/lib/blog';
import type { BlogListItem } from '@/types/blog';
import BlogCard from './BlogCard';

interface RelatedPostsProps {
  currentSlug: string;
  tags: string[];
}

export default function RelatedPosts({ currentSlug, tags }: RelatedPostsProps) {
  const [posts, setPosts] = useState<BlogListItem[]>([]);

  useEffect(() => {
    getRelatedPosts(currentSlug, tags, 3)
      .then(setPosts)
      .catch(() => {});
  }, [currentSlug, tags]);

  if (posts.length === 0) return null;

  return (
    <section className="bg-[#0F172A] border-t border-slate-800 py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-white text-2xl font-bold mb-8">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
