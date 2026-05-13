import type { Metadata } from 'next';
import Link from 'next/link';
import readingTime from 'reading-time';
import { getPostBySlugServer } from '@/lib/blog-server';
import BlogHero from '@/components/blog/BlogHero';
import BlogContent from '@/components/blog/BlogContent';
import RelatedPosts from '@/components/blog/RelatedPosts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlugServer(slug);
    return {
      title: `${post.title} | asix.live`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        images: post.cover_image ? [post.cover_image] : [],
      },
    };
  } catch {
    return { title: 'Post Not Found | asix.live' };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlugServer(slug);
  } catch {
    return (
      <div className="bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-slate-400 mb-8">
            The post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const rt = readingTime(post.content);
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-[#0F172A] min-h-screen">
      <BlogHero
        title={post.title}
        description={post.description}
        author={post.author}
        date={formattedDate}
        readingTime={rt.text}
        tags={post.tags}
        coverImage={post.cover_image}
      />

      <main className="max-w-3xl mx-auto px-4 py-12">
        <BlogContent content={post.content} />
      </main>

      <RelatedPosts currentSlug={post.slug} tags={post.tags} />
    </div>
  );
}
