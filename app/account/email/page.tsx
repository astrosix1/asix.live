'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { updateUserEmail } from '@/lib/auth';

export default function ChangeEmailPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!newEmail.trim()) {
      setError('Please enter a new email address');
      return;
    }

    if (newEmail === user.email) {
      setError('New email must be different from current email');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await updateUserEmail(newEmail);
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setNewEmail('');
        setTimeout(() => router.push('/dashboard'), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Change Email Address</h1>
          <p className="text-slate-400">Update the email associated with your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 p-8">
          <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">Current email</p>
            <p className="text-lg font-semibold text-white">{user.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-white mb-2">
                New Email Address
              </label>
              <input
                id="newEmail"
                type="email"
                placeholder="your.new.email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-800/60 rounded-lg">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-900/30 border border-green-800/60 rounded-lg">
                <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-400">Email updated successfully. Redirecting…</p>
              </div>
            )}

            {/* Button Group */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !newEmail.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating…' : 'Update Email'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 text-center px-6 py-3 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Info Note */}
          <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400">
              💡 A confirmation email will be sent to your new address. You may need to verify it before the change takes effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
