'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';

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
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setLoading(false);
      return;
    }

    // Dynamically import Supabase only if configured
    import('@/lib/supabase').then(({ supabase }) => {
      if (!supabase) {
        setLoading(false);
        return;
      }

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
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        })
        .catch((err) => {
          const isRealAuthError = typeof err?.name === 'string' && err.name.startsWith('Auth');
          if (isRealAuthError) {
            console.error('getSession failed with a real auth error, forcing sign-out:', err);
            supabase.auth.signOut().finally(() => {
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
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription?.unsubscribe();
    });
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
