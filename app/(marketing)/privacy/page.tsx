import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | asix.live',
  description: 'How Asix collects, uses, and protects your personal information.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://asix.live/privacy' },
};

const EFFECTIVE_DATE = 'June 17, 2026';
const CONTACT_EMAIL = 'privacy@asix.live';

export default function PrivacyPage() {
  return (
    <div className="bg-[#0F172A] text-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-sm text-slate-400 mb-4">Last updated: {EFFECTIVE_DATE}</p>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-slate-400 mb-12">
          Asix (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates asix.live. This policy explains what
          personal data we collect, why we collect it, and your rights regarding that data.
        </p>

        <Section title="1. Who This Policy Applies To">
          <p>
            This policy applies to all visitors and subscribers of asix.live. If you are located in the
            European Economic Area (EEA), the United Kingdom, or California, additional rights described
            below apply to you.
          </p>
        </Section>

        <Section title="2. Data We Collect">
          <p className="mb-4">We collect only what is necessary to provide the service:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>
              <strong>Account data</strong> — your email address, collected when you create an account.
            </li>
            <li>
              <strong>Subscription data</strong> — your subscription status, plan, and billing period.
              Payment card details are processed and stored by Stripe, Inc. — we never see or store
              raw card numbers.
            </li>
            <li>
              <strong>Usage data</strong> — which products you are subscribed to and when you access
              them. We do not track detailed in-app behaviour at this time.
            </li>
            <li>
              <strong>Technical data</strong> — IP address and browser type, collected automatically
              by our infrastructure providers (Vercel, Supabase) for security and performance purposes.
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>To create and manage your account</li>
            <li>To process subscription payments via Stripe</li>
            <li>To deliver the products you are subscribed to</li>
            <li>To send transactional emails (subscription confirmations, receipts)</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
          <p className="mt-4">
            We do not sell your data to third parties. We do not use your data for advertising.
          </p>
        </Section>

        <Section title="4. Third-Party Processors">
          <p className="mb-4">We share your data only with the following service providers, under contract:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>
              <strong>Supabase</strong> — authentication and database hosting (US servers). Your email
              address and subscription records are stored here.
            </li>
            <li>
              <strong>Stripe, Inc.</strong> — payment processing. Stripe stores your billing information
              under their own{' '}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline"
              >
                privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Vercel</strong> — web hosting and edge network. Access logs may include IP addresses.
            </li>
          </ul>
        </Section>

        <Section title="5. Cookies">
          <p className="mb-4">We use only essential cookies required for the service to function:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>
              <strong>Authentication cookies</strong> — set by Supabase to maintain your login session.
              These are strictly necessary; the service cannot function without them.
            </li>
            <li>
              <strong>Checkout cookies</strong> — set by Stripe during the payment flow to secure the
              transaction. These are strictly necessary for completing a purchase.
            </li>
          </ul>
          <p className="mt-4">
            We do not use advertising, analytics tracking, or third-party marketing cookies.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your account data for as long as your account is active. If you delete your account,
            we delete your personal data within 30 days, except where we are legally required to retain
            certain records (for example, financial transaction records for tax purposes, which we retain
            for 7 years).
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p className="mb-4">
            Depending on your location, you have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>
              <strong>Access</strong> — request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong>Correction</strong> — ask us to correct inaccurate data.
            </li>
            <li>
              <strong>Deletion (GDPR Art. 17 / CCPA)</strong> — request that we delete your personal data.
              We will process deletion requests within 30 days.
            </li>
            <li>
              <strong>Portability</strong> — receive your data in a machine-readable format.
            </li>
            <li>
              <strong>Opt-out of sale (CCPA)</strong> — we do not sell personal information, so this
              right is already satisfied.
            </li>
          </ul>
          <p className="mt-4">
            To exercise any of these rights, email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-400 hover:text-amber-300 underline">
              {CONTACT_EMAIL}
            </a>
            . We will respond within 30 days.
          </p>
        </Section>

        <Section title="8. Security">
          <p>
            We use industry-standard security measures including TLS encryption in transit, row-level
            security on our database, and service-role-key isolation for server-side operations. No
            method of transmission over the internet is 100% secure; we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="9. Children">
          <p>
            Our services are not directed at children under 13. We do not knowingly collect personal data
            from children. If you believe a child has provided us with personal data, please contact us
            and we will delete it.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this policy from time to time. We will update the &quot;Last updated&quot; date at the
            top and, for material changes, notify you by email.
          </p>
        </Section>

        <Section title="11. Contact">
          <p>
            For privacy-related questions or to exercise your rights, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-400 hover:text-amber-300 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back to asix.live
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      <div className="text-slate-300 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
