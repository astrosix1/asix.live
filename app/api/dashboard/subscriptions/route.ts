import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseFromRequest } from '@/lib/supabase-server';
import { getProject } from '@/lib/get-project';

/**
 * GET /api/dashboard/subscriptions
 *
 * Fetch all subscriptions for the authenticated user with app details
 * Protected route - requires valid session
 */
export async function GET(request: NextRequest) {
  try {
    // Resolve client from the request's Bearer token (localStorage auth), with cookie fallback
    const supabase = await getSupabaseFromRequest(request);

    // Check authentication using server-side auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's subscriptions from Supabase (using server-side client)
    const { data: subscriptions, error: subscriptionError } = await supabase
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
      .eq('user_id', user.id);

    if (subscriptionError) {
      console.error('Error fetching subscriptions:', subscriptionError);
      throw subscriptionError;
    }

    // Enhance subscriptions with project details from local config
    const enrichedSubscriptions = subscriptions.map((sub: any) => {
      // Get project from local config for UI details (icon, color, etc)
      const project = getProject(sub.projects?.slug);

      return {
        id: sub.id,
        userId: sub.user_id,
        projectId: sub.project_id,
        projectSlug: sub.projects?.slug || 'unknown',
        projectName: sub.projects?.name || 'Unknown Project',
        plan: sub.plan,
        status: sub.status,
        stripeSubscriptionId: sub.stripe_subscription_id,
        currentPeriodStart: sub.current_period_start,
        currentPeriodEnd: sub.current_period_end,
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        createdAt: sub.created_at,
        updatedAt: sub.updated_at,
        // Add project metadata for UI
        appIcon: project?.icon,
        appColor: project?.color,
        externalUrl: project?.externalUrl,
      };
    });

    return NextResponse.json({
      success: true,
      subscriptions: enrichedSubscriptions,
      count: enrichedSubscriptions.length,
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
