'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getProjectSubscription, Subscription } from '@/lib/subscriptions';

interface UseSubscriptionResult {
  subscription: Subscription | null;
  loading: boolean;
  error: Error | null;
  hasAccess: boolean;
  isActive: boolean;
}

/**
 * Hook to check user's subscription status for a project
 * Used by embedded apps to determine access
 */
export function useSubscription(projectSlug: string): UseSubscriptionResult {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when user changes
    if (!user) {
      setSubscription(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Fetch subscription
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectSubscription(user.id, projectSlug);
        setSubscription(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, projectSlug]);

  return {
    subscription,
    loading,
    error,
    hasAccess: subscription?.status === 'active' || subscription?.status === 'trialing',
    isActive: subscription?.status === 'active',
  };
}
