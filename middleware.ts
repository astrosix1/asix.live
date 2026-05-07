import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
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

  // Fix Set-Cookie domain for cross-subdomain sharing in production
  // Rewrite all sb-* cookies to use .asix.live domain (with leading dot)
  const setCookieHeader = response.headers.getSetCookie();

  if (setCookieHeader.length > 0 && !host.includes('localhost')) {
    // Clear existing Set-Cookie headers
    response.headers.delete('Set-Cookie');

    // Rewrite and add back with correct domain
    setCookieHeader.forEach((cookie) => {
      if (cookie.includes('sb-')) {
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
