import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';

export interface Subscription {
  id: string;
  user_id: string;
  project_id: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  plan: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subdomain_url: string | null;
  created_at: string;
}

export async function getUserSubscriptions(userId: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      projects:project_id (
        id,
        name,
        slug,
        description,
        subdomain_url
      )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user subscriptions:', error);
    throw error;
  }

  return data || [];
}

export async function getProjectSubscription(
  userId: string,
  projectSlug: string
): Promise<Subscription | null> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', projectSlug)
    .single();

  if (projectError || !projectData) {
    console.error('Project not found:', projectSlug);
    return null;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('project_id', projectData.id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subscription:', error);
    throw error;
  }

  return data || null;
}

export async function hasActiveSubscription(
  userId: string,
  projectSlug: string
): Promise<boolean> {
  const subscription = await getProjectSubscription(userId, projectSlug);
  return subscription !== null && (subscription.status === 'active' || subscription.status === 'trialing');
}

/**
 * Upsert a subscription row from Stripe webhook or confirm-subscriptions API.
 * Uses service role to bypass RLS — must only be called from server-side routes.
 */
export async function upsertSubscriptionFromStripe(
  userId: string,
  projectSlug: string,
  stripe_customer_id: string,
  stripe_subscription_id: string,
  plan: string,
  status: string,
  current_period_start: string | null,
  current_period_end: string | null,
  cancel_at_period_end: boolean,
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('slug', projectSlug)
    .single();

  if (projectError || !project) {
    throw new Error(`Unknown project slug: ${projectSlug}`);
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        project_id: project.id,
        stripe_subscription_id,
        stripe_customer_id,
        plan,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,project_id' }
    );

  if (error) {
    console.error('Error upserting subscription:', error);
    throw error;
  }
}

export async function markSubscriptionPastDue(stripe_subscription_id: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', stripe_subscription_id);

  if (error) {
    console.error('Error marking subscription past_due:', error);
    throw error;
  }
}

export async function cancelSubscription(stripe_subscription_id: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', stripe_subscription_id);

  if (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function logStripeEvent(
  stripe_event_id: string,
  event_type: string,
  payload: unknown
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { error } = await supabaseAdmin
    .from('stripe_events')
    .insert([
      {
        stripe_event_id,
        event_type,
        payload,
        processed_at: new Date().toISOString(),
      },
    ]);

  if (error) {
    console.error('Error logging Stripe event:', error);
    // Don't throw — logging failure shouldn't break webhook processing
  }
}
