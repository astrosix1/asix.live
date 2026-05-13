'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getPublishedPosts } from '@/lib/blog';
import type { BlogListItem } from '@/types/blog';
import BlogCard from '@/components/blog/BlogCard';
import TagFilter from '@/components/blog/TagFilter';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    getPublishedPosts()
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <div className="bg-[#0F172A] min-h-screen">
      {/* Header */}
      <div className="bg-[#111827] border-b border-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3"
            >
              Blog
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Product Updates &amp; Insights
            </motion.h1>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-2xl">
              Announcements, release notes, and behind-the-scenes from the
              asix.live team.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="border-b border-slate-800 py-5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <TagFilter
              allTags={allTags}
              activeTag={activeTag}
              onTagChange={setActiveTag}
            />
          </div>
        </div>
      )}

      {/* Posts grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-16 text-lg">
            {activeTag ? `No posts tagged "${activeTag}".` : 'No posts yet.'}
          </p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((post) => (
              <motion.div key={post.id} variants={fadeUp}>
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
