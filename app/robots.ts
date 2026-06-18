import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/',
          '/login',
          '/dashboard',
          '/account',
          '/admin',
        ],
      },
    ],
    sitemap: 'https://asix.live/sitemap.xml',
  };
}
