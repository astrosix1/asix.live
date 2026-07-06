import { NextRequest, NextResponse } from 'next/server';

/**
 * Set a cross-subdomain auth session cookie.
 *
 * This endpoint receives Supabase tokens from apps like ascend.asix.live
 * and sets httpOnly cookies with Domain=.asix.live so they're accessible
 * to all subdomains.
 *
 * Only the asix.live origin can set cookies with Domain=.asix.live domain,
 * so apps on other subdomains must POST their tokens here after signing in.
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || '';

  // Validate origin
  const isValidOrigin = origin.endsWith('.asix.live') || origin === 'https://asix.live' || origin.includes('localhost');
  if (!isValidOrigin) {
    return NextResponse.json(
      { error: 'Unauthorized origin' },
      { status: 403 }
    );
  }

  let access_token: string | undefined;
  let refresh_token: string | undefined;
  try {
    const body = await request.json();
    access_token = body.access_token;
    refresh_token = body.refresh_token;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  if (!access_token || !refresh_token) {
    return NextResponse.json(
      { error: 'access_token and refresh_token required' },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });

  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost');
  const cookieDomain = isLocalhost ? undefined : '.asix.live';
  const domainAttr = cookieDomain ? `; Domain=${cookieDomain}` : '';
  const secureFlag = !isLocalhost ? '; Secure' : '';
  const oneYearSeconds = 60 * 60 * 24 * 365;

  // Set access token cookie
  const accessTokenCookie = `sb-access-token=${access_token}; Path=/; SameSite=Lax; Max-Age=${oneYearSeconds}; HttpOnly${secureFlag}${domainAttr}`;
  response.headers.append('Set-Cookie', accessTokenCookie);

  // Set refresh token cookie
  const refreshTokenCookie = `sb-refresh-token=${refresh_token}; Path=/; SameSite=Lax; Max-Age=${oneYearSeconds}; HttpOnly${secureFlag}${domainAttr}`;
  response.headers.append('Set-Cookie', refreshTokenCookie);

  // Add CORS headers for cross-origin cookie setting
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

/**
 * CORS preflight for cross-origin requests from subdomains
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';

  // Allow requests from all asix.live subdomains
  const isValidOrigin = origin.endsWith('.asix.live') || origin === 'https://asix.live' || origin.includes('localhost');

  if (!isValidOrigin) {
    return NextResponse.json(
      { error: 'Unauthorized origin' },
      { status: 403 }
    );
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
