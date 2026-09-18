import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Extract subdomain
  const parts = host.split('.');
  const subdomain = parts.length > 2 ? parts[0] : null;

  // Create response with subdomain header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-subdomain', subdomain || 'main');

  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Fix Set-Cookie domain for cross-subdomain sharing in production.
  //
  // This rewrite exists ONLY for the two hand-rolled cookies
  // app/api/auth/signin and app/api/auth/set-session set manually
  // (sb-access-token / sb-refresh-token) — it was never meant to touch the
  // Supabase SDK's own session cookie (sb-<project-ref>-auth-token, set by
  // createBrowserClient/createServerClient), which is deliberately
  // host-only (no Domain attribute) by the SDK's own default.
  //
  // Previously this ran on every request (the matcher's first pattern
  // already matches everything, making the "/api/auth/:path*" entry
  // redundant) and matched any cookie merely containing the substring
  // "sb-" — which also matches the SDK's own cookie name. Whenever a
  // Server Component refreshed that cookie (the only place this happens on
  // a normal visit is /admin's layout), this rewrite forced
  // Domain=.asix.live onto it, creating a SECOND cookie of the same name
  // alongside the original host-only one. Two same-named cookies with
  // different Domain scope make subsequent session reads unreliable —
  // almost certainly the cause of "signs in, then bounces back to /login"
  // reports. Scope this to the exact /api/auth/* routes and cookie names
  // it was actually written for.
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth/');
  const setCookieHeader = response.headers.getSetCookie();

  if (isAuthRoute && setCookieHeader.length > 0 && !host.includes('localhost')) {
    // Clear existing Set-Cookie headers
    response.headers.delete('Set-Cookie');

    // Rewrite and add back with correct domain
    setCookieHeader.forEach((cookie) => {
      if (cookie.startsWith('sb-access-token=') || cookie.startsWith('sb-refresh-token=')) {
        // Add .asix.live domain if not already present
        const updatedCookie = cookie.includes('Domain=')
          ? cookie.replace(/Domain=[^;]*/g, 'Domain=.asix.live')
          : cookie + '; Domain=.asix.live';
        response.headers.append('Set-Cookie', updatedCookie);
      } else {
        response.headers.append('Set-Cookie', cookie);
      }
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * INCLUDE: /api/auth/* for cookie domain rewriting
     * EXCLUDE: other /api/* routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/auth/:path*',
  ],
};
