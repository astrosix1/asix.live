import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  upsertSubscriptionFromStripe,
  cancelSubscription,
  markSubscriptionPastDue,
  logStripeEvent,
} from '@/lib/subscriptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Maps Stripe price IDs to project slugs — must match lib/stripe-prices.ts
const PRICE_TO_SLUG: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || '']: 'wikihole',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_ASCEND || '']: 'ascend',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_GEOINTEL || '']: 'geointel',
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 401 }
    );
  }

  try {
    await logStripeEvent(event.id, event.type, event.data);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        // Retrieve the Stripe customer to get the userId stored in metadata at checkout
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) {
          console.error('Customer deleted:', subscription.customer);
          break;
        }

        const userId = customer.metadata?.userId;
        if (!userId) {
          console.error('No userId in Stripe customer metadata for customer:', subscription.customer);
          break;
        }

        const priceId = subscription.items.data[0]?.price.id;
        const projectSlug = PRICE_TO_SLUG[priceId];
        if (!projectSlug) {
          console.error('Unknown price ID in subscription:', priceId);
          break;
        }

        await upsertSubscriptionFromStripe(
          userId,
          projectSlug,
          subscription.customer as string,
          subscription.id,
          subscription.items.data[0]?.plan.nickname || 'pro',
          subscription.status,
          new Date(subscription.current_period_start * 1000).toISOString(),
          new Date(subscription.current_period_end * 1000).toISOString(),
          subscription.cancel_at_period_end,
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await cancelSubscription(subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await markSubscriptionPastDue(invoice.subscription as string);
        }
        break;
      }

      case 'invoice.payment_action_required': {
        // 3DS/SCA authentication required — Stripe sends the customer a payment link automatically.
        // Subscription remains in its current state; we take no DB action here.
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment action required for invoice:', invoice.id, 'customer:', invoice.customer);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
