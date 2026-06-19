import { createPost } from '@/lib/blog';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseFromRequest } from '@/lib/supabase-server';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function POST(request: NextRequest) {
  const supabase = await getSupabaseFromRequest(request);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const email = (user.email ?? '').toLowerCase();
  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const post = await request.json();
    const result = await createPost(post);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to publish' },
      { status: 500 }
    );
  }
}
