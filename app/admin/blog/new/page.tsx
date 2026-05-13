import BlogForm from '@/components/blog/BlogForm';

export default function NewBlogPostPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
