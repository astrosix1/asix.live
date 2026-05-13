import { supabase } from './supabase';
import type { BlogPost, BlogListItem } from '@/types/blog';

const LIST_COLUMNS =
  'id, slug, title, description, author, cover_image, tags, published, featured, created_at, updated_at';

export async function getPublishedPosts(): Promise<BlogListItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_COLUMNS)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BlogListItem[];
}

export async function getFeaturedPosts(limit = 3): Promise<BlogListItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_COLUMNS)
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as BlogListItem[];
}

export async function getAllPosts(): Promise<BlogListItem[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BlogListItem[];
}

export async function getPostById(id: string): Promise<BlogPost> {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Post not found');
  return data as BlogPost;
}

export async function createPost(
  post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
): Promise<BlogPost> {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function updatePost(
  id: string,
  updates: Partial<BlogPost>
): Promise<BlogPost> {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function deletePost(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);

  if (error) throw error;
}

export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3
): Promise<BlogListItem[]> {
  if (!supabase || tags.length === 0) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select(LIST_COLUMNS)
    .eq('published', true)
    .neq('slug', currentSlug)
    .overlaps('tags', tags)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as BlogListItem[];
}
