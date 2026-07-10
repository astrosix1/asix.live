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

    return () => subscription?.unsubscribe();
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
