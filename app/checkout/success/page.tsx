'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

interface SessionStatus {
  status: string;
  customer_email?: string;
  line_items?: Array<{ price_id: string; product_id: string; quantity: number }>;
  metadata?: Record<string, string>;
  error?: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');

  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchSessionStatus = async () => {
      try {
        const response = await fetch(`/api/checkout/session-status?session_id=${sessionId}`);
        const data = await response.json();
        setSessionStatus(data);
      } catch (error) {
        console.error('Error fetching session status:', error);
        setSessionStatus({ error: 'Failed to retrieve payment status' });
      } finally {
        setLoading(false);
      }
    };

    fetchSessionStatus();
  }, [sessionId]);

  const handleConfirmSubscriptions = async () => {
    if (!sessionId || !sessionStatus?.line_items || !user) {
      alert('Missing session or user information');
      return;
    }

    setConfirmLoading(true);

    try {
      const response = await fetch('/api/checkout/confirm-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          lineItems: sessionStatus.line_items,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSessionStatus((prev) => ({ ...prev, ...data }));
      } else {
        alert('Failed to confirm subscriptions: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      alert('Failed to confirm subscriptions. Please try again.');
    } finally {
      setConfirmLoading(false);
    }
  };

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
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for subscribing. Your subscriptions are being activated.
            </p>

            {sessionStatus.customer_email && (
              <p className="text-gray-600 mb-8">
                A confirmation email has been sent to <strong>{sessionStatus.customer_email}</strong>
              </p>
            )}

            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Subscriptions Activated</h2>
              <div className="space-y-2 text-left">
                {sessionStatus.line_items?.map((item, idx) => (
                  <div key={idx} className="text-gray-700">
                    ✓ {item.product_id || 'Subscription'} activated
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleConfirmSubscriptions}
                disabled={confirmLoading}
                className="w-full px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {confirmLoading ? 'Confirming...' : 'Confirm Subscriptions'}
              </button>

              <Link
                href="/"
                className="block px-8 py-3 border border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Return to Home
              </Link>
            </div>

            <p className="text-sm text-gray-600 mt-8">
              Your subscriptions will be available immediately. You can manage them in your dashboard.
            </p>
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
