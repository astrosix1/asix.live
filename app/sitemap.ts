import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/blog';
import { getAllUseCaseSlugs } from '@/lib/use-cases';

const BASE_URL = 'https://asix.live';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/projects/ascend`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/projects/geointel`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/projects/wikihole`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const useCaseRoutes: MetadataRoute.Sitemap = getAllUseCaseSlugs().map((slug) => ({
    url: `${BASE_URL}/use-cases/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updated_at || now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Blog posts unavailable — sitemap still valid without them
  }

  return [...staticRoutes, ...useCaseRoutes, ...blogRoutes];
}
