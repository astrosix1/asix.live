// Stripe price mappings for each app and plan
export const APP_PRICES: Record<string, Record<string, number>> = {
  basic: {
    free: 0,
    pro: 499, // $4.99/month
  },
  ascend: {
    free: 0,
    pro: 499, // $4.99/month
  },
  geointel: {
    free: 0,
    pro: 1900, // $19.00/month
  },
};

// Map of Stripe price IDs from environment variables
const STRIPE_PRICES: Record<string, Record<string, string>> = {
  basic: {
    free: '', // No charge for free tier
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || '',
  },
  ascend: {
    free: '', // No charge for free tier
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_ASCEND || '',
  },
  geointel: {
    free: '', // No charge for free tier
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_GEOINTEL || '',
  },
};

/**
 * Get the Stripe price ID for a given app and plan
 */
export function getStripePriceId(appSlug: string, plan: string): string | null {
  const priceId = STRIPE_PRICES[appSlug]?.[plan];
  if (!priceId) {
    console.warn(`No price ID found for ${appSlug}/${plan}`);
    return null;
  }
  return priceId;
}

/**
 * Format price in cents to display format (e.g., 999 → "$9.99")
 */
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}
