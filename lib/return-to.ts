/**
 * Cross-app sign-in handoff. Apps on *.asix.live (e.g. GeoIntel) send users to
 * /login?return_to=<their URL>; once signed in we redirect back with the
 * Supabase access token in the URL fragment (`#access_token=...`), which is
 * never sent to a server or leaked via Referer.
 *
 * Because that redirect carries a bearer token, the target must be strictly
 * allowlisted — an unchecked return_to would be a token-exfiltration hole.
 */

const ALLOWED_ROOT_HOST = 'asix.live';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

/**
 * Returns a sanitized URL (origin + path + query, no fragment) if `raw` is an
 * allowed handoff target, otherwise null.
 *
 * Allowed: https on asix.live or any *.asix.live subdomain (default port, no
 * embedded credentials). http://localhost / 127.0.0.1 is allowed only when
 * this site itself is being served from localhost, so local dev works but
 * production never hands a token to a user's loopback address.
 */
export function parseReturnTo(raw: string | null, currentHostname: string): URL | null {
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.username || url.password) return null;

  const host = url.hostname.toLowerCase();
  const isAsixHost = host === ALLOWED_ROOT_HOST || host.endsWith(`.${ALLOWED_ROOT_HOST}`);

  if (url.protocol === 'https:' && isAsixHost && url.port === '') {
    url.hash = '';
    return url;
  }

  if (url.protocol === 'http:' && LOCAL_HOSTS.has(host) && LOCAL_HOSTS.has(currentHostname)) {
    url.hash = '';
    return url;
  }

  return null;
}

/** Build the redirect URL carrying the access token in the fragment. */
export function buildHandoffUrl(
  target: URL,
  session: { access_token: string; expires_in?: number }
): string {
  const fragment = new URLSearchParams({
    access_token: session.access_token,
    token_type: 'bearer',
  });
  if (typeof session.expires_in === 'number') {
    fragment.set('expires_in', String(session.expires_in));
  }
  return `${target.origin}${target.pathname}${target.search}#${fragment.toString()}`;
}
