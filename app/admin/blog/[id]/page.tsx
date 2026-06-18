import { getPostById } from '@/lib/blog';
import type { BlogPost } from '@/types/blog';
import BlogForm from '@/components/blog/BlogForm';

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: BlogPost | null = null;
  let error: string | null = null;

  try {
    post = await getPostById(id);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load post';
  }

  if (error || !post)
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
