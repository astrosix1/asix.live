'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import BlogContent from './BlogContent';

interface BlogFormProps {
  initialData?: BlogPost;
}

interface FormState {
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  coverImage: string;
  tagsInput: string;
  published: boolean;
  featured: boolean;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slugTouched, setSlugTouched] = useState(!!initialData);

  const [form, setForm] = useState<FormState>({
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    content: initialData?.content ?? '',
    author: initialData?.author ?? '',
    coverImage: initialData?.cover_image ?? '',
    tagsInput: initialData?.tags?.join(', ') ?? '',
    published: initialData?.published ?? false,
    featured: initialData?.featured ?? false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      title: value,
      ...(!slugTouched ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const tags = form.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      content: form.content,
      author: form.author,
      cover_image: form.coverImage || null,
      tags,
      published: form.published,
      featured: form.featured,
    };

    try {
      if (initialData) {
        await updatePost(initialData.id, payload);
      } else {
        await createPost(payload);
      }
      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm';
  const labelClass = 'block text-sm font-medium text-slate-300 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleTitleChange}
            className={inputClass}
            placeholder="Post title"
          />
        </div>

        <div>
          <label className={labelClass}>Slug *</label>
          <input
            type="text"
            name="slug"
            required
            value={form.slug}
            onChange={handleSlugChange}
            className={inputClass}
            placeholder="post-slug"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <input
          type="text"
          name="description"
          required
          value={form.description}
          onChange={handleChange}
          className={inputClass}
          placeholder="Brief summary shown in listing and meta tags"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Author *</label>
          <input
            type="text"
            name="author"
            required
            value={form.author}
            onChange={handleChange}
            className={inputClass}
            placeholder="Nick Collins"
          />
        </div>

        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input
            type="url"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags (comma-separated)</label>
        <input
          type="text"
          name="tagsInput"
          value={form.tagsInput}
          onChange={handleChange}
          className={inputClass}
          placeholder="ascend, product, update"
        />
      </div>

      {/* Content with preview toggle */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + ' mb-0'}>Content * (Markdown)</label>
          <div className="flex rounded-lg border border-slate-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                !preview
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                preview
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {preview ? (
          <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {form.content ? (
              <BlogContent content={form.content} />
            ) : (
              <p className="text-slate-500 text-sm">Nothing to preview yet.</p>
            )}
          </div>
        ) : (
          <textarea
            name="content"
            required
            value={form.content}
            onChange={handleChange}
            rows={20}
            className={inputClass + ' font-mono resize-y min-h-[400px]'}
            placeholder="Write your post in Markdown..."
          />
        )}
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-300 text-sm">Published</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-300 text-sm">Featured (shown on homepage)</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="px-6 py-2.5 bg-slate-700 text-slate-300 rounded-lg font-medium text-sm hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
