import { supabase } from './supabase';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  external_url: string;
  icon_url?: string;
  tech_stack: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPublishedProjects() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Project[];
}

export async function getProjectBySlug(slug: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    return data as Project;
  } catch (err) {
    console.error('Failed to fetch project:', err);
    throw err;
  }
}

export async function getAllProjects() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Project[];
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, updates: Partial<Project>) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
