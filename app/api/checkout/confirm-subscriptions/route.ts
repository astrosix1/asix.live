import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { upsertSubscriptionFromStripe } from '@/lib/subscriptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Maps Stripe price IDs to project slugs
const PRICE_TO_SLUG: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || '']: 'wikihole',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ASCEND || '']: 'ascend',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_GEOINTEL || '']: 'geointel',
};

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // Verify the caller's identity via their Supabase JWT
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !callerUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Retrieve the session and its line items from Stripe — do not trust client-supplied items
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Confirm the authenticated user is the one who initiated this checkout
    const sessionUserId = session.metadata?.userId;
    if (!sessionUserId || sessionUserId !== callerUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const stripeCustomerId = session.customer as string;
    const lineItems = session.line_items?.data || [];
    const activated: string[] = [];

    for (const item of lineItems) {
      const priceId = item.price?.id;
      if (!priceId) continue;

      const projectSlug = PRICE_TO_SLUG[priceId];
      if (!projectSlug) {
        console.warn('Unknown price ID in session:', priceId);
        continue;
      }

      // Retrieve the actual Stripe subscription to get accurate period dates
      let stripeSubscriptionId = '';
      let periodStart: string | null = null;
      let periodEnd: string | null = null;
      let cancelAtPeriodEnd = false;

      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        stripeSubscriptionId = sub.id;
        periodStart = new Date(sub.current_period_start * 1000).toISOString();
        periodEnd = new Date(sub.current_period_end * 1000).toISOString();
        cancelAtPeriodEnd = sub.cancel_at_period_end;
      }

      await upsertSubscriptionFromStripe(
        callerUser.id,
        projectSlug,
        stripeCustomerId,
        stripeSubscriptionId,
        'pro',
        'active',
        periodStart,
        periodEnd,
        cancelAtPeriodEnd,
      );

      activated.push(projectSlug);
    }

    return NextResponse.json({
      success: true,
      activated,
      message: `${activated.length} subscription(s) activated`,
    });
  } catch (error) {
    console.error('Confirm subscriptions error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to confirm subscriptions' },
      { status: 500 }
    );
  }
}
