-- NOTE: this file is a legacy, single-shot bootstrap script from before this
-- project adopted `supabase/migrations/`. If you're setting up a NEW Supabase
-- project, prefer running the numbered files in supabase/migrations/ in
-- order instead — they're the actual applied history and include fixes
-- (e.g. 002_fix_rls_add_wikihole.sql, 003_restrict_write_access_to_admin.sql)
-- that this file's original version predates. This file has been patched to
-- match the same admin-only write policy so it's still safe to run
-- standalone, but the two sources of truth for schema/policies should be
-- reconciled (drop this file, or fold it into the migrations folder).

-- Single source of truth for "is this JWT an admin" — keep in sync with the
-- ADMIN_EMAILS env var used by the app.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.jwt() ->> 'email', '') IN ('collins.nick999@gmail.com');
$$;

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

-- Policy 2-4: only the admin (or the service role) can write projects.
-- Previously these granted INSERT/UPDATE/DELETE to ANY authenticated user —
-- since Supabase's anon key + RLS is the real security boundary (not just
-- the app's own admin-email UI gate), that let any signed-up visitor write
-- or delete portfolio projects directly via the Supabase REST API.
CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  USING (public.is_admin() OR auth.role() = 'service_role')
  WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

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

-- Only the admin (or the service role) can write posts — see the note above
-- the `projects` policy for why "any authenticated user" was wrong here too.
CREATE POLICY "Admins can manage posts"
  ON blog_posts FOR ALL
  USING (public.is_admin() OR auth.role() = 'service_role')
  WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

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
