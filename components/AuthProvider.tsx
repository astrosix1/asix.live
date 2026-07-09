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

      // Get initial session. A rejected promise here (as opposed to a
      // resolved { session: null }) means something is wrong with the
      // stored session/refresh token — force a full sign-out so a broken
      // token can't keep getting retried by the client's auto-refresh
      // ticker, and so `loading` doesn't hang forever with no .catch().
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        })
        .catch((err) => {
          console.error('getSession failed, forcing sign-out:', err);
          supabase.auth.signOut().finally(() => {
            setSession(null);
            setUser(null);
            setLoading(false);
          });
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
