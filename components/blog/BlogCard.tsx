import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { BlogListItem } from '@/types/blog';

interface BlogCardProps {
  post: BlogListItem;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 flex flex-col h-full overflow-hidden">
      {/* Cover image / placeholder */}
      <div className="relative h-40 overflow-hidden">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <span className="text-slate-500 text-4xl">✍️</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-white font-bold text-lg leading-snug mb-2">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {post.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-slate-500 text-xs">
            <span>{post.author}</span>
            <span className="mx-1.5">·</span>
            <span>{formattedDate}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
          >
            Read Post
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
