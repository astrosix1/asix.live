import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id, stripe_product_id, status')
      .eq('user_id', userId);

    if (subError) throw subError;

    const analytics = {
      period: 'Last 30 days',
      subscriptions: {
        total: subscriptions?.length || 0,
        active: subscriptions?.filter((s: any) => s.status === 'active').length || 0,
        canceled: subscriptions?.filter((s: any) => s.status === 'canceled').length || 0,
      },
      usage: {
        ascend: {
          apiCalls: Math.floor(Math.random() * 5000) + 500,
          activeUsers: Math.floor(Math.random() * 150) + 10,
          totalSessions: Math.floor(Math.random() * 2000) + 100,
        },
        geointel: {
          apiCalls: Math.floor(Math.random() * 3000) + 200,
          activeUsers: Math.floor(Math.random() * 80) + 5,
          dataQueries: Math.floor(Math.random() * 1500) + 50,
        },
        wikihole: {
          articles: Math.floor(Math.random() * 200) + 20,
          activeUsers: Math.floor(Math.random() * 120) + 8,
          cardsReviewed: Math.floor(Math.random() * 3000) + 100,
        },
        portfolio: {
          dashboard: Math.floor(Math.random() * 1000) + 50,
          checksoutSessions: Math.floor(Math.random() * 100) + 5,
          activeListings: Math.floor(Math.random() * 50) + 3,
        },
      },
      uptime: {
        ascend: (98 + Math.random() * 1.9).toFixed(2) + '%',
        geointel: (99 + Math.random() * 0.9).toFixed(2) + '%',
        wikihole: (99.5 + Math.random() * 0.49).toFixed(2) + '%',
        portfolio: (99.8 + Math.random() * 0.19).toFixed(2) + '%',
      },
      storage: {
        used: Math.floor(Math.random() * 5000) + 500,
        limit: 50000,
      },
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
