import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripePriceId } from '@/lib/stripe-prices';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: NextRequest) {
  console.log('=== CREATE SESSION START ===');
  try {
    console.log('Checking STRIPE_SECRET_KEY...');
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    console.log('Parsing request body...');
    const { items, userEmail, userId } = await req.json();
    console.log('Request body:', { itemsCount: items?.length, userEmail, userId });

    if (!userEmail || !userId) {
      console.log('Missing user information');
      return NextResponse.json({ error: 'Missing user information' }, { status: 401 });
    }

    if (!items || items.length === 0) {
      console.log('Cart is empty');
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Build line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Server-side allowlist — prevents clients from injecting arbitrary slugs/plans
    const VALID_SLUGS = new Set(['basic', 'ascend', 'geointel']);
    const VALID_PLANS = new Set(['free', 'pro']);

    console.log('Building line items...');
    for (const item of items) {
      console.log(`Processing item: ${item.appSlug}`);
      if (!VALID_SLUGS.has(item.appSlug) || !VALID_PLANS.has(item.plan)) {
        console.log(`Invalid product: ${item.appSlug}/${item.plan}`);
        return NextResponse.json({ error: 'Invalid product selection' }, { status: 400 });
      }
      const priceId = getStripePriceId(item.appSlug, item.plan);
      console.log(`Price ID for ${item.appSlug}: ${priceId}`);
      if (!priceId) {
        console.log(`Price not configured for ${item.appSlug}`);
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

    console.log(`Creating Stripe session with ${lineItems.length} items...`);
    const isAscend = items.some((item: { appSlug: string }) => item.appSlug === 'ascend');

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
      ...(isAscend ? { subscription_data: { trial_period_days: 7 } } : {}),
    });

    console.log(`Session created: ${session.id}`);
    console.log(`Checkout URL: ${session.url}`);
    const response = { sessionId: session.id, url: session.url };
    console.log('Sending response:', response);
    console.log('=== CREATE SESSION END ===');
    return NextResponse.json(response);
  } catch (error) {
    console.log('=== CREATE SESSION ERROR ===');
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Checkout session error:', errorMessage);
    console.error('Full error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: errorMessage, type: error instanceof Error ? error.constructor.name : typeof error },
      { status: 500 }
    );
  }
}
