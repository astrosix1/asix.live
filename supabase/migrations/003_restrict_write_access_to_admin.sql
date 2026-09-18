-- Restrict write access on `projects` and `blog_posts` to the site admin.
--
-- Previously, RLS granted INSERT/UPDATE/DELETE on these tables to ANY
-- authenticated user (`auth.role() = 'authenticated'` / `auth.uid() IS NOT
-- NULL`), not just the admin. The app's own gating (ADMIN_EMAILS check in
-- app/admin/layout.tsx and app/api/internal/publish-blog/route.ts) only
-- protects the Next.js UI and that one internal API route — it does nothing
-- for a signed-in user calling the Supabase REST API directly with their own
-- JWT, which is what RLS is actually supposed to guard. Any visitor who
-- signed up for a free account could insert/update/delete any project or
-- blog post this way.
--
-- Single source of truth for "is this JWT an admin" — keep this list in sync
-- with the ADMIN_EMAILS env var used by the app.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.jwt() ->> 'email', '') IN ('collins.nick999@gmail.com');
$$;

-- projects: drop every permissive "any authenticated user" policy that may
-- exist under either of this repo's two schema sources (database-setup.sql
-- and this migrations folder disagree on naming — see audit note M5).
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.projects;

CREATE POLICY "Admins can manage projects"
  ON public.projects
  FOR ALL
  USING (public.is_admin() OR auth.role() = 'service_role')
  WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

-- blog_posts: replace "any signed-in user" with admin-only.
DROP POLICY IF EXISTS "Authors can manage their posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON public.blog_posts;

CREATE POLICY "Admins can manage posts"
  ON public.blog_posts
  FOR ALL
  USING (public.is_admin() OR auth.role() = 'service_role')
  WITH CHECK (public.is_admin() OR auth.role() = 'service_role');
