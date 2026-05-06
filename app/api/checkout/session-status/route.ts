import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });

    return NextResponse.json({
      status: session.payment_status,
      customer_email: session.customer_email,
      line_items: session.line_items?.data.map((item) => ({
        price_id: item.price?.id,
        product_id: item.price?.product,
        quantity: item.quantity,
      })),
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Session status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
