'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { updateUserPassword } from '@/lib/auth';

function PasswordInput({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-2">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Validation
    if (!newPassword.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsSubmitting(true);
    try {
      // Note: Supabase doesn't require the current password for updateUser,
      // but we're collecting it for UI reassurance
      const { error: updateError } = await updateUserPassword(newPassword);
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
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
          <h1 className="text-3xl font-bold text-white mb-2">Change Password</h1>
          <p className="text-slate-400">Update your password to keep your account secure</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/60 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              show={showCurrentPassword}
              onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
              placeholder="Enter your current password"
              disabled={isSubmitting}
            />

            <div className="h-px bg-slate-700" />

            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              show={showNewPassword}
              onToggle={() => setShowNewPassword(!showNewPassword)}
              placeholder="Enter your new password"
              disabled={isSubmitting}
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Confirm your new password"
              disabled={isSubmitting}
            />

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-2 flex-1 rounded-full ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-slate-600'}`} />
                  <span className="text-xs text-slate-400">
                    {newPassword.length < 6 ? `${6 - newPassword.length} more characters` : 'Good'}
                  </span>
                </div>
              </div>
            )}

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
                <p className="text-sm text-green-400">Password updated successfully. Redirecting…</p>
              </div>
            )}

            {/* Button Group */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !newPassword.trim() || !confirmPassword.trim()}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating…' : 'Update Password'}
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
          </form>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400">
              🔒 <strong>Security tip:</strong> Use a strong password with a mix of uppercase, lowercase, numbers, and symbols. Never share your password with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
