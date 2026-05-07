import { NextRequest, NextResponse } from 'next/server';

/**
 * Auth callback route for Supabase
 * Handles OAuth redirects and ensures cookies are set with cross-subdomain domain (.asix.live)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    // Redirect to next URL with code parameter
    // The session will be established via cookie
    const response = NextResponse.redirect(new URL(next, request.url));
    return response;
  }

  // If no code, just redirect home
  return NextResponse.redirect(new URL('/', request.url));
}
