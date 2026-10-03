import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripePriceId } from '@/lib/stripe-prices';
import { getSupabaseFromRequest } from '@/lib/supabase-server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    if (!checkRateLimit(`create-session:${getClientIp(req)}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many requests, please try again shortly' }, { status: 429 });
    }

    // Derive the user from their own session — never trust a client-supplied
    // userId/userEmail, which would let anyone mint a Checkout Session tagged
    // with someone else's user ID.
    const supabase = await getSupabaseFromRequest(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;
    const userEmail = user.email;

    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Build line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Server-side allowlist — prevents clients from injecting arbitrary slugs/plans
    const VALID_SLUGS = new Set(['basic', 'ascend', 'geointel']);
    const VALID_PLANS = new Set(['free', 'pro']);

    for (const item of items) {
      if (!VALID_SLUGS.has(item.appSlug) || !VALID_PLANS.has(item.plan)) {
        return NextResponse.json({ error: 'Invalid product selection' }, { status: 400 });
      }
      const priceId = getStripePriceId(item.appSlug, item.plan);
      if (!priceId) {
        return NextResponse.json(
          { error: `Price not configured for ${item.appSlug}` },
          { status: 400 }
        );
      }

      lineItems.push({
        price: priceId,
        quantity: 1,
      });
    }

    // Trial applies only when every item in the cart is a trial-eligible product.
    // Mixing a trial product (ascend, basic) with a non-trial product (geointel)
    // would give a free trial on the non-trial product — block that case.
    const TRIAL_SLUGS = new Set(['ascend', 'basic']);
    const hasTrial = items.every((item: { appSlug: string }) => TRIAL_SLUGS.has(item.appSlug));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail,
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      metadata: {
        userId: userId,
      },
      // Also stamp userId on the resulting Subscription (not just the Checkout
      // Session): the webhook's customer.subscription.created/updated handler
      // reads it from there. Without this, that handler can never resolve a
      // user (Stripe never populates Customer.metadata on its own), so it
      // silently no-ops on every renewal and dashboard-initiated change —
      // subscription sync would depend entirely on the client completing the
      // post-redirect confirm-subscriptions call.
      subscription_data: {
        metadata: { userId },
        ...(hasTrial ? { trial_period_days: 7 } : {}),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Checkout session error:', errorMessage);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: errorMessage, type: error instanceof Error ? error.constructor.name : typeof error },
      { status: 500 }
    );
  }
}
