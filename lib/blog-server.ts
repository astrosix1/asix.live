import { createClient } from '@supabase/supabase-js';
import type { BlogPost } from '@/types/blog';

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase not configured');
  return createClient(url, key);
}

export async function getPostBySlugServer(slug: string): Promise<BlogPost> {
  const client = getServerClient();

  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) throw new Error('Post not found');
  return data as BlogPost;
}
