import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | asix.live',
  description: 'Terms and conditions for using asix.live products and services.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://asix.live/terms' },
};

const EFFECTIVE_DATE = 'June 17, 2026';
const CONTACT_EMAIL = 'legal@asix.live';

export default function TermsPage() {
  return (
    <div className="bg-[#0F172A] text-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-sm text-slate-400 mb-4">Last updated: {EFFECTIVE_DATE}</p>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-slate-400 mb-12">
          These Terms of Service (&quot;Terms&quot;) govern your use of asix.live and the products and services
          offered by Asix (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating an account or subscribing to any
          product, you agree to these Terms.
        </p>

        <Section title="1. Services">
          <p>
            Asix provides web-based software products including Ascend (habit tracking), GeoIntel
            (geopolitical intelligence), and WikiHole (knowledge exploration). Products are provided on
            a subscription basis.
          </p>
        </Section>

        <Section title="2. Account Registration">
          <p>
            You must provide a valid email address to create an account. You are responsible for
            maintaining the confidentiality of your login credentials and for all activity under your
            account. You must be at least 13 years old to create an account.
          </p>
        </Section>

        <Section title="3. Subscriptions and Billing">
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>
              Subscriptions are billed monthly (or annually where offered) via Stripe, Inc.
            </li>
            <li>
              Billing occurs on the same day each month as your initial subscription date.
            </li>
            <li>
              You may cancel your subscription at any time. Cancellation takes effect at the end of the
              current billing period; you retain access until then.
            </li>
            <li>
              We do not offer prorated refunds for partial billing periods, except where required by law.
            </li>
            <li>
              If a payment fails, we will notify you and your subscription will enter a grace period.
              After repeated failures, your subscription may be cancelled.
            </li>
          </ul>
        </Section>

        <Section title="4. Refund Policy">
          <p>
            You may request a refund within 7 days of your initial subscription or renewal payment if
            you are unsatisfied with the service. Refund requests after 7 days are at our sole discretion.
            To request a refund, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber-400 hover:text-amber-300 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Use the services for any unlawful purpose</li>
            <li>Share your account credentials with others or allow multiple users to share one account</li>
            <li>Reverse engineer, decompile, or attempt to extract source code from our software</li>
            <li>Use automated means to access the services in a way that could disrupt or overload them</li>
            <li>Attempt to circumvent subscription restrictions or payment systems</li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content, software, and materials on asix.live — including product designs, text, graphics,
            and code — are owned by or licensed to Asix. These Terms do not grant you any rights to our
            intellectual property beyond using the services as intended.
          </p>
        </Section>

        <Section title="7. User Content">
          <p>
            For products that allow you to create content (such as habit entries in Ascend), you retain
            ownership of your content. You grant us a limited licence to store and display your content
            solely to provide the service.
          </p>
        </Section>

        <Section title="8. Disclaimers">
          <p className="mb-4">
            The services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
            express or implied, including warranties of merchantability, fitness for a particular purpose,
            or non-infringement.
          </p>
          <p>
            Health and habit content in our products (including Ascend) is for informational purposes only
            and does not constitute medical advice. Consult a qualified healthcare professional before
            making decisions about your health.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Asix shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including loss of profits, data, or goodwill,
            arising out of or in connection with these Terms or your use of the services. Our total
            liability for any claim shall not exceed the amount you paid us in the 12 months preceding
            the claim.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            We may suspend or terminate your account if you violate these Terms. You may close your
            account at any time by contacting us. On termination, your right to use the services ends
            immediately. We will delete your personal data in accordance with our{' '}
            <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>
            We may update these Terms from time to time. We will notify you of material changes by email
            at least 14 days before they take effect. Continued use of the services after changes take
            effect constitutes acceptance of the updated Terms.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms are governed by the laws of the United States. Any disputes shall be resolved
            in the courts of the jurisdiction in which Asix operates.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            For questions about these Terms, contact us at{' '}
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
