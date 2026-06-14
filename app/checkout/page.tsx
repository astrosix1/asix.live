'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { APP_PRICES, formatPrice } from '@/lib/stripe-prices';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface CartItem {
  appSlug: string;
  appName: string;
  plan: 'pro';
  price: number;
}

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const apps = [
    { slug: 'basic', name: 'Basic Tier', description: 'Access to small apps like WikiHole' },
    { slug: 'ascend', name: 'Ascend', description: 'Habit tracker and personal development' },
    { slug: 'geointel', name: 'GeoIntel', description: 'Geopolitical intelligence platform' },
  ];

  // Redirect unauthenticated visitors to login, then back here with plan preserved
  useEffect(() => {
    if (!loading && !user) {
      const plan = searchParams.get('plan');
      const returnTo = plan ? `/checkout?plan=${plan}` : '/checkout';
      router.replace(`/login?redirect=${encodeURIComponent(returnTo)}`);
    }
  }, [loading, user]);

  // Pre-select the product named in ?plan= query param (e.g. from the pricing page)
  useEffect(() => {
    const plan = searchParams.get('plan');
    if (!plan) return;
    const app = apps.find((a) => a.slug === plan);
    if (app && !cart.some((item) => item.appSlug === plan)) {
      const price = APP_PRICES[plan]?.pro || 0;
      setCart([{ appSlug: plan, appName: app.name, plan: 'pro', price }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const addToCart = (appSlug: string, appName: string) => {
    const price = APP_PRICES[appSlug]?.pro || 0;
    const existing = cart.find((item) => item.appSlug === appSlug);

    if (existing) {
      setCart(cart.filter((item) => item.appSlug !== appSlug));
    } else {
      setCart([...cart, { appSlug, appName, plan: 'pro', price }]);
    }
  };

  const isInCart = (appSlug: string) => cart.some((item) => item.appSlug === appSlug);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in first');
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout using the URL provided by Stripe
        window.location.href = data.url;
      } else if (data.sessionId) {
        // Fallback: construct URL if url not provided
        window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
      } else {
        alert('Failed to create checkout session: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect is firing via useEffect above; show spinner while it happens
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600">Redirecting to sign in…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Subscribe to Apps</h1>
          <p className="text-lg text-slate-600">
            Choose the apps you want to access. Select multiple to get a bundle!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Apps Grid */}
          <div className="lg:col-span-2 space-y-4">
            {apps.map((app) => (
              <div
                key={app.slug}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  isInCart(app.slug)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                onClick={() => addToCart(app.slug, app.name)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
                    <p className="text-slate-600 mt-2">{app.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatPrice(APP_PRICES[app.slug]?.pro || 0)}
                    </p>
                    <p className="text-sm text-slate-600">/month</p>
                  </div>
                </div>

                {/* Checkbox */}
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={isInCart(app.slug)}
                    onChange={() => {}} // Controlled by parent onClick
                    className="w-5 h-5 rounded border-slate-300"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700">
                    {isInCart(app.slug) ? 'Added to cart' : 'Add to cart'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {cart.length === 0 ? (
                <p className="text-slate-600 text-center py-8">No items in cart</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                    {cart.map((item) => (
                      <div key={item.appSlug} className="flex justify-between">
                        <span className="text-slate-700">{item.appName}</span>
                        <span className="font-medium text-slate-900">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-slate-900">Total:</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Proceed to Payment'}
                  </button>

                  <p className="text-xs text-slate-600 text-center mt-4">
                    You'll be redirected to Stripe to complete payment
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
