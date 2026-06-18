'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function DeleteAccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [emailInput, setEmailInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      if (!supabase) {
        setError('Authentication not configured.');
        setIsDeleting(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setError('Session expired. Please log in again.');
        setIsDeleting(false);
        return;
      }

      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete account. Please try again.');
        setIsDeleting(false);
        return;
      }

      await supabase.auth.signOut();
      router.push('/?account=deleted');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Delete Account</h1>
          <p className="text-slate-400">This action is permanent and cannot be undone.</p>
        </div>

        {step === 1 && (
          <div className="bg-[#1E293B] rounded-xl border border-red-900/40 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Before you continue</h2>
                <p className="text-slate-400 text-sm">Deleting your account will:</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Permanently delete your account and all stored data',
                'Cancel all active Ascend and GeoIntel subscriptions immediately',
                'Remove your usage history, settings, and in-app data',
                'Sign you out of all devices',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-8">
              <p className="text-xs text-slate-400">
                Billing records are retained for up to 7 years for tax compliance (GDPR Art. 17(3)(b)).
                All other personal data is deleted immediately. You will receive a confirmation email.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                Continue to Deletion
              </button>
              <Link href="/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full px-6 py-3 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-[#1E293B] rounded-xl border border-red-900/40 p-8">
            <h2 className="text-xl font-bold text-white mb-2">Confirm deletion</h2>
            <p className="text-slate-400 text-sm mb-6">
              Type your email address to permanently delete your account.
            </p>

            <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-400 mb-1">Account email</p>
              <p className="text-base font-semibold text-white">{user.email}</p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-white mb-2">
                Type your email to confirm
              </label>
              <input
                id="confirmEmail"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={user.email || ''}
                disabled={isDeleting}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-800/60 rounded-lg mb-6">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={emailInput !== user.email || isDeleting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Deleting…' : 'Permanently Delete Account'}
              </button>
              <button
                onClick={() => { setStep(1); setEmailInput(''); setError(null); }}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
