'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;

    // Get initial session. A rejected promise here just means `loading`
    // needs to stop (previously there was no .catch() at all, so it could
    // hang true forever). Only force a sign-out for a genuine Supabase
    // auth error (name starting with "Auth" — AuthApiError,
    // AuthSessionMissingError, etc: a real dead/invalid session). A
    // browser-level error like a Web Locks timeout/abort (seen in
    // production under multi-tab contention: "DOMException: The lock
    // request is aborted") is transient and does NOT mean the session is
    // bad — signing out on that was actively wrong: it turned a brief
    // lock hiccup on a fresh, valid sign-in into a forced logout, which is
    // exactly the "bounces back to /login" bug reported live.
    client.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((err) => {
        const isRealAuthError = typeof err?.name === 'string' && err.name.startsWith('Auth');
        if (isRealAuthError) {
          console.error('getSession failed with a real auth error, forcing sign-out:', err);
          client.auth.signOut().finally(() => {
            setSession(null);
            setUser(null);
            setLoading(false);
          });
        } else {
          console.error('getSession failed with a transient error, not signing out:', err);
          setLoading(false);
        }
      });

    // Listen for auth changes. Note: a failed refresh (e.g. "Refresh
    // Token Not Found") already goes through the SDK's own _removeSession,
    // which clears storage and fires SIGNED_OUT with session: null — this
    // handler already reacts to that correctly via setSession/setUser
    // below, no extra branch needed for that case.
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Safety net for a poisoned refresh token (e.g. "Invalid Refresh Token:
    // Already Used" from a cross-tab refresh race — one tab rotates the
    // token, another tab's already-in-flight refresh then fails). That
    // failure happens inside the SDK's own auto-refresh timer, outside any
    // promise chain our code owns, so it surfaces as an unhandled
    // rejection instead of reaching the onAuthStateChange/getSession
    // handling above. Left alone, the UI can be stuck showing a stale
    // logged-in state while the SDK silently retries with the same dead
    // token. Force a local sign-out the moment we see one, and rate-limit
    // to one reaction per 3s so a burst of these (seen in production)
    // doesn't fire the reset repeatedly.
    let recentlyHandledPoisonedToken = false;
    function isPoisonedRefreshTokenError(reason: unknown) {
      const name = (reason as { name?: unknown } | null | undefined)?.name;
      const message = (reason as { message?: unknown } | null | undefined)?.message;
      return (
        typeof name === 'string' &&
        name.startsWith('Auth') &&
        typeof message === 'string' &&
        /refresh token/i.test(message)
      );
    }
    function handlePoisonedRefreshToken(event: PromiseRejectionEvent) {
      if (recentlyHandledPoisonedToken || !isPoisonedRefreshTokenError(event.reason)) return;
      recentlyHandledPoisonedToken = true;
      setTimeout(() => {
        recentlyHandledPoisonedToken = false;
      }, 3000);
      event.preventDefault();
      console.error('Poisoned refresh token detected, forcing local sign-out:', event.reason);
      setSession(null);
      setUser(null);
      setLoading(false);
      client.auth.signOut({ scope: 'local' }).catch(() => {});
    }
    window.addEventListener('unhandledrejection', handlePoisonedRefreshToken);

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('unhandledrejection', handlePoisonedRefreshToken);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
