import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | asix.live',
  description:
    'Product announcements, updates, and insights from the asix.live team.',
  openGraph: {
    title: 'Blog | asix.live',
    description:
      'Product announcements, updates, and insights from the asix.live team.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
