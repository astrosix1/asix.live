import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Extract subdomain
  const parts = host.split('.');
  const subdomain = parts.length > 2 ? parts[0] : null;

  // Store subdomain in request headers for use in components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-subdomain', subdomain || 'main');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
