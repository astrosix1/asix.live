'use client';

import { useState } from 'react';
import { signUp } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        try {
          // Use server-side API endpoint to set cookies with .asix.live domain
          console.log('Starting signin...');
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          console.log('Signin response status:', response.status);
          const data = await response.json();
          console.log('Signin response data:', data);

          if (!response.ok) {
            setError(data.error || 'Sign in failed');
            return;
          }

          // Set the session client-side so CrossDomainCookieStorage writes
          // a readable cookie with Domain=.asix.live (httpOnly cookies can't
          // be read by JavaScript, so we need this readable version too)
          if (supabase && data.access_token && data.refresh_token) {
            await supabase.auth.setSession({
              access_token: data.access_token,
              refresh_token: data.refresh_token,
            });
            console.log('Session set in browser client with cross-domain cookie');
          }

          // Signin succeeded - clear form and redirect
          setEmail('');
          setPassword('');
          setError(null);
          console.log('Signin successful, redirecting...');

          // Full reload so AuthProvider remounts and reads the new session cookies
          onClose();
          window.location.href = '/dashboard';
        } catch (err) {
          console.error('Signin error:', err);
          setError('An error occurred. Please try again.');
        }
      } else {
        // Sign up mode
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setError(null);
          setSignupSuccess(true);
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          {signupSuccess ? (
            <div className="p-6 space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-2">Account created successfully!</p>
                <p className="text-sm text-green-700 mb-4">
                  Check your email for a confirmation link. Click the link to verify your account, then you can sign in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSignupSuccess(false);
                  setMode('signin');
                  setEmail('');
                }}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...')
                : (mode === 'signin' ? 'Sign In' : 'Create Account')
              }
            </button>

            {/* Toggle Sign In / Sign Up */}
            <p className="text-center text-sm text-slate-600">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 font-medium hover:underline"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
