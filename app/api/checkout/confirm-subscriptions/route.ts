import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

// Map Stripe price IDs to app slugs
const PRICE_TO_APP: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || '']: 'basic',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ASCEND || '']: 'ascend',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_GEOINTEL || '']: 'geointel',
};

export async function POST(req: NextRequest) {
  try {
    const { sessionId, lineItems, userId } = await req.json();

    if (!sessionId || !userId || !lineItems) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    if (!sessionId || !lineItems) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify session payment status
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    // Get Stripe customer ID
    let stripeCustomerId = session.customer as string;

    // If no customer, create one
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.customer_email || undefined,
        metadata: { userId: userId },
      });
      stripeCustomerId = customer.id;
    }

    // Create subscriptions for each item
    const createdSubscriptions = [];

    for (const item of lineItems) {
      const priceId = item.price_id;
      const appSlug = PRICE_TO_APP[priceId];

      if (!appSlug) {
        console.warn(`Unknown price ID: ${priceId}`);
        continue;
      }

      // Get project ID
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', appSlug)
        .single();

      if (projectError) {
        console.error(`Project not found for ${appSlug}:`, projectError);
        continue;
      }

      // Check if subscription already exists
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('project_id', projectData.id)
        .maybeSingle();

      if (existingSub) {
        // Update existing subscription
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            stripe_customer_id: stripeCustomerId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSub.id);
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([
            {
              user_id: userId,
              project_id: projectData.id,
              stripe_customer_id: stripeCustomerId,
              plan: 'pro',
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]);

        if (insertError) {
          console.error(`Failed to create subscription for ${appSlug}:`, insertError);
        }
      }

      createdSubscriptions.push(appSlug);
    }

    return NextResponse.json({
      success: true,
      subscriptionsCreated: createdSubscriptions,
      message: `${createdSubscriptions.length} subscription(s) activated`,
    });
  } catch (error) {
    console.error('Confirm subscriptions error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to confirm subscriptions' },
      { status: 500 }
    );
  }
}
