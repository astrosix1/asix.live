export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type BlogListItem = Omit<BlogPost, 'content'>;
