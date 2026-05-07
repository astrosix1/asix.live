'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get the redirect URL from query params
  const redirectUri = searchParams.get('redirect') || '/';

  // Check if already logged in
  useEffect(() => {
    const sb = supabase;
    if (!sb) return;
    const checkAuth = async () => {
      const { data: { session } } = await sb.auth.getSession();
      if (session) {
        router.push(redirectUri);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use server-side API route to sign in (sets httpOnly cookies with .asix.live domain)
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Set the session client-side so CrossDomainCookieStorage writes
      // a readable cookie with Domain=.asix.live that subdomains can access
      if (supabase && data.access_token && data.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
      }

      // Redirect back to the originating app
      router.push(redirectUri);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setEmail('');
      setPassword('');
      setError('Check your email to confirm your account, then sign in.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to asix.live</h1>
          <p className="text-gray-400 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className={`mb-6 p-4 rounded ${error.includes('email') ? 'bg-yellow-500/10 border border-yellow-500/50 text-yellow-500' : 'bg-red-500/10 border border-red-500/50 text-red-500'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          <button
            onClick={handleSignUp}
            disabled={loading || !email || !password}
            className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium py-2 rounded transition-colors"
          >
            {loading ? 'Creating account...' : 'Create New Account'}
          </button>

          <p className="text-center text-gray-400 text-sm mt-6">
            This account will give you access to all asix apps and services.
          </p>
        </div>
      </div>
    </div>
  );
}
