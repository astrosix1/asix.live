'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface SessionStatus {
  status: string;
  customer_email?: string;
  error?: string;
}

type ActivationState = 'idle' | 'activating' | 'done' | 'failed';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activation, setActivation] = useState<ActivationState>('idle');
  const [activatedSlugs, setActivatedSlugs] = useState<string[]>([]);
  const activationAttempted = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchSessionStatus = async () => {
      try {
        const { data: { session: authSession } } = await supabase!.auth.getSession();
        const token = authSession?.access_token;
        if (!token) {
          setSessionStatus({ status: 'error', error: 'Please sign in to view payment status' });
          return;
        }
        const response = await fetch(`/api/checkout/session-status?session_id=${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setSessionStatus(data);
      } catch {
        setSessionStatus({ status: 'error', error: 'Failed to retrieve payment status' });
      } finally {
        setLoading(false);
      }
    };

    fetchSessionStatus();
  }, [sessionId]);

  // Auto-activate as soon as we know payment succeeded and the user is loaded
  useEffect(() => {
    if (
      sessionStatus?.status !== 'paid' ||
      !sessionId ||
      !user ||
      activationAttempted.current
    ) {
      return;
    }

    activationAttempted.current = true;
    setActivation('activating');

    const activate = async () => {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        const token = session?.access_token;
        if (!token) throw new Error('No auth token');

        const response = await fetch('/api/checkout/confirm-subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (response.ok) {
          setActivatedSlugs(data.activated || []);
          setActivation('done');
        } else {
          console.error('Activation failed:', data.error);
          setActivation('failed');
        }
      } catch (err) {
        console.error('Activation error:', err);
        setActivation('failed');
      }
    };

    activate();
  }, [sessionStatus, user, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Session</h1>
            <p className="text-gray-600 mb-8">No session ID provided. Please start checkout again.</p>
            <Link
              href="/checkout"
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Checkout
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (sessionStatus?.error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{sessionStatus.error}</p>
            <Link
              href="/checkout"
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = sessionStatus?.status === 'paid';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isPaid ? (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for subscribing.
            </p>

            {sessionStatus.customer_email && (
              <p className="text-gray-600 mb-8">
                A confirmation email has been sent to <strong>{sessionStatus.customer_email}</strong>
              </p>
            )}

            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              {activation === 'activating' && (
                <div className="flex items-center justify-center gap-3 text-gray-700">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  <span>Activating your subscriptions...</span>
                </div>
              )}

              {activation === 'done' && (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Subscriptions Activated</h2>
                  <div className="space-y-2 text-left">
                    {activatedSlugs.map((slug) => (
                      <div key={slug} className="text-gray-700">
                        ✓ {slug.charAt(0).toUpperCase() + slug.slice(1)} activated
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activation === 'failed' && (
                <div className="text-center">
                  <p className="text-amber-700 mb-2">
                    Activation is still in progress — your payment was received.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Your subscription will activate within a few minutes. Check your dashboard shortly.
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/dashboard"
              className="inline-block w-full px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Pending</h1>
            <p className="text-gray-600 mb-8">Your payment is being processed. Please wait...</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Check Status Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
