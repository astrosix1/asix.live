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

    // Fetch user's subscriptions (no join — avoids PGRST200 when the FK is
    // not explicitly declared in Supabase's schema cache).
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (subscriptionError) {
      console.error('Error fetching subscriptions:', subscriptionError);
      throw subscriptionError;
    }

    // Look up project slugs/names from the projects table (best-effort).
    // If the projects table doesn't exist or the query fails we fall back to
    // local project-config which has all current project metadata.
    const projectIds = [...new Set((subscriptions ?? []).map((s: any) => s.project_id).filter(Boolean))];
    const projectsMap: Record<string, { slug: string; name: string }> = {};
    if (projectIds.length > 0) {
      const { data: dbProjects } = await supabase
        .from('projects')
        .select('id, slug, name')
        .in('id', projectIds);
      (dbProjects ?? []).forEach((p: any) => {
        projectsMap[p.id] = { slug: p.slug, name: p.name };
      });
    }

    // Enhance subscriptions with project details from local config
    const enrichedSubscriptions = (subscriptions ?? []).map((sub: any) => {
      const dbProject = projectsMap[sub.project_id];
      // Prefer DB-derived slug; fall back to any slug stored directly on the row
      const slug = dbProject?.slug ?? sub.project_slug ?? sub.slug ?? '';
      const project = getProject(slug);

      return {
        id: sub.id,
        userId: sub.user_id,
        projectId: sub.project_id,
        projectSlug: slug || 'unknown',
        projectName: dbProject?.name ?? project?.name ?? 'Unknown Project',
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
