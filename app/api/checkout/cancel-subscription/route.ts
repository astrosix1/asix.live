import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseFromRequest } from '@/lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

/**
 * POST /api/checkout/cancel-subscription
 * Cancel a subscription at the end of the current billing period.
 * Requires authenticated user who owns the subscription.
 */
export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    // Verify the user is authenticated
    const supabase = await getSupabaseFromRequest(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the subscription belongs to this user (prevents cancelling others' subs)
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, user_id, status')
      .eq('id', subscriptionId)
      .single();

    if (subError || !sub) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    if (sub.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (sub.status === 'canceled') {
      return NextResponse.json({ error: 'Subscription is already cancelled' }, { status: 400 });
    }

    if (!sub.stripe_subscription_id) {
      return NextResponse.json({ error: 'No Stripe subscription linked' }, { status: 400 });
    }

    // Cancel at period end (not immediately — user keeps access until billing cycle ends)
    const updated = await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update Supabase to reflect pending cancellation
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId);

    return NextResponse.json({
      success: true,
      cancelAtPeriodEnd: updated.cancel_at_period_end,
      currentPeriodEnd: new Date(updated.current_period_end * 1000).toISOString(),
      message: 'Subscription will be cancelled at the end of the current billing period.',
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    const message = error instanceof Error ? error.message : 'Failed to cancel subscription';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/checkout/cancel-subscription
 * Reactivate a subscription that was set to cancel at period end.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    const supabase = await getSupabaseFromRequest(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, user_id')
      .eq('id', subscriptionId)
      .single();

    if (subError || !sub || sub.user_id !== user.id) {
      return NextResponse.json({ error: 'Subscription not found or forbidden' }, { status: 404 });
    }

    // Remove the cancellation — subscription continues
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: false, updated_at: new Date().toISOString() })
      .eq('id', subscriptionId);

    return NextResponse.json({ success: true, message: 'Cancellation reversed. Subscription will continue.' });

  } catch (error) {
    console.error('Reactivate subscription error:', error);
    return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 });
  }
}
