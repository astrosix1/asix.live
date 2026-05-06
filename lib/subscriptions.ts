import { supabase } from './supabase';

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

/**
 * Get all subscriptions for a user
 */
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

/**
 * Get a specific subscription for user + project
 */
export async function getProjectSubscription(
  userId: string,
  projectSlug: string
): Promise<Subscription | null> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // First, get the project ID by slug
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', projectSlug)
    .single();

  if (projectError || !projectData) {
    console.error('Project not found:', projectSlug);
    return null;
  }

  // Then get the subscription
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('project_id', projectData.id)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "no rows returned" which is fine
    console.error('Error fetching subscription:', error);
    throw error;
  }

  return data || null;
}

/**
 * Check if user has active subscription to a project
 */
export async function hasActiveSubscription(
  userId: string,
  projectSlug: string
): Promise<boolean> {
  const subscription = await getProjectSubscription(userId, projectSlug);
  return subscription !== null && subscription.status === 'active';
}

/**
 * Update subscription from Stripe webhook
 * (Called from API route handler with service role)
 */
export async function updateSubscriptionFromStripe(
  stripe_customer_id: string,
  stripe_subscription_id: string,
  plan: string,
  status: string,
  current_period_start: string | null,
  current_period_end: string | null
) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Find user by stripe_customer_id
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('id, user_id, project_id')
    .eq('stripe_customer_id', stripe_customer_id)
    .single();

  if (subscriptionError || !subscriptionData) {
    console.error('Subscription not found for customer:', stripe_customer_id);
    throw new Error('Subscription not found');
  }

  // Update subscription
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      stripe_subscription_id,
      plan,
      status,
      current_period_start,
      current_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionData.id);

  if (updateError) {
    console.error('Error updating subscription:', updateError);
    throw updateError;
  }

  return subscriptionData;
}

/**
 * Cancel a subscription (from Stripe webhook)
 */
export async function cancelSubscription(stripe_subscription_id: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase
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

/**
 * Log Stripe webhook event (for debugging)
 */
export async function logStripeEvent(
  stripe_event_id: string,
  event_type: string,
  payload: any
) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase
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
    // Don't throw - logging failure shouldn't break webhook processing
  }
}
