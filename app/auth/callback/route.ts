import { NextRequest, NextResponse } from 'next/server';

/**
 * Only same-site paths are valid post-login destinations. Anything else falls
 * back to '/', otherwise ?next= is an open redirect (e.g. next=https://evil.com
 * or next=//evil.com), which makes phishing links on asix.live look trustworthy.
 *
 * Rejected: absolute URLs, protocol-relative ("//host") and backslash ("/\host")
 * forms that browsers treat as another host, and control characters (a tab or
 * newline inside "/\t/host" is stripped by URL parsers, turning it into "//host").
 * The origin check afterwards is a second, independent guard.
 */
function safeNextPath(next: string | null, requestUrl: string): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/';
  if (/[\u0000-\u001f\u007f]/.test(next)) return '/';
  try {
    const resolved = new URL(next, requestUrl);
    if (resolved.origin !== new URL(requestUrl).origin) return '/';
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return '/';
  }
}

/**
 * Auth callback route for Supabase
 * Handles OAuth redirects and ensures cookies are set with cross-subdomain domain (.asix.live)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'), request.url);

  if (code) {
    // Redirect to next URL with code parameter
    // The session will be established via cookie
    const response = NextResponse.redirect(new URL(next, request.url));
    return response;
  }

  // If no code, just redirect home
  return NextResponse.redirect(new URL('/', request.url));
}
