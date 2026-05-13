-- Create projects table for portfolio
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  external_url TEXT NOT NULL,
  icon_url TEXT,
  tech_stack TEXT[] NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read published projects
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT
  USING (is_published = true);

-- Policy 2: Authenticated users can create projects
CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Authenticated users can update projects
CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Authenticated users can delete projects
CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are readable by all"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authors can manage their posts"
  ON blog_posts FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Insert Ascend as first project
INSERT INTO projects (name, slug, description, external_url, tech_stack, is_published)
VALUES (
  'Ascend',
  'ascend',
  'A personal habit-tracking and wellness application with cloud synchronization capabilities.',
  'https://ascend001.vercel.app/',
  ARRAY['React Native', 'Expo', 'TypeScript', 'Supabase'],
  true
);
