import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getSupabaseFromRequest } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@asix.live';

export async function DELETE(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  const supabase = await getSupabaseFromRequest(req);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.id;
  const userEmail = user.email || '';

  try {
    // Cancel all active Stripe subscriptions for this user
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id, status')
      .eq('user_id', userId)
      .not('stripe_subscription_id', 'is', null);

    if (subscriptions) {
      for (const sub of subscriptions) {
        if (sub.stripe_subscription_id && sub.status !== 'canceled') {
          try {
            await stripe.subscriptions.cancel(sub.stripe_subscription_id);
          } catch (err) {
            console.error(`Stripe cancel error for ${sub.stripe_subscription_id}:`, err);
          }
        }
      }
    }

    // Send confirmation email before deleting (once auth user is deleted, email is gone)
    if (resend && userEmail) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: userEmail,
          subject: 'Your Asix.live account has been deleted',
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc">
              <h2 style="color:#1e293b;margin-bottom:8px">Account deleted</h2>
              <p style="color:#475569;line-height:1.6">
                Your Asix.live account has been permanently deleted, along with all associated data and active subscriptions.
              </p>
              <p style="color:#475569;line-height:1.6">
                If you did not request this, please contact us immediately at
                <a href="mailto:collins.nick999@gmail.com" style="color:#d97706">collins.nick999@gmail.com</a>.
              </p>
              <p style="color:#94a3b8;font-size:13px;margin-top:24px">
                Note: billing records may be retained for up to 7 years for tax compliance purposes (GDPR Art. 17(3)(b)).
              </p>
              <p style="color:#94a3b8;font-size:13px">— The Asix.live Team</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Deletion confirmation email error:', emailErr);
      }
    }

    // Delete the Supabase auth user (cascades to user-owned data)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error('Supabase user deletion error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
