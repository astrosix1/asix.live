import { createClient } from '@supabase/supabase-js';
import { Project } from './projects';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getProjectBySlugServer(slug: string): Promise<Project> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug);

  if (error) {
    console.error('Supabase error fetching project:', error);
    throw new Error(`Project not found: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('Project not found');
  }

  return data[0] as Project;
}

export async function getPublishedProjectsServer(): Promise<Project[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    return [];
  }

  return (data || []) as Project[];
}
