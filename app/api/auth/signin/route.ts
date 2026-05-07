import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password required' },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    // Create a server-side Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'No session returned' },
        { status: 401 }
      );
    }

    // Create response with session
    const response = NextResponse.json({ success: true });

    // Set httpOnly cookies for cross-subdomain sharing
    const { access_token, refresh_token } = data.session;

    // Determine cookie domain based on environment
    // On localhost, cookies can't have .asix.live domain, so we skip the domain
    // In production, set domain to .asix.live for subdomain sharing (leading dot is required!)
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost');
    const cookieDomain = isLocalhost ? undefined : '.asix.live';

    // Set cookies using Set-Cookie header for explicit domain control
    // This ensures the domain is set to .asix.live for cross-subdomain sharing
    const oneYearSeconds = 60 * 60 * 24 * 365;
    const secureFlag = !isLocalhost ? '; Secure' : '';

    const accessTokenCookie = `sb-access-token=${access_token}; Path=/; SameSite=Lax; Max-Age=${oneYearSeconds}; HttpOnly${secureFlag}${cookieDomain ? `; Domain=${cookieDomain}` : ''}`;
    const refreshTokenCookie = `sb-refresh-token=${refresh_token}; Path=/; SameSite=Lax; Max-Age=${oneYearSeconds}; HttpOnly${secureFlag}${cookieDomain ? `; Domain=${cookieDomain}` : ''}`;

    response.headers.append('Set-Cookie', accessTokenCookie);
    response.headers.append('Set-Cookie', refreshTokenCookie);

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
