-- Fix RLS: restrict subscription writes to service role only.
-- The previous policy's USING clause allowed authenticated users to UPDATE
-- their own subscription rows directly, bypassing Stripe entirely.
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add WikiHole project so subscription lookups succeed for wikihole subscribers.
-- Uses the schema from database-setup.sql (external_url + tech_stack are NOT NULL).
INSERT INTO public.projects (name, slug, description, external_url, tech_stack, is_published) VALUES
  ('WikiHole', 'wikihole', 'Wikipedia rabbit hole explorer with spaced repetition',
   'https://wikihole.asix.live/', ARRAY['Next.js', 'TypeScript', 'Supabase'], true)
ON CONFLICT (slug) DO NOTHING;
