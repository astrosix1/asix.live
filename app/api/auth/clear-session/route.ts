import { NextRequest, NextResponse } from 'next/server';

/**
 * Clear the cross-subdomain auth session cookies.
 *
 * Mirror of /api/auth/set-session. Apps on *.asix.live (e.g. ascend.asix.live)
 * POST here on sign-out so the shared `.asix.live` cookies are actually
 * expired — otherwise set-session's 1-year cookies survive a local sign-out
 * and the session silently resurrects.
 *
 * Only the asix.live origin can clear cookies scoped to Domain=.asix.live,
 * so subdomains must relay sign-out here.
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || '';

  const isValidOrigin =
    origin.endsWith('.asix.live') || origin === 'https://asix.live' || origin.includes('localhost');
  if (!isValidOrigin) {
    return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });

  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost');
  const cookieDomain = isLocalhost ? undefined : '.asix.live';
  const domainAttr = cookieDomain ? `; Domain=${cookieDomain}` : '';
  const secureFlag = !isLocalhost ? '; Secure' : '';

  // Expire both cookies (Max-Age=0). Attributes must match set-session so the
  // browser deletes the right cookie.
  const expire = (name: string) =>
    `${name}=; Path=/; SameSite=Lax; Max-Age=0; HttpOnly${secureFlag}${domainAttr}`;
  response.headers.append('Set-Cookie', expire('sb-access-token'));
  response.headers.append('Set-Cookie', expire('sb-refresh-token'));

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

/**
 * CORS preflight for cross-origin sign-out requests from subdomains.
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';

  const isValidOrigin =
    origin.endsWith('.asix.live') || origin === 'https://asix.live' || origin.includes('localhost');
  if (!isValidOrigin) {
    return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
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
