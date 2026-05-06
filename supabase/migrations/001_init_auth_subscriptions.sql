-- asix.live Auth + Subscriptions Schema
-- Run this in Supabase SQL Editor after creating new project

-- Projects table (list of all apps)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  subdomain_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Subscriptions table (per-user, per-app)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  plan TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Stripe events log (for webhook debugging)
CREATE TABLE public.stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE,
  event_type TEXT,
  payload JSONB,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Only service role can insert/update subscriptions (from webhook)
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policy: Projects are public (anyone can read)
CREATE POLICY "Projects are public"
  ON public.projects
  FOR SELECT
  USING (true);

-- RLS Policy: Only service role can manage projects
CREATE POLICY "Service role can manage projects"
  ON public.projects
  FOR INSERT, UPDATE, DELETE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policy: Only service role can log Stripe events
CREATE POLICY "Service role can manage stripe events"
  ON public.stripe_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Insert initial projects
INSERT INTO public.projects (name, slug, description, subdomain_url) VALUES
  ('Ascend', 'ascend', 'Habit tracker and personal development app', 'https://ascend.asix.live/'),
  ('GeoIntel', 'geointel', 'Geopolitical intelligence platform', 'https://geointel.asix.live/')
ON CONFLICT DO NOTHING;
